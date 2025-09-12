import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b3b6b] to-[#163257] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">How we protect your personal information</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1b3b6b] mb-6">Kin-G Technologies</h2>
            <h3 className="text-xl font-semibold mb-4">Privacy Policy</h3>
            <p className="mb-6 text-gray-700">
              At Kin-G Technologies, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit or make a purchase from our website.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">1. Information We Collect</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li><strong>Personal Information:</strong> Name, email address, phone number, billing/shipping address, and payment details.</li>
              <li><strong>Non-Personal Information:</strong> Browser type, device information, IP address, and cookies for site analytics and performance.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">2. How We Use Your Information</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>To process and deliver your orders.</li>
              <li>To provide customer support and order updates.</li>
              <li>To improve website functionality and user experience.</li>
              <li>To send promotional offers (only if you opt-in).</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">3. Data Protection</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Payment transactions are securely encrypted through trusted gateways.</li>
              <li>We do not store sensitive payment details on our servers.</li>
              <li>Access to personal information is restricted to authorized staff only.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">4. Sharing of Information</h4>
            <p className="mb-6 text-gray-700">
              We do not sell or rent your information. We may share limited details only with trusted third parties such as courier partners and payment processors, solely for order fulfillment.
            </p>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">5. Cookies</h4>
            <p className="mb-6 text-gray-700">
              We use cookies to personalize your browsing experience, remember preferences, and analyze traffic. You can manage or disable cookies in your browser settings.
            </p>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">6. Your Rights</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>You may request access, correction, or deletion of your personal information.</li>
              <li>You may unsubscribe from promotional communications at any time.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">7. Policy Updates</h4>
            <p className="mb-6 text-gray-700">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last Updated" date.
            </p>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">8. Contact Us</h4>
            <p className="mb-4 text-gray-700">If you have any questions about this Privacy Policy, please reach out to us at:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Email: admin@kingtechs.in</li>
              <li>Phone: +91-8910481993</li>
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
            to="/terms-conditions"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Terms & Conditions
          </Link>
          <Link
            to="/refund-policy"
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            View Refund Policy
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

export default PrivacyPolicy;
