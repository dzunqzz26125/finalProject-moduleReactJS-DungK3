import React from "react";
import useTaskDetailStore from "../../store/useTaskDetailStore";

const CommentsTab = ({ task, onRefresh }) => {
  const { comments, newComment, setNewComment, addComment } = useTaskDetailStore();

  return (
    <div className="space-y-3">
      <form onSubmit={(e) => { e.preventDefault(); addComment(task, onRefresh); }} className="flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-[#131313] border border-[#444] focus:border-[#CCFF00] text-[#E5E2E1] px-3 py-2 text-sm focus:ring-0"
          placeholder="Write a comment..."
        />
        <button
          type="submit"
          className="bg-[#CCFF00] text-[#131313] px-4 py-2 text-xs font-black hover:bg-[#ABD600] transition-colors"
        >
          Send
        </button>
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
  );
};

export default CommentsTab;
