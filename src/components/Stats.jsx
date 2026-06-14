import { useState, useEffect } from "react";
import "../styles/Stats.css";

export default function Stats() {
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    // Get visitor count from localStorage
    const savedCount = localStorage.getItem("visitorCount");
    const count = savedCount ? parseInt(savedCount) + 1 : 1;
    localStorage.setItem("visitorCount", count);
    setVisitors(count);
  }, []);

  const stats = [
    { number: visitors, label: "Portfolio Visitors", icon: "👁️" },
    { number: "50+", label: "Projects Completed", icon: "🚀" },
    { number: "5+", label: "Years Experience", icon: "💼" },
    { number: "100%", label: "Code Quality", icon: "⭐" },
  ];

  return (
    <section className="stats-section">
      <h2>By The Numbers</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
