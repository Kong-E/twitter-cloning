import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Navigation from "./Navigation";
import Profile from "../routes/Profile";

const Router = ({ isLoggedIn }) => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? (
        <>
          <Navigation />
          <Home />
        </>
      ) : (
        <>
          <Navigation />
          <Auth />
        </>
      ),
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};
export default Router;