import axios from 'axios';

const API_URL = process.env.REACT_APP_BASE_URL;

const createActivityLog = async (activityLogData) => {
  const response = await axios.post(`${API_URL}/api/activitylogs`, activityLogData);
  return response.data;
};

const getAllActivityLogs = async () => {
  const response = await axios.get(`${API_URL}/api/activitylogs`);
  return response.data;
};

const getActivityLogById = async (id) => {
  const response = await axios.get(`${API_URL}/api/activitylogs/${id}`);
  return response.data;
};

const activityLogService = {
  createActivityLog,
  getAllActivityLogs,
  getActivityLogById,
};

export default activityLogService;