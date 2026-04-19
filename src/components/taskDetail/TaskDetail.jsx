import React, { useEffect } from "react";
import { LABEL_COLORS, PRIORITY_COLORS } from "../../constants/taskConstants";
import useTaskDetailStore from "../../store/useTaskDetailStore";
import ChecklistSection from "./ChecklistSection";
import FilesSection from "./FilesSection";
import CommentsTab from "./CommentsTab";
import ActivityTab from "./ActivityTab";

const TaskDetail = ({ task, onClose, onEdit, onRefresh }) => {
  const { tab, setTab, init } = useTaskDetailStore();

  useEffect(() => {
    init(task);
  }, [task.id]);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#1C1B1B] border-2 border-[#CCFF00] w-full max-w-2xl shadow-[0_0_50px_rgba(204,255,0,0.1)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#CCFF00] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-[#131313] font-black text-lg uppercase tracking-tighter font-['Space_Grotesk'] flex-1 mr-4 truncate">
            {task.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="w-8 h-8 flex items-center justify-center border-2 border-[#131313] hover:bg-[#131313] hover:text-[#CCFF00] transition-all"
            >
              <span className="material-symbols-outlined text-black text-sm">
                edit
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center text-black justify-center border-2 border-[#131313] bg-[#CCFF00] hover:text-[#CCFF00] transition-all"
            >
              <span className="material-symbols-outlined text-black">
                close
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {task.labels?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {task.labels.map((l) => (
                <span
                  key={l}
                  className={`${LABEL_COLORS[l] || "bg-gray-500"} text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase`}
                >
                  {l}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">
                Priority
              </p>
              <span
                className={`text-xs font-bold uppercase ${PRIORITY_COLORS[task.priority] || "text-[#CCFF00]"}`}
              >
                {task.priority}
              </span>
            </div>
            {task.deadline && (
              <div>
                <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">
                  Deadline
                </p>
                <span
                  className={`text-xs font-bold ${new Date(task.deadline) < new Date() ? "text-red-400" : "text-[#E5E2E1]"}`}
                >
                  {task.deadline}
                </span>
              </div>
            )}
            {task.assignees?.length > 0 && (
              <div className="col-span-2">
                <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">
                  Assignees
                </p>
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1 bg-[#131313] px-2 py-1 rounded-full text-xs text-[#E5E2E1]"
                    >
                      <div className="w-4 h-4 bg-[#CCFF00] rounded-full flex items-center justify-center text-[#131313] text-[9px] font-black">
                        {a[0].toUpperCase()}
                      </div>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {task.description && (
            <div>
              <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-1">
                Description
              </p>
              <p className="text-[#E5E2E1] text-sm leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          <ChecklistSection task={task} onRefresh={onRefresh} />
          <FilesSection task={task} onRefresh={onRefresh} />

          <div>
            <div className="flex gap-4 border-b border-[#2a2a2a] mb-4">
              {["comments", "activity"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    tab === t
                      ? "text-[#CCFF00] border-b-2 border-[#CCFF00]"
                      : "text-[#8e9379] hover:text-[#E5E2E1]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === "comments" ? (
              <CommentsTab task={task} onRefresh={onRefresh} />
            ) : (
              <ActivityTab />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
