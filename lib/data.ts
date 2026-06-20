export const personalInfo = {
  name: "Saurav Yadav",
  role: "Software Engineer",
  tagline: "Building systems that scale. One clean commit at a time.",
  bio: "Full-stack software engineer with a passion for building robust backend systems, clean APIs, and scalable architectures. Currently crafting enterprise-grade solutions at Dista.ai — from geospatial data pipelines to RBAC-driven user systems. I love turning complex problems into elegant, maintainable code.",
  email: "yadavsaurav818@gmail.com",
  phone: "+91 9022894248",
  location: "Pune, India",
  profileImage: "/profile.png",
  links: {
    github: "https://github.com/S-aurav",
    linkedin: "https://linkedin.com/in/sauravyadav2004/",
    leetcode: "https://leetcode.com/u/S-aurav",
  },
};

export type Skill = {
  name: string;
  icon?: string;
};

export type SkillCategory = {
  category: string;
  skills: Skill[];
};

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    skills: [
      { name: "Java" },
      { name: "Python" },
      { name: "C/C++" },
      { name: "TypeScript" },
      { name: "SQL" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Spring Boot" },
      { name: "FastAPI" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "REST APIs" },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "MongoDB" },
      { name: "BigQuery" },
    ],
  },
  {
    category: "Cloud & Tools",
    skills: [
      { name: "Google Cloud (GCP)" },
      { name: "AWS EC2" },
      { name: "Git & GitHub" },
      { name: "Podman" },
      { name: "Postman" },
      { name: "Linux / Unix" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "HTML & CSS" },
      { name: "Tailwind CSS" },
    ],
  },
];

export type Experience = {
  role: string;
  company: string;
  duration: string;
  type: "work" | "education";
  location: string;
  highlights: string[];
  techStack?: string[];
};

export const experiences: Experience[] = [
  {
    role: "Software Engineer (Full Stack)",
    company: "Dista.ai",
    duration: "Jan 2026 – Present",
    type: "work",
    location: "Pune, India",
    highlights: [
      "Built and enhanced REST APIs, data validators, and backend workflows using Java/Spring for enterprise SaaS clients.",
      "Implemented backend-driven automation for geospatial data processing using BigQuery, eliminating manual SQL operations.",
      "Developed RBAC-based user onboarding flows enabling 8K+ user onboarding under strict timelines.",
      "Developed bulk data migration solutions across distributed systems with minimal downtime.",
      "Debugged and resolved production issues, ensuring system stability and timely feature delivery.",
    ],
    techStack: ["Java", "Spring Boot", "GCP", "BigQuery", "SQL"],
  },
  {
    role: "BE in Computer Science & Engineering",
    company: "Sinhgad College of Engineering",
    duration: "2022 – 2025",
    type: "education",
    location: "Pune, India",
    highlights: ["CGPA: 7.71 / 10"],
  },
  {
    role: "Diploma in Computer Engineering",
    company: "STES's Sou. Venutai Chavan Polytechnic",
    duration: "2019 – 2022",
    type: "education",
    location: "Pune, India",
    highlights: ["Percentage: 92.46%"],
  },
];

export type Project = {
  title: string;
  description: string;
  techStack: string[];
  github?: string;
  demo?: string;
  date: string;
};

export const projects: Project[] = [
  {
    title: "Telegram Media Server",
    date: "August 2025",
    description:
      "An automated system to fetch, process, and categorize video content from Telegram channels. Features cross-platform video streaming, real-time note editing, and background download queue processing.",
    techStack: ["Python", "FastAPI", "Telethon", "PixelDrain", "GitHub Gist"],
    github: "https://github.com/S-aurav",
    demo: undefined,
  },
  {
    title: "AI-Driven Social Media Forensic Tool",
    date: "December 2024",
    description:
      "Automated forensic tool for analyzing social media chat screenshots and detecting suspicious behavior (harassment, cyberbullying, fraud). Fine-tuned Facebook's BART MNLI model for 50+ domain-specific sentiment labels using zero-shot learning.",
    techStack: ["Python", "HuggingFace Transformers", "BART-MNLI", "EasyOCR"],
    github: "https://github.com/S-aurav",
    demo: undefined,
  },
];

export const certifications = [
  "Career Essentials in Generative AI — Microsoft & LinkedIn",
  "Oracle Cloud Infrastructure 2023 AI Certified Foundations Associate",
];
