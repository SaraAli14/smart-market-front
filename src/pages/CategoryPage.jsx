import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchProducts } from "../api";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.state?.lang || "ar";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProducts();
  }, [id]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts(id);
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="center">
        <p>{lang === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    );
  }

  return (
    <div className="category-container">
      {products.length === 0 ? (
        <div className="center">
          <p>{lang === "en" ? "No products found" : "لا يوجد منتجات"}</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((item) => (
            <div
              key={item._id}
              className="product-card"
              onClick={() =>
                navigate(`/product/${item.id}`, { state: { lang } })
              }
            >
              <img
                src={item.image}
                alt={item.name[lang]}
                className="product-image"
              />
              <div className="product-info">
                <h4 className="product-name">{item.name[lang]}</h4>
                <p className="product-price">{item.price} EGP</p>
                <p className="product-loc">{item.location?.[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
