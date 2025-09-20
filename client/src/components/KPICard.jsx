import React from "react";

const KPICard = ({
  icon,
  value,
  label,
  iconColor,
  iconBackground,
  iconBorder,
  className = "",
}) => {
  return (
    <div
      className={`card-premium kpi-card p-3 text-center group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/30 ${className}`}
      style={{ height: "120px", minHeight: "120px", maxHeight: "120px" }}
    >
      <div
        className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-xl flex items-center justify-center"
        style={{
          background: iconBackground,
          border: iconBorder,
        }}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          style={{ color: iconColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <div
        className="text-lg sm:text-xl md:text-2xl font-bold mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </div>
      <div
        className="text-xs font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </div>
    </div>
  );
};

export default KPICard;
