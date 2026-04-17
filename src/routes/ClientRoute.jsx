import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../pages/Layout";
import Task from "../pages/Task";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Introduce from "../pages/Introduce";
import ProtectedRoute from "./ProtectedRoute";
import Workspaces from "../pages/Workspaces";
import BoardDetail from "../pages/BoardDetail";
import Dashboard from "../pages/Dashboard";
import Notifications from "../pages/Notifications";

const routes = createBrowserRouter([
  { path: "/", element: <Introduce /> },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "task", element: <Task /> },
      { path: "workspaces", element: <Workspaces /> },
      { path: "board/:boardId", element: <BoardDetail /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

const ClientRoute = () => <RouterProvider router={routes} />;

export default ClientRoute;
