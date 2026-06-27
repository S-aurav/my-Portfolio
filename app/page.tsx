"use client";

import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api";

import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Notes from "@/components/Notes";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const componentMap: Record<string, React.ComponentType> = {
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  notes: Notes,
  contact: Contact,
};

const defaultOrder = ["about", "skills", "experience", "projects", "notes", "contact"];

export default function Home() {
  const [order, setOrder] = useState<string[]>(defaultOrder);

  useEffect(() => {
    publicApi.getProfile()
      .then(res => {
        if (res.data?.sectionOrder) {
          const rawOrder = res.data.sectionOrder.split(",").map(s => s.trim());
          const filtered = rawOrder.filter(s => s in componentMap);
          if (filtered.length > 0) {
            setOrder(filtered);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="site-container">
      {/* Fixed left sidebar */}
      <Sidebar />

      {/* Scrollable main content */}
      <main className="main-content">
        <Hero />
        {order.map(key => {
          const Comp = componentMap[key];
          return Comp ? <Comp key={key} /> : null;
        })}
        <Footer />
      </main>
    </div>
  );
}
