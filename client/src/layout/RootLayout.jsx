// src/layout/RootLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function RootLayout() {
  const location = useLocation();
  
  // Pages that handle their own container/layout
  const fullWidthPages = ['/courses'];
  const isFullWidth = fullWidthPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${isFullWidth ? '' : 'container-premium'}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
