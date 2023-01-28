import React from 'react'
import './index.css'
import { createRoot } from "react-dom/client";
import {createBrowserRouter,RouterProvider} from "react-router-dom";
import WatchList from './WatchList';
import HomePage from './HomePage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "watchlist",
    element: <WatchList/>,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

