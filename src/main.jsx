import React from 'react'
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "@/style/App.css";
import UserProvider from "@/context/UserContext.jsx"
import { NotificationProvider } from '@/pages/admin/calendar.jsx';
import ToastProvider from "@/widgets/components/toast/ToastProvider.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ToastProvider>
          <ThemeProvider>
            <MaterialTailwindControllerProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </MaterialTailwindControllerProvider>
          </ThemeProvider>
        </ToastProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
