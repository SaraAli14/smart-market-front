import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IoArrowBack, IoLocationSharp } from "react-icons/io5";
import { fetchProductById } from "../api";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.state?.lang || "ar";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);

        if (!data) {
          setError(lang === "en" ? "Product not found" : "المنتج غير موجود");
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError(lang === "en" ? "Something went wrong" : "حصل خطأ");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, lang]);

  if (loading)
    return (
      <div className="center">
        {lang === "en" ? "Loading..." : "جاري التحميل..."}
      </div>
    );

  if (error)
    return (
      <div className="center">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => navigate(-1)}>رجوع</button>
      </div>
    );

  return (
    <div className="product-container">
      <button onClick={() => navigate(-1)}>
        <IoArrowBack size={24} />
      </button>

      <img src={product.image} alt={product.name[lang]} />

      <h3>{product.name[lang]}</h3>
      <p>{product.description?.[lang]}</p>
      <p>{product.price} EGP</p>

      <div>
        <IoLocationSharp />
        {product.location?.[lang]}
      </div>
    </div>
  );
}
