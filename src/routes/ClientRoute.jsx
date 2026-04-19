import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Task from "../pages/task/Task";
import Layout from "../components/layout/Layout";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Introduce from "../pages/introducePage/Introduce";
import ProtectedRoute from "./ProtectedRoute";
import Workspaces from "../pages/workspace/Workspaces";
import BoardDetail from "../pages/Board/BoardDetail";
import Dashboard from "../pages/dashboard/Dashboard";
import Notifications from "../pages/notifications/Notifications";
import Calendar from "../pages/calendar/Calendar";

const routes = createBrowserRouter([
  { path: "/", element: <Introduce /> },
  { path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "task", element: <Task /> },
      { path: "workspaces", element: <Workspaces /> },
      { path: "workspaces/:workspaceId/board/:boardId", element: <BoardDetail /> },
      { path: "notifications", element: <Notifications /> },
      { path: "calendar", element: <Calendar /> },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

const ClientRoute = () => <RouterProvider router={routes} />;

export default ClientRoute;
