"use client";

import { useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Email Generator - Create Professional Emails Free",
  description:
    "Free online Email Generator tool. Create professional emails for job applications, meetings, follow-ups, complaints, and more. 100% client-side, no data sent to servers.",
  keywords:
    "email generator, email writer, professional email, email template, business email generator, email maker",
};

const EMAIL_TYPES = [
  "job-application",
  "meeting-request",
  "follow-up",
  "complaint",
  "thank-you",
  "resignation",
  "introduction",
  "invitation",
  "apology",
  "feedback-request",
] as const;
type EmailType = (typeof EMAIL_TYPES)[number];

const EMAIL_LABELS: Record<EmailType, string> = {
  "job-application": "Job Application",
  "meeting-request": "Meeting Request",
  "follow-up": "Follow-Up",
  "complaint": "Complaint",
  "thank-you": "Thank You",
  "resignation": "Resignation",
  "introduction": "Introduction",
  "invitation": "Invitation",
  "apology": "Apology",
  "feedback-request": "Feedback Request",
};

function generateEmail(
  type: EmailType,
  senderName: string,
  recipientName: string,
  details: string
): { subject: string; body: string } {
  const sender = senderName.trim() || "Your Name";
  const recipient = recipientName.trim() || "Recipient";
  const info = details.trim() || "the relevant matter";

  const templates: Record<EmailType, { subject: string; body: string }> = {
    "job-application": {
      subject: `Application for ${info}`,
      body: `Dear ${recipient},

I am writing to express my strong interest in the ${info} position at your organization. With my background and skills, I am confident that I would be a valuable addition to your team.

I have a proven track record of delivering results in similar roles and I am passionate about contributing to your organization's continued success. I am particularly drawn to this opportunity because it aligns perfectly with my career goals and expertise.

I have attached my resume for your review and would welcome the opportunity to discuss how my qualifications align with your needs. I am available for an interview at your earliest convenience.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${sender}`,
    },
    "meeting-request": {
      subject: `Meeting Request: ${info}`,
      body: `Dear ${recipient},

I hope this message finds you well. I am writing to request a meeting to discuss ${info}.

I believe a brief conversation would be beneficial for both of us, and I am flexible with scheduling. Could you please share your availability for a 30-minute meeting this week or next?

I am happy to meet in person, via video call, or over the phone, whichever works best for you.

Thank you for your time, and I look forward to your response.

Best regards,
${sender}`,
    },
    "follow-up": {
      subject: `Following Up: ${info}`,
      body: `Dear ${recipient},

I hope you are doing well. I wanted to follow up regarding ${info} that we previously discussed.

I understand you may be busy, but I wanted to check in and see if there have been any updates or if there is anything further you need from my end. I remain very interested and enthusiastic about moving forward.

Please don't hesitate to reach out if you have any questions or need additional information. I am happy to provide whatever is needed.

Thank you for your time, and I look forward to hearing from you soon.

Best regards,
${sender}`,
    },
    complaint: {
      subject: `Formal Complaint Regarding ${info}`,
      body: `Dear ${recipient},

I am writing to bring to your attention a concern regarding ${info}. I believe this matter requires prompt attention and resolution.

Despite my previous attempts to address this issue, the situation has not been resolved satisfactorily. I have documented the relevant details and am prepared to provide any additional information needed to facilitate a resolution.

I would appreciate it if you could look into this matter at your earliest convenience and provide a timeline for when I can expect a resolution. I value our relationship and trust that this issue can be resolved professionally.

Thank you for your attention to this matter.

Sincerely,
${sender}`,
    },
    "thank-you": {
      subject: `Thank You - ${info}`,
      body: `Dear ${recipient},

I wanted to take a moment to express my sincere gratitude regarding ${info}. Your support and generosity have not gone unnoticed, and I truly appreciate everything you have done.

Your contribution has made a meaningful difference, and I am grateful for the time and effort you dedicated to this. It speaks volumes about your character and commitment.

Please know that your kindness is deeply valued. I look forward to the opportunity to reciprocate in the future.

With heartfelt thanks,
${sender}`,
    },
    resignation: {
      subject: `Resignation Notice - ${sender}`,
      body: `Dear ${recipient},

I am writing to formally notify you of my resignation from my position, effective two weeks from today.

This was not an easy decision, and I want to express my sincere gratitude for the opportunities, mentorship, and experiences I have gained during my time here. Working with you and the team has been a truly enriching experience that has contributed significantly to my professional growth.

I am committed to ensuring a smooth transition and will do everything in my power to complete outstanding projects and transfer responsibilities during my remaining time. Regarding ${info}, I will ensure all relevant documentation and handoffs are in order.

Thank you again for everything. I wish you and the organization continued success.

Sincerely,
${sender}`,
    },
    introduction: {
      subject: `Introduction: ${sender} - ${info}`,
      body: `Dear ${recipient},

I hope this email finds you well. My name is ${sender}, and I am reaching out to introduce myself regarding ${info}.

I am eager to connect with you because I believe there may be valuable opportunities for collaboration and mutual benefit. I have been following your work with great interest and admire the impact you have been making in the field.

I would love the chance to have a brief conversation to learn more about your work and share a bit about what I do. Please let me know if you would be open to a quick chat at your convenience.

Thank you for your time, and I look forward to connecting.

Warm regards,
${sender}`,
    },
    invitation: {
      subject: `You're Invited: ${info}`,
      body: `Dear ${recipient},

I am pleased to invite you to ${info}. Your presence would be greatly valued, and I believe you would find the event both enjoyable and worthwhile.

The event will provide an excellent opportunity for networking, learning, and collaboration. I have put together an agenda that I think you will find engaging and relevant to your interests.

Please let me know at your earliest convenience whether you will be able to attend so that I can make the necessary arrangements. I am happy to provide any additional details you may need.

I sincerely hope you can join us. It would not be the same without you.

Best regards,
${sender}`,
    },
    apology: {
      subject: `Sincere Apology - ${info}`,
      body: `Dear ${recipient},

I am writing to sincerely apologize regarding ${info}. I understand that this situation has caused inconvenience, and I take full responsibility for my part in it.

This was not reflective of the standards I hold for myself, and I deeply regret any negative impact it may have had. I have taken steps to ensure that this does not happen again, including reviewing my processes and implementing safeguards.

I value our relationship and hope that we can move forward from this. Please let me know if there is anything else I can do to make this right.

With sincere apologies,
${sender}`,
    },
    "feedback-request": {
      subject: `Request for Feedback: ${info}`,
      body: `Dear ${recipient},

I hope you are doing well. I am reaching out to kindly request your feedback regarding ${info}. Your perspective and insights would be incredibly valuable to me.

As someone whose opinion I greatly respect, I believe your feedback could help me identify areas for improvement and build on what is working well. I am open to both positive observations and constructive criticism.

If you could share your thoughts at your convenience, I would be most grateful. Feel free to respond via email, or I am happy to schedule a brief call if you prefer to discuss in person.

Thank you in advance for your time and generosity.

Best regards,
${sender}`,
    },
  };

  return templates[type];
}

