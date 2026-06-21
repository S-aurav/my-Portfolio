import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Notes from "@/components/Notes";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="site-container">
      {/* Fixed left sidebar */}
      <Sidebar />

      {/* Scrollable main content */}
      <main className="main-content">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Notes />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
