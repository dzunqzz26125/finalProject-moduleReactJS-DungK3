import React from "react";
import useTaskDetailStore from "../../store/useTaskDetailStore";

const ActivityTab = () => {
  const { activities } = useTaskDetailStore();

  return (
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
  );
};

export default ActivityTab;
