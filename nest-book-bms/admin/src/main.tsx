import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Login } from "./pages/Login/index.tsx";
import { Register } from "./pages/Register/index.tsx";
import { BookManage } from "./pages/BookManage/index.tsx";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "book-manage",
        element: <BookManage />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
