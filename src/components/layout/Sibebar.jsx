import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../mock/api";

const navItems = [
  { to: "/app/dashboard", icon: "analytics", label: "DASHBOARD" },
  { to: "/app/workspaces", icon: "grid_view", label: "WORKSPACES" },
  { to: "/app/calendar", icon: "calendar_month", label: "CALENDAR" },
  { to: "/app/notifications", icon: "notifications", label: "NOTIFICATIONS" },
];

const Sibebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("users") || "{}");

  useEffect(() => {
    if (!user.id) return;
    api
      .get("/notifications", { params: { userId: user.id, read: false } })
      .then((res) => setUnreadCount(res.data.length))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("users");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <aside
      className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r-2 flex flex-col py-8 gap-4 z-40 transition-colors"
      style={{
        backgroundColor: "var(--bg-elevated)",
        borderColor: "var(--border)",
      }}
    >
      <div className="px-6 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <span
              className="material-symbols-outlined font-bold"
              style={{ color: "var(--accent-text)" }}
            >
              bolt
            </span>
          </div>
          <div>
            <div
              className="text-lg font-bold font-['Space_Grotesk'] leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              NEON LABS
            </div>
            <div
              className="text-xs font-['Space_Grotesk']"
              style={{ color: "var(--text-muted)" }}
            >
              V.3.0.0
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon, label }) => {
          const active =
            location.pathname === to ||
            (to !== "/app/task" && location.pathname.startsWith(to));
          return (
            <Link
              key={label}
              to={to}
              className="flex items-center px-6 py-3 gap-4 border-l-4 transition-all"
              style={
                active
                  ? {
                      backgroundColor: "var(--accent)",
                      color: "var(--accent-text)",
                      borderColor: "#FF00FF",
                    }
                  : { color: "var(--text-primary)", borderColor: "transparent" }
              }
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-['Space_Grotesk'] font-bold text-sm tracking-widest flex-1">
                {label}
              </span>
              {label === "NOTIFICATIONS" && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto flex flex-col gap-2">
        <Link
          to="/app/workspaces"
          className="py-3 px-4 font-['Space_Grotesk'] font-black text-sm tracking-tighter transition-colors flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-text)",
          }}
        >
          <span className="material-symbols-outlined">add_box</span>
          NEW BOARD
        </Link>
        <div
          className="mt-4 pt-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-2 font-['Space_Grotesk'] text-xs font-bold transition-all w-full"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#FF00FF")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sibebar;
