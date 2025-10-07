import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL;

const createPurchase = async (purchaseData) => {
  const response = await axios.post(`${API_URL}/api/purchases`, purchaseData);
  return response.data;
};

const getAllPurchases = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  const response = await axios.get(`${API_URL}/api/purchases?${params}`);
  return response.data;
};

const getPurchaseById = async (id) => {
  const response = await axios.get(`${API_URL}/api/purchases/${id}`);
  return response.data;
};

const updatePurchaseById = async (id, purchaseData) => {
  const response = await axios.put(`${API_URL}/api/purchases/${id}`, purchaseData);
  return response.data;
};

const deletePurchaseById = async (id) => {
  const response = await axios.delete(`${API_URL}/api/purchases/${id}`);
  return response.data;
};

const purchaseService = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchaseById,
  deletePurchaseById,
};

export default purchaseService;