import React, { useState, useEffect } from "react";
import api from "../../mock/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("users") || "{}");

  const fetchNotifications = async () => {
    const res = await api.get("/notifications", {
      params: { userId: user.id },
    });
    setNotifications(
      res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}`, { read: true });
    fetchNotifications();
  };

  const markAllRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) => api.patch(`/notifications/${n.id}`, { read: true })),
    );
    fetchNotifications();
  };

  const deleteNotif = async (id) => {
    await api.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const ICONS = {
    invite: "person_add",
    assign: "assignment_ind",
    comment: "comment",
    move: "swap_horiz",
  };

  return (
    <div className="ml-64 pt-20 p-8 min-h-screen bg-background">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#CCFF00] uppercase tracking-tighter font-['Space_Grotesk']">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-[#8e9379] text-xs mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-[#CCFF00] hover:underline font-bold uppercase tracking-wider"
          >
            Mark all read
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#8e9379]">
          <span className="material-symbols-outlined text-5xl mb-4">
            notifications_none
          </span>
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${n.read ? "bg-[#1C1B1B] border-[#2a2a2a]" : "bg-[#1C1B1B] border-[#CCFF00]/30"}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.read ? "bg-[#2a2a2a]" : "bg-[#CCFF00]/20"}`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${n.read ? "text-[#8e9379]" : "text-[#CCFF00]"}`}
                >
                  {ICONS[n.type] || "notifications"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${n.read ? "text-[#8e9379]" : "text-[#E5E2E1]"}`}
                >
                  {n.message}
                </p>
                <p className="text-[10px] text-[#444] mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="p-1.5 text-[#8e9379] hover:text-[#CCFF00] transition-colors"
                    title="Mark as read"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      done
                    </span>
                  </button>
                )}
                <button
                  onClick={() => deleteNotif(n.id)}
                  className="p-1.5 text-[#8e9379] hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
