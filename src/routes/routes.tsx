import { createBrowserRouter } from "react-router";

import Hero from "../pages/Hero";
import Login from "../pages/Login";

import RootLayout from "../layout/RootLayout";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Hero /> },
      { path: "auth", children: [{ path: "login", element: <Login /> }] },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
]);

export default router;
