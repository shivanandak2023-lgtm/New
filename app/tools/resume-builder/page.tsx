"use client";

import { useState, useRef, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Free Resume Builder - Create & Download Professional Resume",
  description:
    "Free online resume builder. Create a professional resume with live preview, multiple templates, and download as PDF. No signup required.",
  keywords:
    "resume builder, free resume maker, create resume online, resume template, cv builder, professional resume, pdf resume",
};

interface WorkExperience {
  id: number;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: number;
  school: string;
  degree: string;
  year: string;
}

let nextWorkId = 1;
let nextEduId = 1;

function makeWork(): WorkExperience {
  return { id: nextWorkId++, company: "", title: "", startDate: "", endDate: "", description: "" };
}

function makeEdu(): Education {
  return { id: nextEduId++, school: "", degree: "", year: "" };
}

type Template = "classic" | "modern" | "minimal";
type ColorTheme = "blue" | "green" | "red" | "black";

const THEME_COLORS: Record<ColorTheme, string> = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  black: "#1e293b",
};

const TEMPLATE_FONTS: Record<Template, string> = {
  classic: "'Georgia', 'Times New Roman', serif",
  modern: "'Segoe UI', system-ui, -apple-system, sans-serif",
  minimal: "'Helvetica Neue', 'Arial', sans-serif",
};

