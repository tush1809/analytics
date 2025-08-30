import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import { useNavigate } from "react-router-dom";

// 1. Import your new, configured 'authApi' instance
import { authApi } from '../api/axios'; 

// 2. Import the action types for your authentication context
import { actions } from "../context/AuthContext.jsx";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      // 3. Use 'authApi' and the relative path. 
      // The 'baseURL' and 'withCredentials' are already set in authApi.
      const res = await authApi.post(
        '/api/auth/login',
        { email, password }
      );

      // Dispatch login action
      dispatch({ type: actions.LOGIN, payload: res.data });
      
      setIsLoading(false);
      
      // Redirect to dashboard on success
      navigate("/datahub"); 

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};

