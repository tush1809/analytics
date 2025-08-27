import { useState } from "react";
import { useAuthContext } from "./useAuthContext.js";
import axios from "axios";
import { actions } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL; // should be http://54.159.4.186:5000

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } // ✅ important for cookies
      );

      // dispatch login action
      dispatch({ type: actions.LOGIN, payload: res.data });

      // redirect to dashboard
      navigate("/dashboard");

      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};

