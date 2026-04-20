import React from "react";
import { useDroppable } from "@dnd-kit/core";

const DroppableList = ({ listId, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: listId });
  return (
    <div
      ref={setNodeRef}
      className={`p-3 flex flex-col gap-2 min-h-[60px] rounded-lg transition-colors ${isOver ? "bg-[#CCFF00]/5" : ""}`}
    >
      {children}
    </div>
  );
};

export default DroppableList;
