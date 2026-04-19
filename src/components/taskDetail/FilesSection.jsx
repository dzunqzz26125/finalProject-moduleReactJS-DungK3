import React, { useRef } from "react";
import useTaskDetailStore from "../../store/useTaskDetailStore";

const FilesSection = ({ task, onRefresh }) => {
  const { files, handleFileUpload } = useTaskDetailStore();
  const fileRef = useRef();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] text-[#8e9379] uppercase tracking-widest">
          Attachments ({files.length})
        </p>
        <button
          onClick={() => fileRef.current?.click()}
          className="text-[10px] text-[#CCFF00] hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">attach_file</span>
          Attach
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0], task, onRefresh)}
        />
      </div>
      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#131313] px-3 py-2 rounded">
              <span className="material-symbols-outlined text-[#CCFF00] text-[16px]">description</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#E5E2E1] truncate">{f.name}</p>
                <p className="text-[10px] text-[#8e9379]">
                  {f.uploadedBy} • {new Date(f.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilesSection;
