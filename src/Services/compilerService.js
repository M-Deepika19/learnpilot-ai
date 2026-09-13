import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api/compiler';
export const runCode = async (language, code, input = '') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/run`, {
      language,
      code,
      input
    });

    return response.data;
  } catch (error) {
    console.error('Code execution error:', error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unable to execute code.';

    throw new Error(errorMessage);
  }
};
export const checkCompilerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);

    return response.data;
  } catch (error) {
    console.error('Compiler health check error:', error);

    throw new Error('Compiler service is unavailable.');
  }
};