import { useState, useRef, useEffect } from "react";

type Filter = "all" | "active" | "done";

interface Task {
  id: number;
  text: string;
  done: boolean;
  createdAt: Date;
}

let nextId = 1;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: nextId++, text: "Review project brief", done: true, createdAt: new Date() },
    { id: nextId++, text: "Sketch wireframes for onboarding", done: false, createdAt: new Date() },
    { id: nextId++, text: "Write up meeting notes from Tuesday", done: false, createdAt: new Date() },
    { id: nextId++, text: "Send invoice to client", done: false, createdAt: new Date() },
  ]);
  const [filter, setFilter] = useState<Filter>("all");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  const activeCount = tasks.filter((t) => !t.done).length;

  function addTask() {
    const text = input.trim();
    if (!text) return;
    setTasks((prev) => [
      { id: nextId++, text, done: false, createdAt: new Date() },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  }

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function clearDone() {
    setTasks((prev) => prev.filter((t) => !t.done));
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="min-h-full flex flex-col items-center py-16 px-4"
      style={{ background: "var(--bg)" }}
    >
      {/* Header */}
      <div className="w-full max-w-lg mb-10">
        <h1
          className="text-5xl font-light leading-tight mb-1"
          style={{ fontFamily: "'Fraunces', serif", color: "var(--fg)" }}
        >
          To&#8209;do
        </h1>
        <p
          className="text-sm font-light tracking-wide"
          style={{ color: "var(--muted)" }}
        >
          {activeCount === 0
            ? "All clear."
            : `${activeCount} task${activeCount !== 1 ? "s" : ""} remaining`}
        </p>
      </div>

      {/* Input */}
      <div
        className="w-full max-w-lg flex gap-3 mb-8"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task…"
          className="flex-1 text-sm font-light px-4 py-3 rounded-xl outline-none transition-shadow"
          style={{
            background: "var(--card)",
            color: "var(--fg)",
            border: "1px solid var(--border)",
            boxShadow: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)`)
          }
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
        />
        <button
          onClick={addTask}
          className="px-5 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--accent-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--accent)")
          }
        >
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="w-full max-w-lg flex items-center justify-between mb-5">
        <div className="flex gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: filter === key ? "var(--fg)" : "transparent",
                color: filter === key ? "var(--bg)" : "var(--muted)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {tasks.some((t) => t.done) && (
          <button
            onClick={clearDone}
            className="text-xs font-light transition-opacity hover:opacity-60"
            style={{ color: "var(--muted)" }}
          >
            Clear done
          </button>
        )}
      </div>

      {/* Task list */}
      <div className="w-full max-w-lg flex flex-col gap-2">
        {visible.length === 0 ? (
          <div
            className="text-center text-sm py-12 font-light"
            style={{ color: "var(--muted)" }}
          >
            {filter === "done" ? "Nothing completed yet." : "Nothing here."}
          </div>
        ) : (
          visible.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTask(task.id)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        opacity: task.done ? 0.6 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: task.done ? "var(--accent)" : "var(--border)",
          background: task.done ? "var(--accent)" : "transparent",
        }}
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {task.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        className="flex-1 text-sm font-light leading-snug select-none"
        style={{
          color: "var(--fg)",
          textDecoration: task.done ? "line-through" : "none",
          textDecorationColor: "var(--done)",
        }}
      >
        {task.text}
      </span>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-all"
        style={{
          opacity: hovered ? 1 : 0,
          color: "var(--muted)",
        }}
        aria-label="Delete task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 2L10 10M10 2L2 10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
