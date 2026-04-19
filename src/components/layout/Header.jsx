import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../mock/api";
import { useTheme } from "../../lib/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("users") || "{}");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    if (!user.id) return;
    api
      .get("/notifications", { params: { userId: user.id, read: false } })
      .then((res) => setUnreadCount(res.data.length))
      .catch(() => {});
    const interval = setInterval(() => {
      api
        .get("/notifications", { params: { userId: user.id, read: false } })
        .then((res) => setUnreadCount(res.data.length))
        .catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem("users");
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 w-full border-b-2 flex justify-between items-center px-6 h-16 z-50 transition-colors"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--accent)",
      }}
    >
      <div className="flex items-center gap-8">
        <Link to="/app/dashboard">
          <h1
            className="text-2xl font-black italic font-['Space_Grotesk'] uppercase tracking-tighter"
            style={{ color: "var(--accent)" }}
          >
            ANARCHY PROJECTS
          </h1>
        </Link>
        <nav className="hidden md:flex gap-6">
          {[
            { to: "/app/dashboard", label: "Dashboard" },
            { to: "/app/workspaces", label: "Workspaces" },
            { to: "/app/task", label: "Board" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="font-['Space_Grotesk'] uppercase tracking-tighter text-sm transition-colors"
              style={{ color: "var(--text-primary)" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-primary)")
              }
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center transition-colors rounded"
          style={{ color: "var(--text-muted)" }}
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>

        <Link
          to="/app/notifications"
          className="relative transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div
            className="w-8 h-8 flex items-center justify-center font-black text-sm"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-text)",
            }}
          >
            {(user?.name || user?.email || "U")[0].toUpperCase()}
          </div>
          <span
            className="hidden md:block text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-primary)" }}
          >
            {user?.name || user?.email || "User"}
          </span>
        </button>

        {dropdownOpen && (
          <div
            className="absolute top-12 right-0 border-2 min-w-[180px] z-50"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--accent)",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "var(--border-accent)" }}
            >
              <p
                className="text-xs font-bold font-['Space_Grotesk'] uppercase"
                style={{ color: "var(--accent)" }}
              >
                {user?.name || "User"}
              </p>
              <p
                className="text-[10px] truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {user?.email}
              </p>
              <p
                className="text-[10px] uppercase"
                style={{ color: "var(--text-faint)" }}
              >
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 transition-all font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider"
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
        )}
      </div>
    </div>
  );
};

export default Header;