export default function EmailGeneratorPage() {
  const [emailType, setEmailType] = useState<EmailType>("job-application");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [details, setDetails] = useState("");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const email = generateEmail(emailType, senderName, recipientName, details);
    setResult(email);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Subject: ${result.subject}\n\n${result.body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      
        <title>{META.title} | {SITE_NAME}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <link rel="canonical" href={`${SITE_URL}/tools/email-generator`} />
      

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Email Generator</h1>
        <p className="text-[var(--muted)] mb-8">
          Create professional emails for any occasion with customizable templates.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="tool-card mb-6">
          <label className="block text-sm font-semibold mb-2">Email Type</label>
          <select
            value={emailType}
            onChange={(e) => setEmailType(e.target.value as EmailType)}
            className="input-field"
          >
            {EMAIL_TYPES.map((t) => (
              <option key={t} value={t}>{EMAIL_LABELS[t]}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-field"
                placeholder="e.g. John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="input-field"
                placeholder="e.g. Jane Doe"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2">Details / Context</label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="input-field"
              placeholder="e.g. Senior Developer position, project update, annual conference..."
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={handleGenerate} className="btn-primary">
              Generate Email
            </button>
            {result && (
              <button onClick={() => setResult(null)} className="btn-secondary text-sm">
                Clear
              </button>
            )}
          </div>
        </div>

        {result && (
          <div className="result-card mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Generated Email</h3>
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="tool-card mb-3">
              <p className="text-sm"><strong>Subject:</strong> {result.subject}</p>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
              {result.body}
            </pre>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>What is an Email Generator?</h2>
          <p>
            An Email Generator helps you create professional, well-structured emails for any occasion.
            Choose from 10 email types including job applications, meeting requests, follow-ups, complaints,
            and more, then customize with your details for a polished result.
          </p>

          <h2>Supported Email Types</h2>
          <ul>
            <li><strong>Job Application:</strong> Professional cover letter emails for job opportunities</li>
            <li><strong>Meeting Request:</strong> Politely request meetings with colleagues or clients</li>
            <li><strong>Follow-Up:</strong> Check in after previous communications or meetings</li>
            <li><strong>Complaint:</strong> Address issues formally and professionally</li>
            <li><strong>Thank You:</strong> Express gratitude sincerely and effectively</li>
            <li><strong>Resignation:</strong> Submit your notice professionally</li>
            <li><strong>Introduction:</strong> Introduce yourself to new contacts</li>
            <li><strong>Invitation:</strong> Invite people to events or meetings</li>
            <li><strong>Apology:</strong> Apologize sincerely for mistakes or issues</li>
            <li><strong>Feedback Request:</strong> Ask for valuable feedback and insights</li>
          </ul>

          <h2>Who Uses Email Generators?</h2>
          <ul>
            <li><strong>Job Seekers:</strong> Craft professional application and follow-up emails</li>
            <li><strong>Professionals:</strong> Save time on routine business communications</li>
            <li><strong>Students:</strong> Write formal emails to professors and employers</li>
            <li><strong>Managers:</strong> Send clear, professional team communications</li>
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
            name: "Email Generator",
            description: META.description,
            url: `${SITE_URL}/tools/email-generator`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
