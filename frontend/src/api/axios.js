import axios from 'axios';

// Get the base URLs from the environment variables you created in the .env file
const AUTH_URL = import.meta.env.VITE_AUTH_API_URL;
const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_API_URL;
const UPLOAD_URL = import.meta.env.VITE_UPLOAD_API_URL;

// Axios instance for the User-Auth Service (port 5000)
export const authApi = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true, // This is crucial for sending cookies
});

// Axios instance for the Analytics Service (port 5001)
export const analyticsApi = axios.create({
  baseURL: ANALYTICS_URL,
  withCredentials: true,
});

// Axios instance for the Data-Upload Service (port 5002)
export const uploadApi = axios.create({
  baseURL: UPLOAD_URL,
  withCredentials: true,
});

