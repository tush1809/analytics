import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import your new, configured 'authApi' instance
import { authApi } from '../api/axios';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate();

  const signup = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use 'authApi' and the relative path. 
      // The base URL and credentials config are already included.
      const response = await authApi.post('/api/auth/register', formData);

      console.log("User registered successfully!", response.data);
      
      // Redirect to the login page after successful signup
      navigate("/login");

    } catch (err) {
      // Set a specific error message from the backend if available
      setError(err.response?.data?.message || "An unknown error occurred during signup.");
    } finally {
      // This ensures isLoading is always set to false when the process ends
      setIsLoading(false); 
    }
  };

  return { signup, isLoading, error };
};

