import React, { useState, useEffect } from "react";
import api from "../../mock/api";
import { DAYS, MONTHS, PRIORITY_COLOR } from "./constantCalendar";

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const currentUser = JSON.parse(localStorage.getItem("users") || "null");

  useEffect(() => {
    api
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => {});
  }, []);

  const myTasks = tasks.filter(
    (t) =>
      Array.isArray(t.assignees) && t.assignees.includes(currentUser?.email),
  );

  const tasksByDate = myTasks.reduce((acc, t) => {
    if (!t.deadline) return acc;
    const key = t.deadline.slice(0, 10);
    acc[key] = acc[key] ? [...acc[key], t] : [t];
    return acc;
  }, {});

  const { year, month } = current;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () =>
    setCurrent(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  const nextMonth = () =>
    setCurrent(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="ml-64 pt-20 p-8 min-h-screen"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-black uppercase tracking-tighter font-['Space_Grotesk']"
            style={{ color: "var(--accent)" }}
          >
            Calendar
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Your tasks by deadline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={prevMonth}
            className="p-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <span
            className="font-black font-['Space_Grotesk'] text-sm tracking-widest"
            style={{ color: "var(--text-primary)" }}
          >
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </header>

      <div
        className="rounded-xl overflow-hidden border"
        style={{
          backgroundColor: "var(--bg-elevated)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="grid grid-cols-7 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {DAYS.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dateKey = day
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : null;
            const dayTasks = dateKey ? tasksByDate[dateKey] || [] : [];
            const isToday =
              day &&
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;

            return (
              <div
                key={idx}
                className="min-h-25 p-2 border-b border-r"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: isToday
                    ? "var(--bg-surface)"
                    : "transparent",
                }}
              >
                {day && (
                  <>
                    <div
                      className={`w-7 h-7 flex items-center justify-center text-xs font-bold mb-1 ${isToday ? "rounded-full" : ""}`}
                      style={
                        isToday
                          ? {
                              backgroundColor: "var(--accent)",
                              color: "var(--accent-text)",
                            }
                          : { color: "var(--text-primary)" }
                      }
                    >
                      {day}
                    </div>
                    <div className="flex flex-col gap-1">
                      {dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded truncate"
                          style={{
                            backgroundColor:
                              PRIORITY_COLOR[t.priority] || "var(--accent)",
                            color: "#fff",
                          }}
                          title={t.title}
                        >
                          {t.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
