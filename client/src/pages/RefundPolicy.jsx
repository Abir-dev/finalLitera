import React from "react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1b3b6b] to-[#163257] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund & Cancellation Policy</h1>
          <p className="text-xl opacity-90">Transparent and fair refund practices</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose max-w-none">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#1b3b6b] mb-6">Kin-G Technologies</h2>
            <h3 className="text-xl font-semibold mb-4">Refund & Cancellation Policy</h3>
            <p className="mb-6 text-gray-700">
              At Kin-G Technologies, we value our clients and aim to provide transparent and fair refund practices. This Refund Policy applies to all our Services, including the Launchpad program and digital solutions.
            </p>
            
            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">1. General Policy</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>All payments made for our Services are considered final unless otherwise stated in this policy.</li>
              <li>Refunds will only be granted in situations where services have not been delivered as promised or as specified below.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">2. Launchpad Program (Training / Guidance Services)</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Participants are eligible for a 100% refund if they apply for a refund within 30 days (1 month) of registration.</li>
              <li>After 30 days from registration, no refunds will be provided under any circumstances.</li>
              <li>Refund requests must be submitted in writing to our official support channel.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">3. Project-Based / Digital Solutions</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>For project-based work, advance payments are non-refundable once the project has started.</li>
              <li>If a project is canceled by the client before work begins, a refund minus 25% processing fees will be issued.</li>
              <li>If we are unable to deliver the project due to internal reasons, a full refund will be processed.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">4. Payment Gateway Charges</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Any transaction charges or gateway fees (Razorpay, Cashfree, etc.) are non-refundable and will be deducted from the refund amount.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">5. Refund Process</h4>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Eligible refunds will be processed within 7–10 business days from the date of approval.</li>
              <li>Refunds will be credited to the original mode of payment only.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">6. No Refund Conditions</h4>
            <p className="mb-3 text-gray-700">Refunds will not be provided in the following cases:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Client dissatisfaction due to change of mind after service delivery (except Launchpad policy mentioned above).</li>
              <li>Delay caused by the client in providing required information or approvals.</li>
              <li>Misuse of our Services or violation of Terms & Conditions.</li>
            </ul>

            <h4 className="text-lg font-semibold mb-3 text-[#1b3b6b]">7. Contact for Refunds</h4>
            <p className="mb-4 text-gray-700">To request a refund, contact us at:</p>
            <ul className="list-disc ml-6 mb-6 text-gray-700">
              <li>Email: admin@kingtechs.in</li>
              <li>Phone: +91- 89104819693</li>
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

export default RefundPolicy;
