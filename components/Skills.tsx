"use client";

import { useState, useEffect } from "react";
import { skills as staticSkills } from "@/lib/data";
import { SkillEntry } from "@/lib/api";
import { useScrollReveal } from "@/lib/hooks";

type SkillItem = { name: string; logoUrl?: string | null };
type GroupedSkills = { category: string; skills: SkillItem[] }[];

function groupSkills(skills: SkillEntry[]): GroupedSkills {
  const map = new Map<string, SkillItem[]>();
  skills.forEach(s => {
    if (!map.has(s.category)) map.set(s.category, []);
    map.get(s.category)!.push({ name: s.name, logoUrl: s.logoUrl });
  });
  return Array.from(map.entries()).map(([category, skills]) => ({ category, skills }));
}

function SkillBadge({ skill }: { skill: SkillItem }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasLogo = skill.logoUrl && !imgFailed;

  return (
    <div className="skill-badge">
      {hasLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={skill.logoUrl!}
          alt=""
          className="skill-badge-logo"
          onError={() => setImgFailed(true)}
        />
      )}
      <span className="skill-badge-name">{skill.name}</span>
    </div>
  );
}

export default function Skills({ initialSkills }: { initialSkills?: SkillEntry[] | null }) {
  const ref = useScrollReveal();

  const [grouped, setGrouped] = useState<GroupedSkills>(
    initialSkills && initialSkills.length > 0 ? groupSkills(initialSkills) : []
  );

  useEffect(() => {
    if (initialSkills !== undefined && initialSkills !== null) {
      localStorage.setItem("cached_skills", JSON.stringify(initialSkills));
      if (initialSkills.length > 0) {
        setGrouped(groupSkills(initialSkills));
      } else {
        setGrouped(staticSkills.map(g => ({
          category: g.category,
          skills: g.skills.map(s => ({ name: s.name })),
        })));
      }
    } else {
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
      setGrouped(staticSkills.map(g => ({
        category: g.category,
        skills: g.skills.map(s => ({ name: s.name })),
      })));
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
              <p className="skill-category-label">{group.category}</p>
              <div className="skill-badges-row">
                {group.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
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
