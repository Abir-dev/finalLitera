// src/pages/Billing.jsx
import { useState } from "react";

const brand = { blue: "#18457A", green: "#16a34a", red: "#dc2626" };

function BillingCard({ title, amount, status, date, type }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return brand.green;
      case "Pending": return "#f59e0b";
      case "Failed": return brand.red;
      default: return "#6b7280";
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{type}</p>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {status}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-900">₹{amount}</p>
          <p className="text-sm text-slate-500 mt-1">Due: {date}</p>
        </div>
        <button className="px-4 py-2 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50">
          {status === "Paid" ? "View Receipt" : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

function PaymentMethodCard({ type, last4, expiry, isDefault }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 bg-slate-200 rounded flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-600">{type}</span>
          </div>
          <div>
            <p className="font-semibold text-slate-900">•••• •••• •••• {last4}</p>
            <p className="text-sm text-slate-500">Expires {expiry}</p>
          </div>
        </div>
        {isDefault && (
          <span className="px-2 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: brand.green }}>
            Default
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50">
          Edit
        </button>
        <button className="flex-1 px-3 py-2 rounded-full border border-slate-300 text-sm font-medium hover:bg-slate-50">
          Remove
        </button>
      </div>
    </div>
  );
}

export default function Billing() {
  const [activeTab, setActiveTab] = useState("invoices");

  const invoices = [
    { id: 1, title: "Machine Learning Course", amount: "4,999", status: "Paid", date: "Dec 15, 2024", type: "Course Purchase" },
    { id: 2, title: "Data Science Bundle", amount: "7,499", status: "Pending", date: "Dec 20, 2024", type: "Course Purchase" },
    { id: 3, title: "Premium Subscription", amount: "1,499", status: "Failed", date: "Dec 10, 2024", type: "Monthly Subscription" },
  ];

  const paymentMethods = [
    { id: 1, type: "VISA", last4: "4242", expiry: "12/25", isDefault: true },
    { id: 2, type: "MASTERCARD", last4: "8888", expiry: "08/26", isDefault: false },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: brand.blue }}>
            Billing & Payments
          </h1>
          <p className="text-[12px] text-slate-500 mt-1">Manage your billing information and payment methods</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: brand.blue }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Payment Method
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "invoices" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveTab("invoices")}
        >
          Invoices
        </button>
        <button
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "payment-methods" 
              ? "border-blue-500 text-blue-600" 
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
          onClick={() => setActiveTab("payment-methods")}
        >
          Payment Methods
        </button>
      </div>

      {/* Content */}
      {activeTab === "invoices" && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <BillingCard key={invoice.id} {...invoice} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "payment-methods" && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} {...method} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
