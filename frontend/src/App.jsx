import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Import pages
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthContextProvider } from "./context/AuthContext";
import DataHub from "./pages/DataHub";

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/datahub" element={<DataHub />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
