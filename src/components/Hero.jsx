import "../styles/Hero.css";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Backend developer | Java Spring</h1>
        <p className="hero-subtitle">
          Building scalable, robust applications with Spring Boot and
          enterprise-grade Java solutions
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">See My Work</button>
          <button className="btn btn-secondary">Contact Me</button>
        </div>
      </div>
    </section>
  );
}
