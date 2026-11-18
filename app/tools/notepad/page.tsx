"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "Notepad - Free Online Text Editor with Auto-Save",
  description:
    "Free online Notepad with auto-save to browser storage. Multiple notes, word/character count, font size selector, download as .txt, and Markdown preview.",
  keywords: "notepad online, text editor, online notepad, note taking, auto save notepad, markdown editor",
};

interface Note {
  id: string;
  title: string;
  content: string;
}

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Code
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");
  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
}

export default function NotepadPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [fontSize, setFontSize] = useState(14);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notepad-notes");
      if (saved) {
        const parsed: Note[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setNotes(parsed);
          setActiveId(parsed[0].id);
          setLoaded(true);
          return;
        }
      }
    } catch {}
    // Default note
    const defaultNote: Note = { id: "1", title: "Note 1", content: "" };
    setNotes([defaultNote]);
    setActiveId("1");
    setLoaded(true);
  }, []);

  // Auto-save every 2 seconds after changes
  const saveToStorage = useCallback((notesToSave: Note[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { localStorage.setItem("notepad-notes", JSON.stringify(notesToSave)); } catch {}
    }, 2000);
  }, []);

  const activeNote = notes.find((n) => n.id === activeId);

  const updateContent = (content: string) => {
    const updated = notes.map((n) => (n.id === activeId ? { ...n, content } : n));
    setNotes(updated);
    saveToStorage(updated);
  };

  const updateTitle = (title: string) => {
    const updated = notes.map((n) => (n.id === activeId ? { ...n, title } : n));
    setNotes(updated);
    saveToStorage(updated);
  };

  const addNote = () => {
    const id = String(Date.now());
    const newNote: Note = { id, title: `Note ${notes.length + 1}`, content: "" };
    const updated = [...notes, newNote];
    setNotes(updated);
    setActiveId(id);
    saveToStorage(updated);
  };

  const deleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (activeId === id) {
      setActiveId(updated[0].id);
    }
    saveToStorage(updated);
  };

  const downloadNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0;
  const charCount = activeNote?.content.length || 0;

  if (!loaded) return null;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/notepad`} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Notepad</h1>
        <p className="text-[var(--muted)] mb-8">
          A simple online notepad. Auto-saves to your browser every 2 seconds. Multiple notes, download, and Markdown preview.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
          {notes.map((n) => (
            <div key={n.id} className="flex items-center gap-1">
              <button
                onClick={() => setActiveId(n.id)}
                className={`px-3 py-1.5 text-sm rounded-t-lg whitespace-nowrap ${
                  activeId === n.id
                    ? "bg-[var(--card-bg)] font-bold border border-[var(--border)] border-b-transparent"
                    : "bg-[var(--bg-secondary)] text-[var(--muted)] hover:bg-[var(--card-bg)]"
                }`}
              >
                {n.title}
              </button>
              {notes.length > 1 && activeId === n.id && (
                <button
                  onClick={() => deleteNote(n.id)}
                  className="text-xs text-red-500 hover:text-red-700 px-1"
                  title="Delete note"
                >
                  x
                </button>
              )}
            </div>
          ))}
          <button onClick={addNote} className="px-3 py-1.5 text-sm text-[var(--primary)] hover:bg-[var(--bg-secondary)] rounded">
            + New
          </button>
        </div>

        {activeNote && (
          <div className="tool-card mb-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-3 pb-3 border-b border-[var(--border)]">
              <div>
                <label className="text-xs text-[var(--muted)] mr-1">Title:</label>
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateTitle(e.target.value)}
                  className="input-field text-sm inline-block w-40"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mr-1">Font:</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="input-field text-sm inline-block w-16"
                >
                  {[10, 12, 14, 16, 18, 20, 24].map((s) => (
                    <option key={s} value={s}>{s}px</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowMarkdown(!showMarkdown)}
                className={showMarkdown ? "btn-primary text-xs" : "btn-secondary text-xs"}
              >
                {showMarkdown ? "Edit" : "Preview MD"}
              </button>
              <button onClick={downloadNote} className="btn-secondary text-xs">
                Download .txt
              </button>
            </div>

            {/* Editor / Preview */}
            {showMarkdown ? (
              <div
                className="input-field min-h-[400px] p-4 prose prose-sm max-w-none overflow-y-auto"
                style={{ fontSize }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(activeNote.content) }}
              />
            ) : (
              <textarea
                value={activeNote.content}
                onChange={(e) => updateContent(e.target.value)}
                className="input-field min-h-[400px] resize-y font-mono"
                style={{ fontSize }}
                placeholder="Start typing..."
              />
            )}

            {/* Status bar */}
            <div className="flex items-center justify-between mt-3 text-xs text-[var(--muted)]">
              <span>Words: {wordCount} | Characters: {charCount}</span>
              <span>Auto-saving...</span>
            </div>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Online Notepad</h2>
          <p>
            A simple, distraction-free notepad that runs entirely in your browser. Your notes are automatically
            saved to your browser&apos;s local storage every 2 seconds, so you never lose your work.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Auto-Save:</strong> Notes save to your browser every 2 seconds automatically</li>
            <li><strong>Multiple Notes:</strong> Create and manage multiple notes with tabs</li>
            <li><strong>Word/Character Count:</strong> Real-time count displayed in the status bar</li>
            <li><strong>Font Size:</strong> Adjust text size from 10px to 24px</li>
            <li><strong>Download:</strong> Save any note as a .txt file</li>
            <li><strong>Markdown Preview:</strong> Toggle to see basic Markdown rendering (headers, bold, italic, code, lists)</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All notes are stored locally in your browser. Nothing is sent to any server.
            Clearing your browser data will remove saved notes.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Notepad",
            description: META.description,
            url: `${SITE_URL}/tools/notepad`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
