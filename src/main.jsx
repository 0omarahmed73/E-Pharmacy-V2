import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toggle/style.css" // for ES6 modules
import 'react-tooltip/dist/react-tooltip.css'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ShowProvider } from "./context/ShowContext.jsx";
import MedicinesProvider from "./context/MedicinesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShowProvider>
      <AuthProvider>
        <MedicinesProvider>
        <App />
        </MedicinesProvider>
      </AuthProvider>
      </ShowProvider>
    </BrowserRouter>
  </React.StrictMode>
);
