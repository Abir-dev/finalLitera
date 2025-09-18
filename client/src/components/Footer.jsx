// src/components/Footer.jsx
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

import Logo from "../assets/kinglogo.png"



import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-premium text-white rounded-t-[4.5rem] sm:rounded-t-[4rem]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Newsletter Signup */}
        <div className="text-center mb-12">
          <div className="card-premium p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Stay Updated</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Get the latest course updates, industry insights, and exclusive offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-premium flex-1"
              />
              <button className="btn-premium px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + blurb + CTA */}
          <div>
            <img src={Logo} alt="Logo" className="h-16 w-16" />
            <div className="text-3xl font-bold text-white">LITERA</div>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--text-secondary)]">
              A Best Platform Enroll in your Special Course A Best Platform Enroll
              in your Special Course. {/* duplicated tone to mirror screenshot text flow */} 
            </p>
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 mt-6 font-semibold text-white btn-premium"
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
            <div className="footer-heading">Services</div>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-white/40 text-[color:var(--text-secondary)]">
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
            <div className="footer-heading">Connect with Us</div>
            <p className="mt-3 text-sm text-[color:var(--text-secondary)]">
              Follow us on social media for updates and insights
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="flex items-center gap-2 footer-link hover:underline"><FaFacebook />Facebook</a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 footer-link hover:underline"><FaInstagram />Instagram</a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 footer-link hover:underline"><FaLinkedin />LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 divider-premium" />

        {/* Bottom row */}
        <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-[color:var(--text-secondary)]">
          <div>© {year} Kin-G Technologies Pvt. Ltd. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="footer-link hover:underline">Privacy Policy</Link>
            <Link to="/terms-conditions" className="footer-link hover:underline">Terms & Conditions</Link>
            <Link to="/refund-policy" className="footer-link hover:underline">Refund Policy</Link>
            <Link to="#" className="footer-link hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
