import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";

import { useState } from "react";
import React from "react";
import Navbar from "./components/navbar";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
