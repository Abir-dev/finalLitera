// src/components/StatsSection.jsx
import liveIcon from "../assets/pic1.png";      // replace with your exact icon
import doubtIcon from "../assets/pic2.png";   // replace with your exact icon
import notesIcon from "../assets/pic3.png";   // replace with your exact icon
import medalIcon from "../assets/pic4.png";   // replace with your exact icon

export default function StatsSection() {
  const stats = [
    {
      icon: liveIcon,
      title: "Daily Live",
      desc: "Interactive classes",
    },
    {
      icon: doubtIcon,
      title: "24 × 7",
      desc: "Doubt solving sessions",
    },
    {
      icon: notesIcon,
      title: "1 Million +",
      desc: "Tests, sample papers & notes",
    },
    {
      icon: medalIcon,
      title: "20 +",
      desc: "Online Courses",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-4 bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)]">

        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center px-6 py-10 relative"
          >
            {/* Icon */}
            <img src={item.icon} alt={item.title} className="w-16 h-16 mb-4" />

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>

            {/* Description */}
            <p className="text-sm text-slate-600 mt-1">{item.desc}</p>

            {/* Divider (only between cards) */}
            {index !== stats.length - 1 && (
              <div className="hidden md:block absolute top-6 bottom-6 right-0 w-px bg-blue-300"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
