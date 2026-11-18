"use client";

import { useState, useEffect } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

const META = {
  title: "To-Do List - Free Online Task Manager",
  description:
    "Free online To-Do List. Add tasks, check/uncheck, delete, reorder with up/down buttons, filter by status, and auto-save to your browser.",
  keywords: "todo list, to do list, task manager, task list, online todo, free todo app",
};

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type Filter = "all" | "active" | "completed";

export default function TodoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("todo-list-tasks");
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("todo-list-tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks, loaded]);

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [
      ...prev,
      { id: String(Date.now()), text, completed: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setTasks((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index >= tasks.length - 1) return;
    setTasks((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  if (!loaded) return null;

  return (
    <>
      <title>{META.title} | {SITE_NAME}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <link rel="canonical" href={`${SITE_URL}/tools/todo-list`} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`/tools/todo-list`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <a href="/" className="text-sm text-[var(--primary)] hover:underline">&larr; All Tools</a>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">To-Do List</h1>
        <p className="text-[var(--muted)] mb-8">
          A simple task manager. Add, check off, reorder, and filter your tasks. Auto-saves to your browser.
        </p>

        <div className="ad-placeholder mb-8">Advertisement</div>

        {/* Add Task */}
        <div className="tool-card mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
              className="input-field text-sm flex-1"
              placeholder="What needs to be done?"
            />
            <button onClick={addTask} className="btn-primary text-sm px-4" disabled={!newTask.trim()}>
              Add
            </button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="tool-card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-4 text-sm">
              <span><strong>{tasks.length}</strong> total</span>
              <span><strong>{activeCount}</strong> active</span>
              <span><strong>{completedCount}</strong> completed</span>
            </div>
            <div className="flex gap-2">
              {(["all", "active", "completed"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm px-3 py-1 rounded capitalize ${
                    filter === f ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-secondary)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length > 0 ? (
          <div className="tool-card mb-6">
            <div className="space-y-2">
              {filteredTasks.map((task, displayIndex) => {
                const realIndex = tasks.findIndex((t) => t.id === task.id);
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      task.completed ? "bg-green-50 dark:bg-green-950 opacity-70" : "bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                        task.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-[var(--primary)]"
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <span className={`flex-1 text-sm ${task.completed ? "line-through text-[var(--muted)]" : ""}`}>
                      {task.text}
                    </span>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => moveUp(realIndex)}
                        className="text-xs px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]"
                        disabled={realIndex === 0}
                        title="Move up"
                      >
                        &uarr;
                      </button>
                      <button
                        onClick={() => moveDown(realIndex)}
                        className="text-xs px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--bg-secondary)]"
                        disabled={realIndex === tasks.length - 1}
                        title="Move down"
                      >
                        &darr;
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-xs px-1.5 py-0.5 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        title="Delete"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="tool-card mb-6 text-center py-8">
            <p className="text-[var(--muted)]">
              {tasks.length === 0 ? "No tasks yet. Add one above!" : "No tasks match this filter."}
            </p>
          </div>
        )}

        {completedCount > 0 && (
          <div className="mb-8 text-center">
            <button onClick={clearCompleted} className="btn-secondary text-sm">
              Clear {completedCount} Completed Task{completedCount !== 1 ? "s" : ""}
            </button>
          </div>
        )}

        <div className="ad-placeholder mb-8">Advertisement</div>

        <div className="seo-content tool-card">
          <h2>Online To-Do List</h2>
          <p>
            A clean, simple task manager that saves to your browser. Add tasks, mark them as complete,
            reorder them, and filter by status. Everything is stored locally.
          </p>

          <h2>Features</h2>
          <ul>
            <li><strong>Add Tasks:</strong> Type and press Enter or click Add</li>
            <li><strong>Check/Uncheck:</strong> Click the checkbox to toggle completion</li>
            <li><strong>Delete:</strong> Remove individual tasks</li>
            <li><strong>Reorder:</strong> Move tasks up or down with arrow buttons</li>
            <li><strong>Filter:</strong> View all, active, or completed tasks</li>
            <li><strong>Clear Completed:</strong> Remove all finished tasks at once</li>
            <li><strong>Auto-Save:</strong> Tasks persist in your browser&apos;s local storage</li>
            <li><strong>Task Count:</strong> See total, active, and completed counts</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            All data is stored locally in your browser. Nothing is sent to any server. Clearing browser
            data will remove your saved tasks.
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
            name: "To-Do List",
            description: META.description,
            url: `${SITE_URL}/tools/todo-list`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </>
  );
}
