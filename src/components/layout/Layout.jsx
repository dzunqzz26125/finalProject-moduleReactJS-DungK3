import React from "react";
import Header from "../layout/Header";
import Sibebar from "../layout/Sibebar";
import { Outlet } from "react-router-dom";
import Footer from "../layout/Footer";
import { ThemeProvider } from "../../lib/ThemeContext";

const Layout = () => {
  return (
    <ThemeProvider>
      <div>
        <Header />
        <Sibebar />
        <Outlet />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