export default function ResumeBuilderPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [summary, setSummary] = useState("");
  const [workList, setWorkList] = useState<WorkExperience[]>([makeWork()]);
  const [eduList, setEduList] = useState<Education[]>([makeEdu()]);
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [certifications, setCertifications] = useState("");
  const [template, setTemplate] = useState<Template>("modern");
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue");
  const printRef = useRef<HTMLDivElement>(null);

  function updateWork(id: number, field: keyof WorkExperience, value: string) {
    setWorkList((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  }

  function addWork() {
    setWorkList((prev) => [...prev, makeWork()]);
  }

  function removeWork(id: number) {
    if (workList.length <= 1) return;
    setWorkList((prev) => prev.filter((w) => w.id !== id));
  }

  function updateEdu(id: number, field: keyof Education, value: string) {
    setEduList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  }

  function addEdu() {
    setEduList((prev) => [...prev, makeEdu()]);
  }

  function removeEdu(id: number) {
    if (eduList.length <= 1) return;
    setEduList((prev) => prev.filter((e) => e.id !== id));
  }

  const accent = THEME_COLORS[colorTheme];
  const fontFamily = TEMPLATE_FONTS[template];

  function buildResumeHTML() {
    const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const langsList = languages.split(",").map((s) => s.trim()).filter(Boolean);
    const certsList = certifications.split(",").map((s) => s.trim()).filter(Boolean);

    const headerStyle = template === "classic"
      ? `text-align:center;border-bottom:2px solid ${accent};padding-bottom:16px;margin-bottom:20px;`
      : template === "modern"
      ? `border-left:4px solid ${accent};padding-left:16px;margin-bottom:20px;`
      : `margin-bottom:20px;`;

    const sectionTitleStyle = template === "classic"
      ? `font-size:14px;text-transform:uppercase;letter-spacing:2px;color:${accent};border-bottom:1px solid ${accent};padding-bottom:4px;margin:18px 0 10px;`
      : template === "modern"
      ? `font-size:15px;text-transform:uppercase;letter-spacing:1px;color:${accent};border-bottom:2px solid ${accent};padding-bottom:4px;margin:18px 0 10px;`
      : `font-size:13px;text-transform:uppercase;letter-spacing:3px;color:${accent};margin:18px 0 10px;`;

    const contactParts = [email, phone, location, linkedin, website].filter(Boolean);

    return `
      <html>
        <title>Resume - ${name || "My Resume"}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: ${fontFamily}; color: #1e293b; padding: 40px; max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.5; }
          .header { ${headerStyle} }
          .header h1 { font-size: 26px; color: ${accent}; margin-bottom: 6px; }
          .header .contact { font-size: 12px; color: #64748b; }
          .header .contact span { margin: 0 6px; }
          .section-title { ${sectionTitleStyle} }
          .summary { margin-bottom: 6px; color: #374151; }
          .work-item { margin-bottom: 14px; }
          .work-header { display: flex; justify-content: space-between; align-items: baseline; }
          .work-title { font-weight: 700; font-size: 14px; }
          .work-company { color: ${accent}; font-weight: 600; }
          .work-dates { font-size: 12px; color: #64748b; white-space: nowrap; }
          .work-desc { margin-top: 4px; color: #374151; font-size: 12px; white-space: pre-line; }
          .edu-item { margin-bottom: 10px; }
          .edu-degree { font-weight: 700; }
          .edu-school { color: #64748b; }
          .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
          .skill-tag { background: ${accent}11; color: ${accent}; padding: 2px 10px; border-radius: 4px; font-size: 12px; border: 1px solid ${accent}33; }
          .langs-certs { font-size: 12px; color: #374151; }
          @media print { body { padding: 0; } }
        </style>
        <body>
          <div class="header">
            <h1>${name || "Your Name"}</h1>
            <div class="contact">
              ${contactParts.map((p) => `<span>${p}</span>`).join(" | ")}
            </div>
          </div>

          ${summary ? `<div class="section-title">Professional Summary</div><p class="summary">${summary}</p>` : ""}

          ${workList.some((w) => w.company || w.title) ? `
            <div class="section-title">Work Experience</div>
            ${workList.filter((w) => w.company || w.title).map((w) => `
              <div class="work-item">
                <div class="work-header">
                  <div><span class="work-title">${w.title}</span> ${w.company ? `<span class="work-company">at ${w.company}</span>` : ""}</div>
                  <div class="work-dates">${[w.startDate, w.endDate].filter(Boolean).join(" - ")}</div>
                </div>
                ${w.description ? `<div class="work-desc">${w.description}</div>` : ""}
              </div>
            `).join("")}
          ` : ""}

          ${eduList.some((e) => e.school || e.degree) ? `
            <div class="section-title">Education</div>
            ${eduList.filter((e) => e.school || e.degree).map((e) => `
              <div class="edu-item">
                <span class="edu-degree">${e.degree}</span>
                ${e.school ? ` &mdash; <span class="edu-school">${e.school}</span>` : ""}
                ${e.year ? ` <span class="edu-school">(${e.year})</span>` : ""}
              </div>
            `).join("")}
          ` : ""}

          ${skillsList.length > 0 ? `
            <div class="section-title">Skills</div>
            <div class="skills-list">${skillsList.map((s) => `<span class="skill-tag">${s}</span>`).join("")}</div>
          ` : ""}

          ${langsList.length > 0 ? `
            <div class="section-title">Languages</div>
            <p class="langs-certs">${langsList.join(", ")}</p>
          ` : ""}

          ${certsList.length > 0 ? `
            <div class="section-title">Certifications</div>
            <p class="langs-certs">${certsList.join(", ")}</p>
          ` : ""}
        </body>
      </html>
    `;
  }

  function handleDownload() {
    const html = buildResumeHTML();
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 250);
  }

  const skillsList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const langsList = languages.split(",").map((s) => s.trim()).filter(Boolean);
  const certsList = certifications.split(",").map((s) => s.trim()).filter(Boolean);
  const contactParts = [email, phone, location, linkedin, website].filter(Boolean);

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/resume-builder`} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">
            &larr; All Tools
          </a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Resume Builder</h1>
        <p className="text-[var(--muted)] mb-8">
          Create a professional resume for free. Fill in your details, pick a template, and download as PDF.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Form */}
          <div className="space-y-6">
            {/* Template & Color */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Template & Style</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template</label>
                  <select value={template} onChange={(e) => setTemplate(e.target.value as Template)} className="input-field">
                    <option value="classic">Classic (Serif)</option>
                    <option value="modern">Modern (Sans-serif)</option>
                    <option value="minimal">Minimal (Clean)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color Theme</label>
                  <div className="flex gap-2 mt-2">
                    {(Object.keys(THEME_COLORS) as ColorTheme[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setColorTheme(c)}
                        className="w-8 h-8 rounded-full border-2 cursor-pointer transition-transform"
                        style={{
                          backgroundColor: THEME_COLORS[c],
                          borderColor: colorTheme === c ? "#000" : "transparent",
                          transform: colorTheme === c ? "scale(1.2)" : "scale(1)",
                        }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 234 567 890" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="New York, NY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LinkedIn</label>
                  <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="input-field" placeholder="linkedin.com/in/johndoe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website</label>
                  <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="input-field" placeholder="johndoe.com" />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Professional Summary</h2>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Briefly describe your professional background and key strengths..."
              />
            </div>

            {/* Work Experience */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Work Experience</h2>
              {workList.map((w) => (
                <div key={w.id} className="border border-[var(--card-border)] rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Company</label>
                      <input type="text" value={w.company} onChange={(e) => updateWork(w.id, "company", e.target.value)} className="input-field" placeholder="Company Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Job Title</label>
                      <input type="text" value={w.title} onChange={(e) => updateWork(w.id, "title", e.target.value)} className="input-field" placeholder="Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Start Date</label>
                      <input type="text" value={w.startDate} onChange={(e) => updateWork(w.id, "startDate", e.target.value)} className="input-field" placeholder="Jan 2022" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">End Date</label>
                      <input type="text" value={w.endDate} onChange={(e) => updateWork(w.id, "endDate", e.target.value)} className="input-field" placeholder="Present" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Description</label>
                    <textarea value={w.description} onChange={(e) => updateWork(w.id, "description", e.target.value)} className="input-field resize-none" rows={2} placeholder="Key responsibilities and achievements..." />
                  </div>
                  {workList.length > 1 && (
                    <button onClick={() => removeWork(w.id)} className="text-red-500 hover:text-red-700 text-sm mt-2 cursor-pointer">&times; Remove</button>
                  )}
                </div>
              ))}
              <button onClick={addWork} className="btn-secondary text-sm">+ Add Experience</button>
            </div>

            {/* Education */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Education</h2>
              {eduList.map((e) => (
                <div key={e.id} className="border border-[var(--card-border)] rounded-lg p-3 mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">School</label>
                      <input type="text" value={e.school} onChange={(ev) => updateEdu(e.id, "school", ev.target.value)} className="input-field" placeholder="University Name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Degree</label>
                      <input type="text" value={e.degree} onChange={(ev) => updateEdu(e.id, "degree", ev.target.value)} className="input-field" placeholder="B.S. Computer Science" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Year</label>
                      <input type="text" value={e.year} onChange={(ev) => updateEdu(e.id, "year", ev.target.value)} className="input-field" placeholder="2022" />
                    </div>
                  </div>
                  {eduList.length > 1 && (
                    <button onClick={() => removeEdu(e.id)} className="text-red-500 hover:text-red-700 text-sm mt-2 cursor-pointer">&times; Remove</button>
                  )}
                </div>
              ))}
              <button onClick={addEdu} className="btn-secondary text-sm">+ Add Education</button>
            </div>

            {/* Skills, Languages, Certifications */}
            <div className="tool-card">
              <h2 className="font-bold text-lg mb-4">Skills & More</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                  <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="input-field" placeholder="JavaScript, React, Node.js, Python" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Languages (comma separated)</label>
                  <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} className="input-field" placeholder="English, Spanish, French" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Certifications (comma separated)</label>
                  <input type="text" value={certifications} onChange={(e) => setCertifications(e.target.value)} className="input-field" placeholder="AWS Certified, PMP, Google Analytics" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button onClick={handleDownload} className="btn-primary px-8 py-3 text-lg">
                Download as PDF
              </button>
              <p className="text-xs text-[var(--muted)] mt-2">Opens a print dialog &mdash; choose &quot;Save as PDF&quot;</p>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="tool-card sticky top-4 self-start">
            <h2 className="font-bold text-lg mb-4">Live Preview</h2>
            <div
              ref={printRef}
              className="bg-white text-black rounded-lg shadow-lg overflow-auto"
              style={{
                fontFamily,
                padding: "32px",
                minHeight: "600px",
                maxHeight: "85vh",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              {/* Header */}
              <div
                style={{
                  textAlign: template === "classic" ? "center" : "left",
                  borderBottom: template !== "minimal" ? `2px solid ${accent}` : "none",
                  borderLeft: template === "modern" ? `4px solid ${accent}` : "none",
                  paddingLeft: template === "modern" ? "12px" : "0",
                  paddingBottom: "12px",
                  marginBottom: "16px",
                }}
              >
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: accent, margin: 0 }}>
                  {name || "Your Name"}
                </h3>
                <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                  {contactParts.length > 0 ? contactParts.join(" | ") : "email@example.com | +1 234 567 890"}
                </div>
              </div>

              {/* Summary */}
              {summary && (
                <>
                  <div style={{ fontSize: template === "minimal" ? "11px" : "12px", textTransform: "uppercase", letterSpacing: template === "minimal" ? "3px" : "1px", color: accent, borderBottom: template !== "minimal" ? `1px solid ${accent}` : "none", paddingBottom: "3px", marginBottom: "6px", fontWeight: 700 }}>
                    Professional Summary
                  </div>
                  <p style={{ color: "#374151", marginBottom: "12px", fontSize: "11px" }}>{summary}</p>
                </>
              )}

              {/* Work Experience */}
              {workList.some((w) => w.company || w.title) && (
                <>
                  <div style={{ fontSize: template === "minimal" ? "11px" : "12px", textTransform: "uppercase", letterSpacing: template === "minimal" ? "3px" : "1px", color: accent, borderBottom: template !== "minimal" ? `1px solid ${accent}` : "none", paddingBottom: "3px", marginBottom: "6px", fontWeight: 700 }}>
                    Work Experience
                  </div>
                  {workList.filter((w) => w.company || w.title).map((w) => (
                    <div key={w.id} style={{ marginBottom: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: "12px" }}>{w.title}</span>
                          {w.company && <span style={{ color: accent, fontWeight: 600 }}> at {w.company}</span>}
                        </div>
                        <span style={{ fontSize: "10px", color: "#64748b", whiteSpace: "nowrap" }}>
                          {[w.startDate, w.endDate].filter(Boolean).join(" - ")}
                        </span>
                      </div>
                      {w.description && (
                        <p style={{ marginTop: "3px", color: "#374151", fontSize: "11px", whiteSpace: "pre-line" }}>{w.description}</p>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Education */}
              {eduList.some((e) => e.school || e.degree) && (
                <>
                  <div style={{ fontSize: template === "minimal" ? "11px" : "12px", textTransform: "uppercase", letterSpacing: template === "minimal" ? "3px" : "1px", color: accent, borderBottom: template !== "minimal" ? `1px solid ${accent}` : "none", paddingBottom: "3px", marginBottom: "6px", marginTop: "12px", fontWeight: 700 }}>
                    Education
                  </div>
                  {eduList.filter((e) => e.school || e.degree).map((e) => (
                    <div key={e.id} style={{ marginBottom: "6px" }}>
                      <span style={{ fontWeight: 700 }}>{e.degree}</span>
                      {e.school && <span style={{ color: "#64748b" }}> &mdash; {e.school}</span>}
                      {e.year && <span style={{ color: "#64748b" }}> ({e.year})</span>}
                    </div>
                  ))}
                </>
              )}

              {/* Skills */}
              {skillsList.length > 0 && (
                <>
                  <div style={{ fontSize: template === "minimal" ? "11px" : "12px", textTransform: "uppercase", letterSpacing: template === "minimal" ? "3px" : "1px", color: accent, borderBottom: template !== "minimal" ? `1px solid ${accent}` : "none", paddingBottom: "3px", marginBottom: "6px", marginTop: "12px", fontWeight: 700 }}>
                    Skills
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {skillsList.map((s, i) => (
                      <span key={i} style={{ background: `${accent}11`, color: accent, padding: "1px 8px", borderRadius: "4px", fontSize: "11px", border: `1px solid ${accent}33` }}>{s}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Languages */}
              {langsList.length > 0 && (
                <>
                  <div style={{ fontSize: template === "minimal" ? "11px" : "12px", textTransform: "uppercase", letterSpacing: template === "minimal" ? "3px" : "1px", color: accent, borderBottom: template !== "minimal" ? `1px solid ${accent}` : "none", paddingBottom: "3px", marginBottom: "6px", marginTop: "12px", fontWeight: 700 }}>
                    Languages
                  </div>
                  <p style={{ fontSize: "11px", color: "#374151" }}>{langsList.join(", ")}</p>
                </>
              )}

              {/* Certifications */}
              {certsList.length > 0 && (
                <>
                  <div style={{ fontSize: template === "minimal" ? "11px" : "12px", textTransform: "uppercase", letterSpacing: template === "minimal" ? "3px" : "1px", color: accent, borderBottom: template !== "minimal" ? `1px solid ${accent}` : "none", paddingBottom: "3px", marginBottom: "6px", marginTop: "12px", fontWeight: 700 }}>
                    Certifications
                  </div>
                  <p style={{ fontSize: "11px", color: "#374151" }}>{certsList.join(", ")}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="ad-placeholder my-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Free Resume Builder</h2>
          <p>
            Create a professional resume in minutes without signing up for expensive services. This free resume builder
            provides live preview, multiple template styles, and PDF download. Perfect for job seekers, students, and professionals.
          </p>

          <h2>What to Include in a Resume</h2>
          <ul>
            <li><strong>Contact information:</strong> Your name, email, phone number, and location</li>
            <li><strong>Professional summary:</strong> A brief overview of your experience and key strengths</li>
            <li><strong>Work experience:</strong> Your job history with company names, titles, dates, and achievements</li>
            <li><strong>Education:</strong> Schools attended, degrees earned, and graduation years</li>
            <li><strong>Skills:</strong> Technical and soft skills relevant to your target role</li>
            <li><strong>Languages:</strong> Languages you speak and proficiency levels</li>
            <li><strong>Certifications:</strong> Professional certifications and licenses</li>
          </ul>

          <h2>Tips for a Strong Resume</h2>
          <ul>
            <li>Keep it to 1-2 pages for most experience levels</li>
            <li>Use action verbs to describe achievements (led, built, increased)</li>
            <li>Quantify results where possible (increased sales by 25%)</li>
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
