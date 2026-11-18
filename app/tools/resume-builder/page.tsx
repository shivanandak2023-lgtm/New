"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Free Resume Builder - Create & Download Professional Resume",
  description:
    "Free online resume builder. Create a professional resume with live preview, 8 templates, and download as PDF or DOCX. No signup required.",
  keywords:
    "resume builder, free resume maker, create resume online, resume template, cv builder, professional resume, pdf resume, docx resume",
};

// --- Types ---
interface WorkExperience {
  id: number;
  title: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: number;
  degree: string;
  school: string;
  city: string;
  startYear: string;
  endYear: string;
  description: string;
}

interface Language {
  id: number;
  name: string;
  proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
}

interface Certification {
  id: number;
  name: string;
}

type TemplateName =
  | "professional-blue"
  | "modern-minimal"
  | "creative"
  | "executive"
  | "tech"
  | "elegant"
  | "bold"
  | "classic";

type FontFamily = "sans" | "serif" | "modern";

const FONT_MAP: Record<FontFamily, string> = {
  sans: "'Inter', system-ui, -apple-system, sans-serif",
  serif: "'Georgia', 'Times New Roman', serif",
  modern: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const TEMPLATES: { key: TemplateName; name: string; desc: string }[] = [
  { key: "professional-blue", name: "Professional Blue", desc: "Dark blue header, clean sans-serif" },
  { key: "modern-minimal", name: "Modern Minimal", desc: "No colors, clean typography" },
  { key: "creative", name: "Creative", desc: "Sidebar layout with accent bar" },
  { key: "executive", name: "Executive", desc: "Dark header, gold accents, serif" },
  { key: "tech", name: "Tech", desc: "Monospace headers, green accents" },
  { key: "elegant", name: "Elegant", desc: "Centered name, light gray sections" },
  { key: "bold", name: "Bold", desc: "Large bold name, colored headers" },
  { key: "classic", name: "Classic", desc: "Traditional serif, indented sections" },
];

const STEPS = [
  { num: 1, label: "Personal" },
  { num: 2, label: "Summary" },
  { num: 3, label: "Experience" },
  { num: 4, label: "Education" },
  { num: 5, label: "Skills" },
  { num: 6, label: "Additional" },
];

let _id = 0;
const uid = () => ++_id;

function emptyWork(): WorkExperience {
  return { id: uid(), title: "", company: "", city: "", startDate: "", endDate: "", current: false, description: "" };
}
function emptyEdu(): Education {
  return { id: uid(), degree: "", school: "", city: "", startYear: "", endYear: "", description: "" };
}
function emptyLang(): Language {
  return { id: uid(), name: "", proficiency: "Fluent" };
}
function emptyCert(): Certification {
  return { id: uid(), name: "" };
}

// --- Resume Preview Component ---
function ResumePreview({
  data,
  template,
  primaryColor,
  fontFamily,
  scale,
}: {
  data: {
    firstName: string; lastName: string; jobTitle: string; email: string; phone: string;
    city: string; country: string; linkedin: string; website: string; summary: string;
    work: WorkExperience[]; education: Education[]; skills: string[];
    languages: Language[]; certifications: Certification[];
  };
  template: TemplateName;
  primaryColor: string;
  fontFamily: string;
  scale?: number;
}) {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ") || "Your Name";
  const contactParts = [
    data.email, data.phone,
    [data.city, data.country].filter(Boolean).join(", "),
    data.linkedin, data.website,
  ].filter(Boolean);
  const hasWork = data.work.some((w) => w.title || w.company);
  const hasEdu = data.education.some((e) => e.degree || e.school);
  const hasSkills = data.skills.length > 0;
  const hasLangs = data.languages.some((l) => l.name);
  const hasCerts = data.certifications.some((c) => c.name);
  const pc = primaryColor;

  const baseStyle: React.CSSProperties = {
    width: "210mm",
    minHeight: "297mm",
    fontFamily,
    fontSize: "11px",
    lineHeight: "1.55",
    color: "#1e293b",
    background: "#fff",
    transform: scale ? `scale(${scale})` : undefined,
    transformOrigin: "top left",
    padding: 0,
    margin: 0,
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => {
    const styles: Record<TemplateName, React.CSSProperties> = {
      "professional-blue": { fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px", color: pc, borderBottom: `2px solid ${pc}`, paddingBottom: "4px", marginTop: "16px", marginBottom: "8px", fontWeight: 700 },
      "modern-minimal": { fontSize: "12px", textTransform: "uppercase", letterSpacing: "3px", color: "#374151", borderBottom: "1px solid #d1d5db", paddingBottom: "4px", marginTop: "16px", marginBottom: "8px", fontWeight: 600 },
      "creative": { fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", color: pc, marginTop: "14px", marginBottom: "6px", fontWeight: 700, borderLeft: `3px solid ${pc}`, paddingLeft: "8px" },
      "executive": { fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", color: pc, borderBottom: `1px solid ${pc}`, paddingBottom: "3px", marginTop: "16px", marginBottom: "8px", fontWeight: 700, fontFamily: "'Georgia', serif" },
      "tech": { fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", color: pc, marginTop: "16px", marginBottom: "6px", fontWeight: 700, fontFamily: "'Courier New', monospace", borderBottom: `2px dashed ${pc}`, paddingBottom: "3px" },
      "elegant": { fontSize: "12px", textTransform: "uppercase", letterSpacing: "4px", color: "#6b7280", marginTop: "16px", marginBottom: "8px", fontWeight: 600, textAlign: "center", background: "#f9fafb", padding: "5px 0", borderRadius: "2px" },
      "bold": { fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px", color: pc, marginTop: "16px", marginBottom: "8px", fontWeight: 800 },
      "classic": { fontSize: "13px", textTransform: "uppercase", letterSpacing: "2px", color: "#1e293b", borderBottom: "1px solid #9ca3af", paddingBottom: "3px", marginTop: "16px", marginBottom: "8px", fontWeight: 700, fontFamily: "'Georgia', serif" },
    };
    return <div style={styles[template]}>{children}</div>;
  };

  // --- CREATIVE template has sidebar layout ---
  if (template === "creative") {
    return (
      <div style={baseStyle} className="resume-print-area">
        <div style={{ display: "flex", minHeight: "297mm" }}>
          {/* Sidebar */}
          <div style={{ width: "35%", background: pc, color: "#fff", padding: "30px 20px" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, marginBottom: "2px", lineHeight: 1.2 }}>{fullName}</div>
            {data.jobTitle && <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "20px", fontStyle: "italic" }}>{data.jobTitle}</div>}
            <div style={{ fontSize: "10px", lineHeight: 1.8, marginBottom: "24px" }}>
              {contactParts.map((c, i) => <div key={i}>{c}</div>)}
            </div>
            {hasSkills && (
              <>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "4px" }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "20px" }}>
                  {data.skills.map((s, i) => (
                    <span key={i} style={{ background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: "3px", fontSize: "10px" }}>{s}</span>
                  ))}
                </div>
              </>
            )}
            {hasLangs && (
              <>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "4px" }}>Languages</div>
                {data.languages.filter((l) => l.name).map((l) => (
                  <div key={l.id} style={{ fontSize: "10px", marginBottom: "3px" }}>{l.name} <span style={{ opacity: 0.7 }}>- {l.proficiency}</span></div>
                ))}
                <div style={{ marginBottom: "20px" }} />
              </>
            )}
            {hasCerts && (
              <>
                <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "4px" }}>Certifications</div>
                {data.certifications.filter((c) => c.name).map((c) => (
                  <div key={c.id} style={{ fontSize: "10px", marginBottom: "3px" }}>{c.name}</div>
                ))}
              </>
            )}
          </div>
          {/* Main content */}
          <div style={{ width: "65%", padding: "30px 24px" }}>
            {data.summary && (
              <>
                <SectionTitle>Profile</SectionTitle>
                <p style={{ color: "#374151", fontSize: "11px", marginBottom: "6px" }}>{data.summary}</p>
              </>
            )}
            {hasWork && (
              <>
                <SectionTitle>Experience</SectionTitle>
                {data.work.filter((w) => w.title || w.company).map((w) => (
                  <div key={w.id} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div><span style={{ fontWeight: 700, fontSize: "12px" }}>{w.title}</span>{w.company && <span style={{ color: pc, fontWeight: 600 }}> | {w.company}</span>}{w.city && <span style={{ color: "#6b7280" }}>, {w.city}</span>}</div>
                      <span style={{ fontSize: "10px", color: "#6b7280", whiteSpace: "nowrap" }}>{[w.startDate, w.current ? "Present" : w.endDate].filter(Boolean).join(" - ")}</span>
                    </div>
                    {w.description && <p style={{ color: "#374151", fontSize: "10.5px", whiteSpace: "pre-line", marginTop: "3px" }}>{w.description}</p>}
                  </div>
                ))}
              </>
            )}
            {hasEdu && (
              <>
                <SectionTitle>Education</SectionTitle>
                {data.education.filter((e) => e.degree || e.school).map((e) => (
                  <div key={e.id} style={{ marginBottom: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div><span style={{ fontWeight: 700 }}>{e.degree}</span>{e.school && <span style={{ color: "#6b7280" }}> | {e.school}</span>}{e.city && <span style={{ color: "#9ca3af" }}>, {e.city}</span>}</div>
                      <span style={{ fontSize: "10px", color: "#6b7280", whiteSpace: "nowrap" }}>{[e.startYear, e.endYear].filter(Boolean).join(" - ")}</span>
                    </div>
                    {e.description && <p style={{ color: "#374151", fontSize: "10.5px", marginTop: "2px" }}>{e.description}</p>}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- EXECUTIVE template ---
  const headerStyles: Record<TemplateName, React.CSSProperties> = {
    "professional-blue": { background: pc, color: "#fff", padding: "28px 32px", marginBottom: "0" },
    "modern-minimal": { padding: "28px 32px", borderBottom: "1px solid #e5e7eb" },
    "creative": {},
    "executive": { background: "#1e293b", color: "#fff", padding: "28px 32px", textAlign: "center" },
    "tech": { padding: "28px 32px", borderBottom: `3px solid ${pc}`, background: "#0f172a", color: "#e2e8f0" },
    "elegant": { textAlign: "center", padding: "32px", borderBottom: `1px solid #d1d5db` },
    "bold": { padding: "28px 32px", borderBottom: `4px solid ${pc}` },
    "classic": { textAlign: "center", padding: "28px 32px", borderBottom: "2px solid #374151" },
  };

  const nameStyles: Record<TemplateName, React.CSSProperties> = {
    "professional-blue": { fontSize: "26px", fontWeight: 800, color: "#fff", marginBottom: "2px" },
    "modern-minimal": { fontSize: "26px", fontWeight: 300, color: "#1e293b", letterSpacing: "2px", marginBottom: "2px" },
    "creative": {},
    "executive": { fontSize: "28px", fontWeight: 700, color: "#fff", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Georgia', serif" },
    "tech": { fontSize: "24px", fontWeight: 700, color: pc, fontFamily: "'Courier New', monospace", marginBottom: "2px" },
    "elegant": { fontSize: "28px", fontWeight: 300, color: "#374151", letterSpacing: "6px", textTransform: "uppercase", marginBottom: "4px" },
    "bold": { fontSize: "32px", fontWeight: 900, color: "#1e293b", marginBottom: "2px" },
    "classic": { fontSize: "26px", fontWeight: 700, color: "#1e293b", fontFamily: "'Georgia', serif", marginBottom: "2px" },
  };

  const jobTitleStyle: Record<TemplateName, React.CSSProperties> = {
    "professional-blue": { fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: 400 },
    "modern-minimal": { fontSize: "13px", color: "#6b7280", letterSpacing: "1px" },
    "creative": {},
    "executive": { fontSize: "13px", color: pc, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 },
    "tech": { fontSize: "12px", color: pc, fontFamily: "'Courier New', monospace" },
    "elegant": { fontSize: "12px", color: "#9ca3af", letterSpacing: "3px", textTransform: "uppercase" },
    "bold": { fontSize: "14px", color: pc, fontWeight: 700, textTransform: "uppercase" },
    "classic": { fontSize: "13px", color: "#6b7280", fontStyle: "italic", fontFamily: "'Georgia', serif" },
  };

  const contactStyle: Record<TemplateName, React.CSSProperties> = {
    "professional-blue": { fontSize: "10.5px", color: "rgba(255,255,255,0.75)", marginTop: "6px" },
    "modern-minimal": { fontSize: "10.5px", color: "#9ca3af", marginTop: "6px" },
    "creative": {},
    "executive": { fontSize: "10.5px", color: "rgba(255,255,255,0.65)", marginTop: "8px" },
    "tech": { fontSize: "10px", color: "#94a3b8", marginTop: "6px", fontFamily: "'Courier New', monospace" },
    "elegant": { fontSize: "10.5px", color: "#9ca3af", marginTop: "8px" },
    "bold": { fontSize: "11px", color: "#6b7280", marginTop: "6px" },
    "classic": { fontSize: "10.5px", color: "#6b7280", marginTop: "6px" },
  };

  const bodyPad = template === "tech" ? "24px 32px" : "20px 32px";

  return (
    <div style={baseStyle} className="resume-print-area">
      {/* Header */}
      <div style={headerStyles[template]}>
        <div style={nameStyles[template]}>{fullName}</div>
        {data.jobTitle && <div style={jobTitleStyle[template]}>{data.jobTitle}</div>}
        <div style={contactStyle[template]}>
          {contactParts.length > 0 ? contactParts.join("  |  ") : "your@email.com  |  +1 234 567 890"}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: bodyPad }}>
        {data.summary && (
          <>
            <SectionTitle>Professional Summary</SectionTitle>
            <p style={{ color: "#374151", fontSize: "11px", marginBottom: "4px" }}>{data.summary}</p>
          </>
        )}

        {hasWork && (
          <>
            <SectionTitle>Experience</SectionTitle>
            {data.work.filter((w) => w.title || w.company).map((w) => (
              <div key={w.id} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "12px" }}>{w.title}</span>
                    {w.company && <span style={{ color: pc, fontWeight: 600 }}> at {w.company}</span>}
                    {w.city && <span style={{ color: "#6b7280", fontSize: "10.5px" }}>, {w.city}</span>}
                  </div>
                  <span style={{ fontSize: "10px", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {[w.startDate, w.current ? "Present" : w.endDate].filter(Boolean).join(" - ")}
                  </span>
                </div>
                {w.description && <p style={{ color: "#374151", fontSize: "10.5px", whiteSpace: "pre-line", marginTop: "3px", paddingLeft: template === "classic" ? "16px" : "0" }}>{w.description}</p>}
              </div>
            ))}
          </>
        )}

        {hasEdu && (
          <>
            <SectionTitle>Education</SectionTitle>
            {data.education.filter((e) => e.degree || e.school).map((e) => (
              <div key={e.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "12px" }}>{e.degree}</span>
                    {e.school && <span style={{ color: "#6b7280" }}> &mdash; {e.school}</span>}
                    {e.city && <span style={{ color: "#9ca3af", fontSize: "10.5px" }}>, {e.city}</span>}
                  </div>
                  <span style={{ fontSize: "10px", color: "#6b7280", whiteSpace: "nowrap" }}>{[e.startYear, e.endYear].filter(Boolean).join(" - ")}</span>
                </div>
                {e.description && <p style={{ color: "#374151", fontSize: "10.5px", marginTop: "2px", paddingLeft: template === "classic" ? "16px" : "0" }}>{e.description}</p>}
              </div>
            ))}
          </>
        )}

        {hasSkills && (
          <>
            <SectionTitle>Skills</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {data.skills.map((s, i) => {
                const tagStyle: React.CSSProperties = template === "tech"
                  ? { background: "#0f172a", color: pc, padding: "2px 10px", borderRadius: "2px", fontSize: "10.5px", border: `1px solid ${pc}`, fontFamily: "'Courier New', monospace" }
                  : template === "elegant"
                  ? { background: "#f3f4f6", color: "#374151", padding: "2px 10px", borderRadius: "12px", fontSize: "10.5px" }
                  : template === "modern-minimal"
                  ? { color: "#374151", padding: "2px 10px", borderRadius: "4px", fontSize: "10.5px", border: "1px solid #d1d5db" }
                  : { background: `${pc}12`, color: pc, padding: "2px 10px", borderRadius: "4px", fontSize: "10.5px", border: `1px solid ${pc}30` };
                return <span key={i} style={tagStyle}>{s}</span>;
              })}
            </div>
          </>
        )}

        {hasLangs && (
          <>
            <SectionTitle>Languages</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px" }}>
              {data.languages.filter((l) => l.name).map((l) => (
                <span key={l.id}><strong>{l.name}</strong> <span style={{ color: "#6b7280" }}>({l.proficiency})</span></span>
              ))}
            </div>
          </>
        )}

        {hasCerts && (
          <>
            <SectionTitle>Certifications</SectionTitle>
            <ul style={{ paddingLeft: "18px", margin: 0, fontSize: "11px", color: "#374151" }}>
              {data.certifications.filter((c) => c.name).map((c) => (
                <li key={c.id} style={{ marginBottom: "2px" }}>{c.name}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
export default function ResumeBuilderPage() {
  // --- Personal Info ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");

  // --- Summary ---
  const [summary, setSummary] = useState("");

  // --- Experience ---
  const [workList, setWorkList] = useState<WorkExperience[]>([emptyWork()]);

  // --- Education ---
  const [eduList, setEduList] = useState<Education[]>([emptyEdu()]);

  // --- Skills ---
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // --- Languages ---
  const [languages, setLanguages] = useState<Language[]>([emptyLang()]);

  // --- Certifications ---
  const [certifications, setCertifications] = useState<Certification[]>([emptyCert()]);

  // --- Template & Style ---
  const [template, setTemplate] = useState<TemplateName>("professional-blue");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [fontChoice, setFontChoice] = useState<FontFamily>("sans");
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(false);

  // --- Active step tracking ---
  const [activeStep, setActiveStep] = useState(1);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const fontFamily = FONT_MAP[fontChoice];

  // --- Helpers ---
  const updateWork = useCallback((id: number, field: keyof WorkExperience, value: string | boolean) => {
    setWorkList((prev) => prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
  }, []);
  const addWork = useCallback(() => setWorkList((prev) => [...prev, emptyWork()]), []);
  const removeWork = useCallback((id: number) => setWorkList((prev) => prev.length > 1 ? prev.filter((w) => w.id !== id) : prev), []);

  const updateEdu = useCallback((id: number, field: keyof Education, value: string) => {
    setEduList((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }, []);
  const addEdu = useCallback(() => setEduList((prev) => [...prev, emptyEdu()]), []);
  const removeEdu = useCallback((id: number) => setEduList((prev) => prev.length > 1 ? prev.filter((e) => e.id !== id) : prev), []);

  const addSkill = useCallback((val: string) => {
    const trimmed = val.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  }, [skills]);
  const removeSkill = useCallback((s: string) => setSkills((prev) => prev.filter((x) => x !== s)), []);

  const updateLang = useCallback((id: number, field: keyof Language, value: string) => {
    setLanguages((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);
  const addLang = useCallback(() => setLanguages((prev) => [...prev, emptyLang()]), []);
  const removeLang = useCallback((id: number) => setLanguages((prev) => prev.length > 1 ? prev.filter((l) => l.id !== id) : prev), []);

  const updateCert = useCallback((id: number, value: string) => {
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, name: value } : c)));
  }, []);
  const addCert = useCallback(() => setCertifications((prev) => [...prev, emptyCert()]), []);
  const removeCert = useCallback((id: number) => setCertifications((prev) => prev.length > 1 ? prev.filter((c) => c.id !== id) : prev), []);

  const scrollToStep = useCallback((step: number) => {
    setActiveStep(step);
    sectionRefs.current[step - 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const resumeData = useMemo(() => ({
    firstName, lastName, jobTitle, email, phone, city, country, linkedin, website, summary,
    work: workList, education: eduList, skills, languages, certifications,
  }), [firstName, lastName, jobTitle, email, phone, city, country, linkedin, website, summary, workList, eduList, skills, languages, certifications]);

  // --- Print/Export ---
  const handlePrintPDF = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadDOCX = useCallback(() => {
    const el = document.querySelector(".resume-print-area");
    if (!el) return;
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>Resume</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: ${fontFamily}; font-size: 11pt; color: #1e293b; }
      </style></head>
      <body>${el.innerHTML}</body></html>`;
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${[firstName, lastName].filter(Boolean).join("_") || "resume"}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [fontFamily, firstName, lastName]);

  // --- Template thumbnail preview colors ---
  const tmplColors: Record<TemplateName, { bg: string; accent: string }> = {
    "professional-blue": { bg: "#1e40af", accent: "#2563eb" },
    "modern-minimal": { bg: "#f9fafb", accent: "#6b7280" },
    "creative": { bg: "#7c3aed", accent: "#8b5cf6" },
    "executive": { bg: "#1e293b", accent: "#d97706" },
    "tech": { bg: "#0f172a", accent: "#22c55e" },
    "elegant": { bg: "#f3f4f6", accent: "#9ca3af" },
    "bold": { bg: "#fff", accent: "#dc2626" },
    "classic": { bg: "#fafaf9", accent: "#57534e" },
  };

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/resume-builder`} />

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body > *:not(.print-resume-wrapper) { display: none !important; }
          .print-resume-wrapper > *:not(.resume-print-col) { display: none !important; }
          .resume-print-col > *:not(.resume-print-scroll) { display: none !important; }
          .resume-print-scroll { overflow: visible !important; max-height: none !important; }
          .resume-print-area { transform: none !important; width: 100% !important; min-height: auto !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}} />

      <div className="print-resume-wrapper max-w-[1440px] mx-auto px-4 py-8">
        <div className="no-print mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="no-print text-3xl font-extrabold mb-2">Resume Builder</h1>
        <p className="no-print text-[var(--muted)] mb-6">
          Create a professional resume with live preview. Pick a template, fill your details, and download as PDF or DOCX.
        </p>

        <div className="no-print ad-placeholder mb-6">Advertisement</div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN: Step indicator + Form */}
          <div className="w-full lg:w-[60%] flex gap-4">
            {/* Step indicators - vertical sidebar */}
            <div className="no-print hidden sm:flex flex-col items-center gap-1 pt-2" style={{ minWidth: "48px" }}>
              {STEPS.map((step, i) => (
                <button
                  key={step.num}
                  onClick={() => scrollToStep(step.num)}
                  className="flex flex-col items-center cursor-pointer group"
                  style={{ marginBottom: i < STEPS.length - 1 ? "0" : "0" }}
                >
                  <div
                    className="flex items-center justify-center rounded-full text-xs font-bold transition-all"
                    style={{
                      width: "32px", height: "32px",
                      background: activeStep === step.num ? "var(--primary)" : "var(--muted-bg)",
                      color: activeStep === step.num ? "#fff" : "var(--muted)",
                      border: activeStep === step.num ? "2px solid var(--primary)" : "2px solid var(--card-border)",
                    }}
                  >
                    {step.num}
                  </div>
                  <span className="text-[9px] text-[var(--muted)] mt-0.5 leading-tight">{step.label}</span>
                  {i < STEPS.length - 1 && <div style={{ width: "2px", height: "16px", background: "var(--card-border)", margin: "4px 0" }} />}
                </button>
              ))}
            </div>

            {/* Form sections */}
            <div className="flex-1 space-y-5 no-print">
              {/* Template & Style */}
              <div className="tool-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Template & Style</h2>
                  <button onClick={() => setShowTemplates(!showTemplates)} className="btn-secondary text-sm">
                    {showTemplates ? "Close" : "Change Template"}
                  </button>
                </div>
                {showTemplates && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => { setTemplate(t.key); setShowTemplates(false); }}
                        className="cursor-pointer text-left rounded-lg border-2 p-2 transition-all hover:shadow-md"
                        style={{
                          borderColor: template === t.key ? "var(--primary)" : "var(--card-border)",
                          background: template === t.key ? "var(--primary-light)" : "var(--card)",
                        }}
                      >
                        {/* Mini thumbnail */}
                        <div className="rounded mb-2 overflow-hidden" style={{ height: "60px", background: "#fff", position: "relative" }}>
                          <div style={{ height: "18px", background: tmplColors[t.key].bg }} />
                          <div style={{ padding: "4px 6px" }}>
                            <div style={{ height: "3px", width: "60%", background: tmplColors[t.key].accent, borderRadius: "2px", marginBottom: "3px" }} />
                            <div style={{ height: "2px", width: "80%", background: "#e5e7eb", borderRadius: "2px", marginBottom: "2px" }} />
                            <div style={{ height: "2px", width: "70%", background: "#e5e7eb", borderRadius: "2px", marginBottom: "2px" }} />
                            <div style={{ height: "2px", width: "50%", background: "#e5e7eb", borderRadius: "2px" }} />
                          </div>
                        </div>
                        <div className="text-xs font-semibold truncate">{t.name}</div>
                        <div className="text-[10px] text-[var(--muted)] truncate">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border border-[var(--card-border)]"
                        style={{ padding: "2px" }}
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="input-field"
                        style={{ maxWidth: "120px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Font</label>
                    <select value={fontChoice} onChange={(e) => setFontChoice(e.target.value as FontFamily)} className="input-field">
                      <option value="sans">Sans-serif (Inter)</option>
                      <option value="serif">Serif (Georgia)</option>
                      <option value="modern">Modern (Segoe UI)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 1: Personal Info */}
              <div ref={(el) => { sectionRefs.current[0] = el; }} className="tool-card" onClick={() => setActiveStep(1)}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">1</span>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" placeholder="Doe" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium mb-1">Job Title</label>
                    <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input-field" placeholder="Senior Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 234 567 890" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Country</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="input-field" placeholder="USA" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">LinkedIn URL</label>
                    <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="input-field" placeholder="linkedin.com/in/johndoe" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Website</label>
                    <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="input-field" placeholder="johndoe.com" />
                  </div>
                </div>
              </div>

              {/* Step 2: Summary */}
              <div ref={(el) => { sectionRefs.current[1] = el; }} className="tool-card" onClick={() => setActiveStep(2)}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">2</span>
                  Professional Summary
                </h2>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code, performance optimization, and mentoring junior developers."
                />
                <p className="text-xs text-[var(--muted)] mt-1">Write 2-3 sentences about your professional background and key strengths.</p>
              </div>

              {/* Step 3: Experience */}
              <div ref={(el) => { sectionRefs.current[2] = el; }} className="tool-card" onClick={() => setActiveStep(3)}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">3</span>
                  Work Experience
                </h2>
                {workList.map((w, idx) => (
                  <div key={w.id} className="border border-[var(--card-border)] rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[var(--muted)]">Experience {idx + 1}</span>
                      {workList.length > 1 && (
                        <button onClick={() => removeWork(w.id)} className="text-red-500 hover:text-red-700 text-xs cursor-pointer">Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Job Title</label>
                        <input type="text" value={w.title} onChange={(e) => updateWork(w.id, "title", e.target.value)} className="input-field" placeholder="Software Engineer" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Company</label>
                        <input type="text" value={w.company} onChange={(e) => updateWork(w.id, "company", e.target.value)} className="input-field" placeholder="Google" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">City</label>
                        <input type="text" value={w.city} onChange={(e) => updateWork(w.id, "city", e.target.value)} className="input-field" placeholder="Mountain View, CA" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Start Date</label>
                          <input type="text" value={w.startDate} onChange={(e) => updateWork(w.id, "startDate", e.target.value)} className="input-field" placeholder="Jan 2022" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">End Date</label>
                          <input
                            type="text"
                            value={w.current ? "Present" : w.endDate}
                            onChange={(e) => updateWork(w.id, "endDate", e.target.value)}
                            className="input-field"
                            placeholder="Dec 2024"
                            disabled={w.current}
                          />
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={w.current}
                        onChange={(e) => updateWork(w.id, "current", e.target.checked)}
                        className="rounded"
                      />
                      I currently work here
                    </label>
                    <div>
                      <label className="block text-xs font-medium mb-1">Description</label>
                      <textarea
                        value={w.description}
                        onChange={(e) => updateWork(w.id, "description", e.target.value)}
                        className="input-field resize-none"
                        rows={3}
                        placeholder={"- Led a team of 5 engineers to build a new microservice\n- Reduced API latency by 40% through caching optimization\n- Mentored 3 junior developers"}
                      />
                    </div>
                  </div>
                ))}
                <button onClick={addWork} className="btn-secondary text-sm">+ Add Experience</button>
              </div>

              {/* Step 4: Education */}
              <div ref={(el) => { sectionRefs.current[3] = el; }} className="tool-card" onClick={() => setActiveStep(4)}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">4</span>
                  Education
                </h2>
                {eduList.map((e, idx) => (
                  <div key={e.id} className="border border-[var(--card-border)] rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[var(--muted)]">Education {idx + 1}</span>
                      {eduList.length > 1 && (
                        <button onClick={() => removeEdu(e.id)} className="text-red-500 hover:text-red-700 text-xs cursor-pointer">Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Degree</label>
                        <input type="text" value={e.degree} onChange={(ev) => updateEdu(e.id, "degree", ev.target.value)} className="input-field" placeholder="B.S. Computer Science" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">School</label>
                        <input type="text" value={e.school} onChange={(ev) => updateEdu(e.id, "school", ev.target.value)} className="input-field" placeholder="MIT" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">City</label>
                        <input type="text" value={e.city} onChange={(ev) => updateEdu(e.id, "city", ev.target.value)} className="input-field" placeholder="Cambridge, MA" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">Start Year</label>
                          <input type="text" value={e.startYear} onChange={(ev) => updateEdu(e.id, "startYear", ev.target.value)} className="input-field" placeholder="2018" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">End Year</label>
                          <input type="text" value={e.endYear} onChange={(ev) => updateEdu(e.id, "endYear", ev.target.value)} className="input-field" placeholder="2022" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Description (optional)</label>
                      <textarea
                        value={e.description}
                        onChange={(ev) => updateEdu(e.id, "description", ev.target.value)}
                        className="input-field resize-none"
                        rows={2}
                        placeholder="GPA 3.8/4.0, Dean's List, Computer Science Honor Society"
                      />
                    </div>
                  </div>
                ))}
                <button onClick={addEdu} className="btn-secondary text-sm">+ Add Education</button>
              </div>

              {/* Step 5: Skills */}
              <div ref={(el) => { sectionRefs.current[4] = el; }} className="tool-card" onClick={() => setActiveStep(5)}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">5</span>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ background: `${primaryColor}15`, color: primaryColor, border: `1px solid ${primaryColor}40` }}
                    >
                      {s}
                      <button onClick={() => removeSkill(s)} className="ml-1 hover:opacity-70 cursor-pointer font-bold text-xs" style={{ color: primaryColor }}>&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); }
                    }}
                    className="input-field flex-1"
                    placeholder="Type a skill and press Enter (e.g. React, Python, AWS)"
                  />
                  <button onClick={() => addSkill(skillInput)} className="btn-secondary text-sm whitespace-nowrap">Add</button>
                </div>
              </div>

              {/* Step 6: Additional */}
              <div ref={(el) => { sectionRefs.current[5] = el; }} className="tool-card" onClick={() => setActiveStep(6)}>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold">6</span>
                  Additional
                </h2>

                {/* Languages */}
                <h3 className="font-semibold text-sm mb-2">Languages</h3>
                {languages.map((l, idx) => (
                  <div key={l.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={l.name}
                      onChange={(e) => updateLang(l.id, "name", e.target.value)}
                      className="input-field flex-1"
                      placeholder="English"
                    />
                    <select
                      value={l.proficiency}
                      onChange={(e) => updateLang(l.id, "proficiency", e.target.value)}
                      className="input-field"
                      style={{ maxWidth: "150px" }}
                    >
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                    {languages.length > 1 && (
                      <button onClick={() => removeLang(l.id)} className="text-red-500 hover:text-red-700 text-sm cursor-pointer">&times;</button>
                    )}
                  </div>
                ))}
                <button onClick={addLang} className="btn-secondary text-xs mb-5">+ Add Language</button>

                {/* Certifications */}
                <h3 className="font-semibold text-sm mb-2">Certifications</h3>
                {certifications.map((c, idx) => (
                  <div key={c.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCert(c.id, e.target.value)}
                      className="input-field flex-1"
                      placeholder="AWS Solutions Architect"
                    />
                    {certifications.length > 1 && (
                      <button onClick={() => removeCert(c.id)} className="text-red-500 hover:text-red-700 text-sm cursor-pointer">&times;</button>
                    )}
                  </div>
                ))}
                <button onClick={addCert} className="btn-secondary text-xs">+ Add Certification</button>
              </div>

              {/* Export buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <button onClick={handlePrintPDF} className="btn-primary px-8 py-3 text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </button>
                <button onClick={handleDownloadDOCX} className="btn-secondary px-8 py-3 text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Download DOCX
                </button>
              </div>
              <p className="text-xs text-[var(--muted)] text-center">PDF uses your browser&apos;s print dialog &mdash; select &quot;Save as PDF&quot; as destination</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Preview */}
          <div className="resume-print-col w-full lg:w-[40%] lg:sticky lg:top-4 lg:self-start">
            <div className="no-print flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Live Preview</h2>
              <button
                onClick={() => setPreviewZoom(!previewZoom)}
                className="btn-secondary text-xs flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {previewZoom
                    ? <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></>
                    : <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>
                  }
                </svg>
                {previewZoom ? "Fit View" : "Full Size"}
              </button>
            </div>
            <div
              className="resume-print-scroll rounded-lg border border-[var(--card-border)] bg-gray-100 overflow-auto"
              style={{ maxHeight: previewZoom ? "none" : "85vh" }}
            >
              <div style={{ padding: previewZoom ? "0" : "12px", background: previewZoom ? "#fff" : undefined }}>
                <ResumePreview
                  data={resumeData}
                  template={template}
                  primaryColor={primaryColor}
                  fontFamily={fontFamily}
                  scale={previewZoom ? undefined : 0.42}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="no-print ad-placeholder my-8">Advertisement</div>

        <div className="no-print seo-content tool-card">
          <h2>Free Professional Resume Builder</h2>
          <p>
            Create a professional resume in minutes without signing up for expensive services. This free resume builder
            provides a live A4 preview, 8 unique template designs, color customization, font selection, and instant PDF or DOCX download.
            Perfect for job seekers, students, career changers, and professionals.
          </p>

          <h2>8 Professional Templates</h2>
          <p>
            Choose from Professional Blue, Modern Minimal, Creative sidebar, Executive, Tech, Elegant, Bold, or Classic templates.
            Each template produces a genuinely different layout and style, from colored header bars and sidebar designs to
            centered elegant styles and code-inspired layouts.
          </p>

          <h2>What to Include in a Resume</h2>
          <ul>
            <li><strong>Contact information:</strong> Your name, email, phone, location, LinkedIn, and website</li>
            <li><strong>Professional summary:</strong> A brief 2-3 sentence overview of your experience and key strengths</li>
            <li><strong>Work experience:</strong> Job titles, companies, dates, and bullet-point achievements</li>
            <li><strong>Education:</strong> Degrees, schools, dates, and relevant honors</li>
            <li><strong>Skills:</strong> Technical and soft skills relevant to your target role</li>
            <li><strong>Languages &amp; Certifications:</strong> Additional qualifications that set you apart</li>
          </ul>

          <h2>Tips for a Strong Resume</h2>
          <ul>
            <li>Keep it to 1-2 pages for most experience levels</li>
            <li>Use action verbs to describe achievements (led, built, increased, reduced)</li>
            <li>Quantify results where possible (increased sales by 25%, reduced latency by 40%)</li>
            <li>Tailor your resume for each job application</li>
            <li>Proofread carefully for spelling and grammar errors</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Resume Builder",
            description: META.description,
            url: `${SITE_URL}/tools/resume-builder`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
