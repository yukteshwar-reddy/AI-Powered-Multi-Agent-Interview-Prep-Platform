import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

export const uploadResume = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/upload-resume`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const startInterview = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/start-interview`, data);
  return response.data;
};

export const submitAnswer = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/submit-answer`, data);
  return response.data;
};

export const getFeedback = async (interviewId) => {
  const response = await axios.get(`${API_BASE_URL}/feedback/${interviewId}`);
  return response.data;
};
