import { useState } from "react";
import "../styles/ProgrammingThoughts.css";

export default function ProgrammingThoughts() {
  const [thoughts] = useState([
    {
      id: 1,
      title: "The Power of Clean Code",
      date: "2024-12-10",
      excerpt:
        "Clean code is not just about readability. It's about respect for your team and your future self. Write code that others can understand at first glance.",
      category: "Best Practices",
      icon: "🧹",
    },
    {
      id: 2,
      title: "React Hooks: A Game Changer",
      date: "2024-12-05",
      excerpt:
        "Hooks have revolutionized how we write React components. Learn how to use custom hooks to keep your code DRY and maintainable.",
      category: "React",
      icon: "⚙️",
    },
    {
      id: 3,
      title: "The Importance of Testing",
      date: "2024-11-28",
      excerpt:
        "Tests are not a luxury, they're a necessity. Good tests give you confidence and make refactoring safe. Start writing them today.",
      category: "Testing",
      icon: "🧪",
    },
    {
      id: 4,
      title: "Performance Optimization Tips",
      date: "2024-11-20",
      excerpt:
        "Learn key techniques for optimizing your web applications. From lazy loading to code splitting, every millisecond counts.",
      category: "Performance",
      icon: "⚡",
    },
  ]);

  return (
    <section className="thoughts-section">
      <h2>Programming Thoughts</h2>
      <p className="section-subtitle">
        Insights and lessons from my development journey
      </p>
      <div className="thoughts-grid">
        {thoughts.map((thought) => (
          <article key={thought.id} className="thought-card">
            <div className="thought-header">
              <span className="thought-icon">{thought.icon}</span>
              <span className="thought-category">{thought.category}</span>
            </div>
            <h3 className="thought-title">{thought.title}</h3>
            <p className="thought-excerpt">{thought.excerpt}</p>
            <div className="thought-footer">
              <time className="thought-date">
                {new Date(thought.date).toLocaleDateString()}
              </time>
              <a href="#" className="read-more">
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
