import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL;

const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users`, userData);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/api/users`);
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/api/users/${id}`);
  return response.data;
};

const updateUserById = async (id, userData) => {
  const response = await axios.put(`${API_URL}/api/users/${id}`, userData);
  return response.data;
};

const deleteUserById = async (id) => {
  const response = await axios.delete(`${API_URL}/api/users/${id}`);
  return response.data;
};

const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default userService;
