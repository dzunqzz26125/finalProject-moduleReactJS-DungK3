import React from "react";
import Header from "../components/Header";
import Sibebar from "../components/Sibebar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import { ThemeProvider } from "../lib/ThemeContext";

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
