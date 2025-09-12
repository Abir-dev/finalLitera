import React from "react";

const liveClasses = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    teacher: "Andrew Ng",
    time: "Now",
    videoUrl: "https://www.youtube.com/embed/GwIo3gDZCVQ"
  },
  
  {
    id: 4,
    title: "Neural Networks Simplified",
    teacher: "3Blue1Brown",
    time: "Now",
    videoUrl: "https://www.youtube.com/embed/aircAruvnKk"
  },
  {
    id: 5,
    title: "Deep Learning Introduction",
    teacher: "Simplilearn",
    time: "Now",
    videoUrl: "https://www.youtube.com/embed/JxgmHe2NyeY"
  },
  {
    id: 6,
    title: "Support Vector Machines",
    teacher: "StatQuest",
    time: "Now",
    videoUrl: "https://www.youtube.com/embed/efR1C6CvhmE"
  },
  {
    id: 7,
    title: "Decision Trees & Random Forests",
    teacher: "Data School",
    time: "Now",
    videoUrl: "https://www.youtube.com/embed/7VeUPuFGJHk"
  },
  {
    id: 8,
    title: "Gradient Descent Explained",
    teacher: "StatQuest",
    time: "Now",
    videoUrl: "https://www.youtube.com/embed/sDv4f4s2SB8"
  }
];

const upcomingClasses = [
  
  {
    id: 2,
    title: "Logistic Regression Explained",
    teacher: "StatQuest",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/yIYKR4sgzI8"
  },
  {
    id: 3,
    title: "Clustering Algorithms",
    teacher: "freeCodeCamp",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/Iq9DzN6mvYA"
  },
  {
    id: 4,
    title: "Principal Component Analysis",
    teacher: "StatQuest",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/FgakZw6K1QQ"
  },
  {
    id: 5,
    title: "Naive Bayes Classifier",
    teacher: "StatQuest",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/O2L2Uv9pdDA"
  },
  {
    id: 6,
    title: "K-Nearest Neighbors",
    teacher: "Data School",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/HVXime0nQeI"
  },
  {
    id: 7,
    title: "Intro to Reinforcement Learning",
    teacher: "DeepMind",
    time: "Tomorrow",
    videoUrl: "https://www.youtube.com/embed/Mut_u40Sqz4"
  },
  
];

function LiveVideoPlayer({ title, teacher, time, videoUrl }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-64"
        ></iframe>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600">By {teacher}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  return (
    <div className="p-6 space-y-10">
      {/* Live Classes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Live Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveClasses.map((cls) => (
            <LiveVideoPlayer key={cls.id} {...cls} />
          ))}
        </div>
      </section>

      {/* Upcoming Classes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingClasses.map((cls) => (
            <LiveVideoPlayer key={cls.id} {...cls} />
          ))}
        </div>
      </section>
    </div>
  );
}
