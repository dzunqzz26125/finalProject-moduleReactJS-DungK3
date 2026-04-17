import React, { useState, useEffect, useRef } from "react";
import api from "../mock/api";

const LABEL_COLORS = {
  blue: "bg-blue-500", green: "bg-green-500", red: "bg-red-500",
  yellow: "bg-yellow-500", purple: "bg-purple-500", pink: "bg-pink-500",
};
const PRIORITY_COLORS = { low: "text-green-400", medium: "text-yellow-400", high: "text-orange-400", critical: "text-red-400" };

const TaskDetail = ({ task, onClose, onEdit, onRefresh }) => {
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [tab, setTab] = useState("comments");
  const [files, setFiles] = useState(task.files || []);
  const fileRef = useRef();
  const user = JSON.parse(localStorage.getItem("users") || "{}");

  useEffect(() => {
    Promise.all([
      api.get("/comments", { params: { taskId: task.id } }),
      api.get("/activities", { params: { taskId: task.id } }),
    ]).then(([cRes, aRes]) => {
      setComments(cRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setActivities(aRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });
  }, [task.id]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = { taskId: task.id, userId: user.id, userName: user.name || user.email, text: newComment.trim(), createdAt: new Date().toISOString() };
    await api.post("/comments", comment);
    await api.post("/activities", { taskId: task.id, userId: user.id, userName: user.name || user.email, action: "added a comment", createdAt: new Date().toISOString() });
    setNewComment("");
    const [cRes, aRes] = await Promise.all([
      api.get("/comments", { params: { taskId: task.id } }),
      api.get("/activities", { params: { taskId: task.id } }),
    ]);
    setComments(cRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setActivities(aRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const toggleCheckItem = async (idx) => {
    const updated = checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c);
    setChecklist(updated);
    await api.patch(`/tasks/${task.id}`, { checklist: updated });
    onRefresh();
  };

  const addCheckItem = async (e) => {
    e.preventDefault();
    if (!newCheckItem.trim()) return;
    const updated = [...checklist, { text: newCheckItem.trim(), done: false }];
    setChecklist(updated);
    await api.patch(`/tasks/${task.id}`, { checklist: updated });
    setNewCheckItem("");
    onRefresh();
  };

  const removeCheckItem = async (idx) => {
    const updated = checklist.filter((_, i) => i !== idx);
    setChecklist(updated);
    await api.patch(`/tasks/${task.id}`, { checklist: updated });
    onRefresh();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileData = { name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString(), uploadedBy: user.name || user.email };
    const updated = [...files, fileData];
    setFiles(updated);
    await api.patch(`/tasks/${task.id}`, { files: updated });
    await api.post("/activities", { taskId: task.id, userId: user.id, userName: user.name || user.email, action: `attached file: ${file.name}`, createdAt: new Date().toISOString() });
    onRefresh();
  };

  const doneCount = checklist.filter((c) => c.done).length;
  const progress = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1C1B1B] border-2 border-[#CCFF00] w-full max-w-2xl shadow-[0_0_50px_rgba(204,255,0,0.1)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#CCFF00] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-[#131313] font-black text-lg uppercase tracking-tighter font-['Space_Grotesk'] flex-1 mr-4 truncate">{task.title}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(task)} className="w-8 h-8 flex items-center justify-center border-2 border-[#131313] hover:bg-[#131313] hover:text-[#CCFF00] transition-all">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border-2 border-[#131313] hover:bg-[#131313] hover:text-[#CCFF00] transition-all">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Labels */}
          {task.labels?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {task.labels.map((l) => (
                <span key={l} className={`${LABEL_COLORS[l] || "bg-gray-500"} text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase`}>{l}</span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">Priority</p>
              <span className={`text-xs font-bold uppercase ${PRIORITY_COLORS[task.priority] || "text-[#CCFF00]"}`}>{task.priority}</span>
            </div>
            {task.deadline && (
              <div>
                <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">Deadline</p>
                <span className={`text-xs font-bold ${new Date(task.deadline) < new Date() ? "text-red-400" : "text-[#E5E2E1]"}`}>{task.deadline}</span>
              </div>
            )}
            {task.assignees?.length > 0 && (
              <div className="col-span-2">
                <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">Assignees</p>
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map((a) => (
                    <span key={a} className="flex items-center gap-1 bg-[#131313] px-2 py-1 rounded-full text-xs text-[#E5E2E1]">
                      <div className="w-4 h-4 bg-[#CCFF00] rounded-full flex items-center justify-center text-[#131313] text-[9px] font-black">{a[0].toUpperCase()}</div>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {task.description && (
            <div>
              <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">Description</p>
              <p className="text-[#E5E2E1] text-sm leading-relaxed">{task.description}</p>
            </div>
          )}

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] text-[#8e9379] uppercase tracking-widest">Checklist {checklist.length > 0 && `(${doneCount}/${checklist.length})`}</p>
            </div>
            {checklist.length > 0 && (
              <div className="mb-2">
                <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#CCFF00] rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-[10px] text-[#8e9379] mt-1">{progress}%</p>
              </div>
            )}
            <div className="space-y-1.5">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group">
                  <button onClick={() => toggleCheckItem(idx)} className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.done ? "bg-[#CCFF00] border-[#CCFF00]" : "border-[#444] hover:border-[#CCFF00]"}`}>
                    {item.done && <span className="material-symbols-outlined text-[#131313] text-[10px]">check</span>}
                  </button>
                  <span className={`text-sm flex-1 ${item.done ? "line-through text-[#8e9379]" : "text-[#E5E2E1]"}`}>{item.text}</span>
                  <button onClick={() => removeCheckItem(idx)} className="opacity-0 group-hover:opacity-100 text-[#8e9379] hover:text-red-400 transition-all">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={addCheckItem} className="flex gap-2 mt-2">
              <input
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                className="flex-1 bg-[#131313] border border-[#444] focus:border-[#CCFF00] text-[#E5E2E1] px-3 py-1.5 text-xs focus:ring-0"
                placeholder="Add item..."
              />
              <button type="submit" className="bg-[#CCFF00] text-[#131313] px-3 py-1.5 text-xs font-black hover:bg-[#ABD600] transition-colors">Add</button>
            </form>
          </div>

          {/* Files */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] text-[#8e9379] uppercase tracking-widest">Attachments ({files.length})</p>
              <button onClick={() => fileRef.current?.click()} className="text-[10px] text-[#CCFF00] hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">attach_file</span>
                Attach
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
            {files.length > 0 && (
              <div className="space-y-1.5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#131313] px-3 py-2 rounded">
                    <span className="material-symbols-outlined text-[#CCFF00] text-[16px]">description</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#E5E2E1] truncate">{f.name}</p>
                      <p className="text-[10px] text-[#8e9379]">{f.uploadedBy} • {new Date(f.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tabs: Comments / Activity */}
          <div>
            <div className="flex gap-4 border-b border-[#2a2a2a] mb-4">
              {["comments", "activity"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${tab === t ? "text-[#CCFF00] border-b-2 border-[#CCFF00]" : "text-[#8e9379] hover:text-[#E5E2E1]"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "comments" && (
              <div className="space-y-3">
                <form onSubmit={addComment} className="flex gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-[#131313] border border-[#444] focus:border-[#CCFF00] text-[#E5E2E1] px-3 py-2 text-sm focus:ring-0"
                    placeholder="Write a comment..."
                  />
                  <button type="submit" className="bg-[#CCFF00] text-[#131313] px-4 py-2 text-xs font-black hover:bg-[#ABD600] transition-colors">Send</button>
                </form>
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-7 h-7 bg-[#CCFF00] rounded-full flex items-center justify-center text-[#131313] text-xs font-black flex-shrink-0">
                      {(c.userName || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 bg-[#131313] rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#CCFF00] text-xs font-bold">{c.userName}</span>
                        <span className="text-[#8e9379] text-[10px]">{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-[#E5E2E1] text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "activity" && (
              <div className="space-y-2">
                {activities.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#2a2a2a] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[#8e9379] text-[12px]">history</span>
                    </div>
                    <div>
                      <span className="text-[#CCFF00] text-xs font-bold">{a.userName}</span>
                      <span className="text-[#8e9379] text-xs"> {a.action}</span>
                      <p className="text-[10px] text-[#444]">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
