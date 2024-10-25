import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";

import { useState } from "react";
import React from "react";
import Navbar from "./components/navbar";
import TransitionProvider from "./components/TransitionProvider/page";
import { useAuth } from "./context/AuthContext";

const AppLayout = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
