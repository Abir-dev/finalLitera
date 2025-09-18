// src/layout/RootLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container-premium">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
