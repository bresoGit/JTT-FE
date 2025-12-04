// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { TicketProvider } from "./context/TicketContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <TicketProvider>
          <App />
        </TicketProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
