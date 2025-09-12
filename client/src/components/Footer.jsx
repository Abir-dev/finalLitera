// src/components/Footer.jsx
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

import Logo from "../assets/kinglogo.png"



import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1B4A8B] text-white rounded-t-[4.5rem] sm:rounded-t-[4rem]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + blurb + CTA */}
          <div>
            <img src={Logo} alt="Logo" className="h-20 w-20" />
            <div className="text-4xl font-extrabold tracking-wide">LITERA</div>
            <p className="mt-4 text-sm leading-relaxed text-indigo-100">
              A Best Platform Enroll in your Special Course A Best Platform Enroll
              in your Special Course. {/* duplicated tone to mirror screenshot text flow */} 
            </p>
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 mt-6 font-semibold text-white"
            >
              Enroll Now
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 stroke-[2.5] fill-none stroke-current transition-transform group-hover:translate-x-0.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Services list */}
          <div>
            <div className="font-semibold">Services</div>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-white/70 text-indigo-100">
              <li>Web Development</li>
              <li>Mobile Applications</li>
              <li>CRM Integration</li>
              <li>Data Analytics</li>
              <li>Cloud Solutions</li>
              <li>AI Integration</li>
            </ul>
          </div>

          {/* Connect with us */}
          <div>
            <div className="font-semibold">Connect with Us</div>
            <p className="mt-3 text-sm text-indigo-100">
              Follow us on social media for updates and insights
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline"><FaFacebook />Facebook</a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline"><FaInstagram />Instagram</a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 hover:underline"><FaLinkedin />LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-white/15" />

        {/* Bottom row */}
        <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-indigo-100">
          <div>© {year} Kin-G Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:underline">Terms & Conditions</Link>
            <Link to="/refund-policy" className="hover:underline">Refund Policy</Link>
            <Link to="#" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
