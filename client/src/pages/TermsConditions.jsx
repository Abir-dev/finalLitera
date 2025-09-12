import React from "react";
import { Link } from "react-router-dom";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b3b6b] to-[#163257] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl opacity-90">Please read our terms carefully</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1b3b6b] mb-6">Kin-G Technologies</h2>
            <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
            <p className="mb-6 text-gray-700">
              Welcome to Kin-G Technologies. ("Company", "we", "our", or "us"). By accessing or using our services, website, or programs (collectively, the "Services"), you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">1. Eligibility</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>You must be at least 18 years old to use our Services.</li>
              <li>By registering, you confirm that the information you provide is accurate and complete.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">2. Services</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>We provide technology solutions, and Launchpad programs for individuals and businesses.</li>
              <li>We reserve the right to modify, suspend, or discontinue any part of our Services at any time without prior notice.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">3. User Responsibilities</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>You agree not to misuse our Services or engage in unlawful activities.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>Any content shared with us must not violate intellectual property or third-party rights.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">4. Payments & Refunds</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Fees for our Services must be paid as per the agreed terms during registration or contract.</li>
              <li>Refunds, if applicable, will follow our Refund Policy.</li>
              <li>We are not liable for any transaction failures caused by third-party payment gateways.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">5. Intellectual Property</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>All content, logos, trademarks, and materials on our website and within our Services remain the property of Kin-G Technologies.</li>
              <li>You may not copy, reproduce, distribute, or exploit any part of our Services without written permission.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">6. Confidentiality & Data Privacy</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>We respect your privacy. All personal data is handled in accordance with our Privacy Policy.</li>
              <li>You agree not to disclose any confidential information received during the course of our Services.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">7. Limitation of Liability</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>We strive to ensure accurate and reliable Services but make no guarantees of uninterrupted availability.</li>
              <li>We shall not be held liable for any direct, indirect, or incidental damages resulting from the use of our Services.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">8. Termination</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>We may suspend or terminate your access to Services if you breach these Terms.</li>
              <li>Upon termination, your right to use our Services will immediately cease.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">9. Governing Law</h4>
            <p className="mb-6 text-gray-700">
              These Terms & Conditions are governed by and construed in accordance with the laws of India.
            </p>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">10. Contact Us</h4>
            <p className="mb-4 text-gray-700">For any questions about these Terms & Conditions, please contact us at:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Email: admin@kingtechs.in</li>
              <li>Phone: 8910481993</li>
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            to="/refund-policy"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Refund Policy
          </Link>
          <Link
            to="/privacy-policy"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            View Privacy Policy
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

    </div>
  );
};

export default TermsConditions;
