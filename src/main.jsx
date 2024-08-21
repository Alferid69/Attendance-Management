import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import { StudentsProvider } from "./context/StudentsProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StudentsProvider>
      <App />
    </StudentsProvider>
  </React.StrictMode>
);
