import { publicApi } from "@/lib/api";
import dynamic from "next/dynamic";

import Sidebar from "@/components/Sidebar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const About = dynamic(() => import("@/components/About"));
const Skills = dynamic(() => import("@/components/Skills"));
const Experience = dynamic(() => import("@/components/Experience"));
const Projects = dynamic(() => import("@/components/Projects"));
const Notes = dynamic(() => import("@/components/Notes"));
const Contact = dynamic(() => import("@/components/Contact"));

export const revalidate = 60;

const componentMap: Record<string, React.ComponentType<any>> = {
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  notes: Notes,
  contact: Contact,
};

const defaultOrder = ["about", "skills", "experience", "projects", "notes", "contact"];

export default async function Home() {
  const [
    profileRes,
    projectsRes,
    notesRes,
    skillsRes,
    experienceRes,
    certsRes,
  ] = await Promise.allSettled([
    publicApi.getProfile(),
    publicApi.getProjects(),
    publicApi.getNotes(),
    publicApi.getSkills(),
    publicApi.getExperience(),
    publicApi.getCertifications(),
  ]);

  const profile = profileRes.status === "fulfilled" && profileRes.value?.success ? profileRes.value.data : null;
  const projects = projectsRes.status === "fulfilled" && projectsRes.value?.success ? projectsRes.value.data : [];
  const notes = notesRes.status === "fulfilled" && notesRes.value?.success ? notesRes.value.data : [];
  const skills = skillsRes.status === "fulfilled" && skillsRes.value?.success ? skillsRes.value.data : [];
  const experience = experienceRes.status === "fulfilled" && experienceRes.value?.success ? experienceRes.value.data : [];
  const certs = certsRes.status === "fulfilled" && certsRes.value?.success ? certsRes.value.data : [];

  const rawOrder = profile?.sectionOrder
    ? profile.sectionOrder.split(",").map((s) => s.trim())
    : defaultOrder;

  const order = rawOrder.filter((s) => s in componentMap);

  const propsMap: Record<string, any> = {
    about: { initialCerts: certs },
    skills: { initialSkills: skills },
    experience: { initialExperience: experience },
    projects: { initialProjects: projects },
    notes: { initialNotes: notes },
    contact: {},
  };

  return (
    <div className="site-container">
      {/* Fixed left sidebar */}
      <Sidebar />

      {/* Scrollable main content */}
      <main className="main-content">
        <Hero />
        {order.map((key) => {
          const Comp = componentMap[key];
          const props = propsMap[key] || {};
          return Comp ? <Comp key={key} {...props} /> : null;
        })}
        <Footer />
      </main>
    </div>
  );
}
