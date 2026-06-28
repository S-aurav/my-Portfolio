"use client";

import { useState, useEffect } from "react";
import { skills as staticSkills } from "@/lib/data";
import { SkillEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";

type GroupedSkills = { category: string; skills: string[] }[];

function groupSkills(skills: SkillEntry[]): GroupedSkills {
  const map = new Map<string, string[]>();
  skills.forEach(s => {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category)!.push(s.name);
  });
  return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }));
}

export default function Skills({ initialSkills }: { initialSkills?: SkillEntry[] | null }) {
  const ref = useScrollReveal();

  const [grouped, setGrouped] = useState<GroupedSkills>(initialSkills && initialSkills.length > 0 ? groupSkills(initialSkills) : []);

  useEffect(() => {
    if (initialSkills !== undefined && initialSkills !== null) {
      // Server is online. Cache the response (even if empty)
      localStorage.setItem("cached_skills", JSON.stringify(initialSkills));
      if (initialSkills.length > 0) {
        setGrouped(groupSkills(initialSkills));
      } else {
        // Database is empty. Display static fallbacks
        setGrouped(staticSkills.map(g => ({ category: g.category, skills: g.skills.map(s => s.name) })));
      }
    } else {
      // Server is offline. Load from localStorage
      const cached = localStorage.getItem("cached_skills");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) {
            setGrouped(groupSkills(parsed));
            return;
          }
        } catch {}
      }
      // If no cache, display static fallbacks
      setGrouped(staticSkills.map(g => ({ category: g.category, skills: g.skills.map(s => s.name) })));
    }
  }, [initialSkills]);

  return (
    <section id="skills" className="section">
      <div ref={ref} className="reveal">
        <h2 className="section-title">Skills</h2>
        <p className="section-subtitle">Technologies I work with</p>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {grouped.map((group) => (
            <div key={group.category}>
              <p style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '10px',
                fontFamily: 'Josefin Sans, sans-serif',
              }}>
                {group.category}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {group.skills.map((skill) => (
                  <span key={skill} className="skill-pill">{skill}</span>
                ))}
              </div>
              <div style={{ height: 1, background: 'var(--border-light)', marginTop: '20px' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
