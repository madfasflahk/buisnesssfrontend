import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL;

const createSaleReturn = async (returnData) => {
  const response = await axios.post(`${API_URL}/api/returns`, returnData);
  return response.data;
};

const createPurchaseReturn = async (returnData) => {
  const response = await axios.post(`${API_URL}/api/returns`, returnData);
  return response.data;
};

const getAllReturns = async () => {
  const response = await axios.get(`${API_URL}/api/returns`);
  return response.data;
};

const getReturnById = async (id) => {
  const response = await axios.get(`${API_URL}/api/returns/${id}`);
  return response.data;
};

const updateReturnById = async (id, returnData) => {
  const response = await axios.put(`${API_URL}/api/returns/${id}`, returnData);
  return response.data;
};

const deleteReturnById = async (id) => {
  const response = await axios.delete(`${API_URL}/api/returns/${id}`);
  return response.data;
};

const returnService = {
  createSaleReturn,
  createPurchaseReturn,
  getAllReturns,
  getReturnById,
  updateReturnById,
  deleteReturnById,
};

export default returnService;