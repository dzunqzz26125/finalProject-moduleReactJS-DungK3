import React from "react";
import useTaskDetailStore from "../../store/useTaskDetailStore";

const ChecklistSection = ({ task, onRefresh }) => {
  const {
    checklist, newCheckItem,
    setNewCheckItem, toggleCheckItem, addCheckItem, removeCheckItem,
  } = useTaskDetailStore();

  const doneCount = checklist.filter((c) => c.done).length;
  const progress = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  return (
    <div>
      <p className="text-[9px] text-[#8e9379] uppercase tracking-widest mb-2">
        Checklist {checklist.length > 0 && `(${doneCount}/${checklist.length})`}
      </p>
      {checklist.length > 0 && (
        <div className="mb-2">
          <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#CCFF00] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-[#8e9379] mt-1">{progress}%</p>
        </div>
      )}
      <div className="space-y-1.5">
        {checklist.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <button
              onClick={() => toggleCheckItem(idx, task, onRefresh)}
              className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                item.done ? "bg-[#CCFF00] border-[#CCFF00]" : "border-[#444] hover:border-[#CCFF00]"
              }`}
            >
              {item.done && (
                <span className="material-symbols-outlined text-[#131313] text-[10px]">check</span>
              )}
            </button>
            <span className={`text-sm flex-1 ${item.done ? "line-through text-[#8e9379]" : "text-[#E5E2E1]"}`}>
              {item.text}
            </span>
            <button
              onClick={() => removeCheckItem(idx, task, onRefresh)}
              className="opacity-0 group-hover:opacity-100 text-[#8e9379] hover:text-red-400 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); addCheckItem(task, onRefresh); }}
        className="flex gap-2 mt-2"
      >
        <input
          value={newCheckItem}
          onChange={(e) => setNewCheckItem(e.target.value)}
          className="flex-1 bg-[#131313] border border-[#444] focus:border-[#CCFF00] text-[#E5E2E1] px-3 py-1.5 text-xs focus:ring-0"
          placeholder="Add item..."
        />
        <button
          type="submit"
          className="bg-[#CCFF00] text-[#131313] px-3 py-1.5 text-xs font-black hover:bg-[#ABD600] transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default ChecklistSection;
