import { personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', letterSpacing: '0.04em' }}>
        © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
      </p>
    </footer>
  );
}
