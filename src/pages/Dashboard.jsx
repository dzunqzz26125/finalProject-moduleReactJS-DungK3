import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../mock/api";

const COLORS = {
  todo: "#3b82f6",
  in_progress: "#f59e0b",
  review: "#8b5cf6",
  done: "#22c55e",
};
const PRIORITY_COLORS = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
};

const StatCard = ({ label, value, icon, color }) => (
  <div
    className="border rounded-xl p-5 flex items-center gap-4 transition-colors"
    style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
      <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-2xl font-black font-['Space_Grotesk']" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/tasks"),
      api.get("/boards"),
      api.get("/workspaces"),
    ]).then(([t, b, w]) => {
      setTasks(t.data);
      setBoards(b.data);
      setWorkspaces(w.data);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const overdue = tasks.filter(
    (t) => t.deadline && t.deadline < today && t.status !== "done",
  );
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const statusData = ["todo", "in_progress", "review", "done"]
    .map((s) => ({
      name: s.replace("_", " ").toUpperCase(),
      value: tasks.filter((t) => t.status === s).length,
      color: COLORS[s],
    }))
    .filter((d) => d.value > 0);

  const priorityData = ["low", "medium", "high", "critical"].map((p) => ({
    name: p.toUpperCase(),
    count: tasks.filter((t) => t.priority === p).length,
    fill: PRIORITY_COLORS[p],
  }));

  const boardTaskData = boards.map((b) => ({
    name: b.name,
    tasks: tasks.filter((t) => t.boardId === b.id).length,
  }));

  return (
    <div className="ml-64 pt-20 p-8 min-h-screen transition-colors" style={{ backgroundColor: "var(--bg-base)" }}>
      <header className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter font-['Space_Grotesk']" style={{ color: "var(--accent)" }}>
          Dashboard
        </h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Overview of all your projects
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={tasks.length} icon="task_alt" color="var(--accent)" />
        <StatCard label="Completed" value={doneCount} icon="check_circle" color="#22c55e" />
        <StatCard label="Overdue" value={overdue.length} icon="warning" color="#ef4444" />
        <StatCard label="Boards" value={boards.length} icon="dashboard" color="#8b5cf6" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-xl p-6 transition-colors" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <h3 className="font-bold uppercase tracking-wide text-sm mb-4" style={{ color: "var(--text-primary)" }}>Tasks by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  activeShape={false}
                  activeIndex={null}
                >
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1B1B",
                    border: "1px solid #2a2a2a",
                    color: "#E5E2E1",
                    fontSize: 12,
                  }}
                />
                <Legend
                  formatter={(v) => (
                    <span style={{ color: "#8e9379", fontSize: 11 }}>{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[#8e9379] text-sm text-center py-8">
              No tasks yet
            </p>
          )}
        </div>

        <div className="border rounded-xl p-6 transition-colors" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <h3 className="font-bold uppercase tracking-wide text-sm mb-4" style={{ color: "var(--text-primary)" }}>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={priorityData} barSize={32} style={{ cursor: "default" }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#8e9379", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8e9379", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "#1C1B1B",
                  border: "1px solid #2a2a2a",
                  color: "#E5E2E1",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false} activeBar={false}>
                {priorityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Board breakdown */}
      {boardTaskData.length > 0 && (
        <div className="border rounded-xl p-6 mb-8 transition-colors" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}>
          <h3 className="font-bold uppercase tracking-wide text-sm mb-4" style={{ color: "var(--text-primary)" }}>Tasks per Board</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={boardTaskData} barSize={40} style={{ cursor: "default" }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#8e9379", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8e9379", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "#1C1B1B",
                  border: "1px solid #2a2a2a",
                  color: "#E5E2E1",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="tasks" fill="#CCFF00" radius={[4, 4, 0, 0]} isAnimationActive={false} activeBar={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Overdue tasks */}
      {overdue.length > 0 && (
        <div className="border border-red-500/30 rounded-xl p-6 transition-colors" style={{ backgroundColor: "var(--bg-elevated)" }}>
          <h3 className="text-red-400 font-bold uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            Overdue Tasks ({overdue.length})
          </h3>
          <div className="space-y-2">
            {overdue.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-lg transition-colors" style={{ backgroundColor: "var(--bg-surface)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t.title}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{t.assignees?.join(", ")}</p>
                </div>
                <span className="text-red-400 text-xs font-bold">{t.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
