import { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export const actions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};


export const authReducer = (state, action) => {
  switch (action.type) {
    case actions.LOGIN:
      return { user: action.payload }; // This is okay
    case actions.LOGOUT:
      return { user: null }; // This is okay
    case "INITIALIZE_AUTH":
      // The error is likely here!
      return { user: action.payload, firstname: action.payload.firstname };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: undefined,
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Load user on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/get-user`, {
          withCredentials: true,
        });

        // if user exists, then save in context
        console.log(response.data.user);
        
        dispatch({ type: actions.LOGIN, payload: response.data.user });

        if (location.pathname === "/login") {
          navigate("/dashboard"); // redirect to home page after login
        }
      } catch (error) {
        // logout if refresh token is expired or invalid
        if (error.response.status === 401 || error.response.status === 404) {
          dispatch({ type: actions.LOGOUT });
          if (
            location.pathname !== "/login" &&
            location.pathname !== "/signup"
          ) {
            navigate("/login"); // Navigate to login only if not already there
          }
        } else {
          console.log("An unexpected error occured. ", error);
        }
      }
    };

    loadUser();
  }, []);

  // console.log(state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
