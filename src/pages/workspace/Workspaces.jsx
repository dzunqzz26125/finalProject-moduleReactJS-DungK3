import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../mock/api";
import WorkspaceForm from "../../components/workspace/WorkspaceForm";
import BoardForm from "../Board/BoardForm";
import InviteMember from "../../components/workspace/InviteMember";

const Workspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [boards, setBoards] = useState([]);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showWsForm, setShowWsForm] = useState(false);
  const [editWs, setEditWs] = useState(null);
  const [showBoardForm, setShowBoardForm] = useState(null);
  const [showInvite, setShowInvite] = useState(null);
  const [expandedWs, setExpandedWs] = useState({});
  const navigate = useNavigate();
  const currentUser = React.useMemo(
    () => JSON.parse(localStorage.getItem("users") || "null"),
    []
  );


  const fetchAll = async () => {
    const [wsRes, boardsRes, membersRes, usersRes, tasksRes] = await Promise.all([
      api.get("/workspaces"),
      api.get("/boards"),
      api.get("/workspace_members"),
      api.get("/users"),
      api.get("/tasks"),
    ]);
    setWorkspaces(wsRes.data);
    setBoards(boardsRes.data);
    setMembers(membersRes.data);
    setUsers(usersRes.data);
    setTasks(tasksRes.data);
    const expanded = {};
    wsRes.data.forEach((w) => (expanded[w.id] = true));
    setExpandedWs(expanded);
  };

  useEffect(() => { fetchAll(); }, []);

  const sameId = (a, b) => Number(a) === Number(b);

  const getVisibleWorkspaces = () => {
    if (!currentUser?.id) return [];
    return workspaces.filter((ws) =>
      members.some((m) => sameId(m.workspaceId, ws.id) && sameId(m.userId, currentUser.id))
    );
  };

  const getUserRole = (workspaceId) => {
    const m = members.find(
      (m) => sameId(m.workspaceId, workspaceId) && sameId(m.userId, currentUser.id)
    );
    return m?.role || null;
  };

  const deleteWorkspace = async (id) => {
    if (!window.confirm("Delete this workspace and all its boards?")) return;
    await api.delete(`/workspaces/${id}`);
    fetchAll();
  };

  const deleteBoard = async (id) => {
    if (!window.confirm("Delete this board?")) return;
    await api.delete(`/boards/${id}`);
    fetchAll();
  };

  const getMemberUser = (userId) => users.find((u) => u.id === userId);
  const visibleWorkspaces = getVisibleWorkspaces();

  return (
    <div
      className="ml-64 pt-20 p-8 min-h-screen transition-colors"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-black uppercase tracking-tighter font-['Space_Grotesk']"
            style={{ color: "var(--accent)" }}
          >
            Workspaces
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {visibleWorkspaces.length} workspace(s)
          </p>
        </div>
        <button
          onClick={() => { setEditWs(null); setShowWsForm(true); }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all"
          style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Workspace
        </button>
      </header>

      <div className="space-y-8">
        {visibleWorkspaces.map((ws) => {
          const role = getUserRole(ws.id);
          const wsBoards = boards.filter((b) => {
            if (!sameId(b.workspaceId, ws.id)) return false;
            if (role === "admin") return true;
            // member/viewer: chỉ hiển thị board có task được assign cho user này
            return tasks.some(
              (t) => sameId(t.boardId, b.id) && Array.isArray(t.assignees) && t.assignees.includes(currentUser.email)
            );
          });
          const wsMembers = members.filter((m) => sameId(m.workspaceId, ws.id));
          const isExpanded = expandedWs[ws.id];

          return (
            <div
              key={ws.id}
              className="border rounded-xl overflow-hidden transition-colors"
              style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div
                className="flex items-center gap-4 p-5 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-black"
                  style={{ backgroundColor: ws.color }}
                >
                  {ws.name[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold font-['Space_Grotesk']" style={{ color: "var(--text-primary)" }}>
                    {ws.name}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {wsBoards.length} boards • {wsMembers.length} members •{" "}
                    <span className="uppercase" style={{ color: "var(--accent)" }}>{role}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {role === "admin" && (
                    <>
                      <button onClick={() => setShowInvite(ws.id)} className="p-2 transition-colors" style={{ color: "var(--text-muted)" }} title="Invite member">
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                      </button>
                      <button onClick={() => { setEditWs(ws); setShowWsForm(true); }} className="p-2 transition-colors" style={{ color: "var(--text-muted)" }}>
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => deleteWorkspace(ws.id)} className="p-2 transition-colors text-red-400">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setExpandedWs((p) => ({ ...p, [ws.id]: !p[ws.id] }))}
                    className="p-2 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isExpanded ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5">
                  <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                      Members
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {wsMembers.map((m) => {
                        const u = getMemberUser(m.userId);
                        return (
                          <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "var(--bg-surface)" }}>
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>
                              {(u?.name || u?.email || "?")[0].toUpperCase()}
                            </div>
                            <span className="text-xs" style={{ color: "var(--text-primary)" }}>{u?.name || u?.email}</span>
                            <span className={`text-[9px] uppercase font-bold ${m.role === "admin" ? "text-yellow-400" : m.role === "viewer" ? "text-gray-400" : "text-blue-400"}`}>
                              {m.role}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(role === "admin" || role === "member") && (
                      <button
                        onClick={() => setShowBoardForm(ws.id)}
                        className="h-24 rounded-xl flex flex-col items-center justify-center border-2 border-dashed transition-all"
                        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
                      >
                        <span className="material-symbols-outlined" style={{ color: "var(--text-faint)" }}>add</span>
                        <span className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: "var(--text-faint)" }}>New Board</span>
                      </button>
                    )}
                    {wsBoards.map((board) => (
                      <div
                        key={board.id}
                        className="relative h-24 rounded-xl p-4 cursor-pointer hover:brightness-110 transition-all group"
                        style={{ backgroundColor: board.color || "#0079bf" }}
                        onClick={() => navigate(`/app/workspaces/${ws.id}/board/${board.id}`)}
                      >
                        <span className="text-white font-bold text-sm">{board.name}</span>
                        {role === "admin" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteBoard(board.id); }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 bg-black/40 rounded flex items-center justify-center hover:bg-red-500/80 transition-all"
                          >
                            <span className="material-symbols-outlined text-white text-[12px]">close</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showWsForm && (
        <WorkspaceForm
          workspace={editWs}
          onClose={(refresh) => { setShowWsForm(false); setEditWs(null); if (refresh) fetchAll(); }}
        />
      )}
      {showBoardForm && (
        <BoardForm
          workspaceId={showBoardForm}
          onClose={(refresh) => { setShowBoardForm(null); if (refresh) fetchAll(); }}
        />
      )}
      {showInvite && (
        <InviteMember
          workspaceId={showInvite}
          onClose={() => { setShowInvite(null); fetchAll(); }}
        />
      )}
    </div>
  );
};

export default Workspaces;
