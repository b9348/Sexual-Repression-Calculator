import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";

// GitHub Pages SPA 重定向恢复
// 从 404.html 重定向回来后，恢复原始路径
const RedirectHandler = () => {
  useEffect(() => {
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      window.history.replaceState(null, '', redirect);
    }
  }, []);
  
  return null;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RedirectHandler />
    <App />
  </StrictMode>
);
