import axios from "axios";

const API_URL =
  "https://smart-market-back-production.up.railway.app/api/products";

export const fetchProducts = async (categoryId) => {
  try {
    // خليها تبعت categoryId زي ما الباك مستني
    const res = await axios.get(`${API_URL}?categoryId=${categoryId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchProductById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
