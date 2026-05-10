const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

export const API_ENDPOINTS = {
  GENERATE_NOTES: `${API_BASE_URL}/api/generate-notes`,
};

const config = {
  API_BASE_URL,
  API_ENDPOINTS
};

export default config;
