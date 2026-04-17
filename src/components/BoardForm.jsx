import React from "react";
import { useForm } from "react-hook-form";
import api from "../mock/api";

const COLORS = ["#0079bf", "#4bbf6b", "#89609e", "#cd5a91", "#e6a817", "#eb5a46", "#00c2e0", "#51e898"];

const BoardForm = ({ onClose, workspaceId, board }) => {
  const user = JSON.parse(localStorage.getItem("users") || "{}");
  const isEdit = !!board;
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: isEdit ? board : { color: COLORS[0], workspaceId },
  });

  const onSubmit = async (data) => {
    if (isEdit) {
      await api.put(`/boards/${board.id}`, data);
    } else {
      const res = await api.post("/boards", { ...data, workspaceId, createdBy: user.id, createdAt: new Date().toISOString().split("T")[0] });
      // Create default lists
      const boardId = res.data.id;
      await Promise.all([
        api.post("/lists", { boardId, name: "Todo", order: 0 }),
        api.post("/lists", { boardId, name: "In Progress", order: 1 }),
        api.post("/lists", { boardId, name: "Done", order: 2 }),
      ]);
    }
    onClose(true);
  };

  const selectedColor = watch("color");

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onClose(false)} />
      <div className="relative bg-[#1C1B1B] border-2 border-[#CCFF00] w-full max-w-md shadow-[0_0_50px_rgba(204,255,0,0.1)]">
        <div className="bg-[#CCFF00] px-6 py-4 flex items-center justify-between">
          <h2 className="text-[#131313] font-black text-xl uppercase tracking-tighter font-['Space_Grotesk']">
            {isEdit ? "Edit_Board" : "New_Board"}
          </h2>
          <button onClick={() => onClose(false)} className="w-8 h-8 flex items-center justify-center border-2 border-[#131313] hover:bg-[#131313] hover:text-[#CCFF00] transition-all">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div>
            <label className="text-[#CCFF00] text-[10px] uppercase tracking-widest block mb-2">Board Name *</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full bg-[#131313] border-b-2 border-[#444] focus:border-[#CCFF00] text-[#E5E2E1] py-2 px-0 text-sm focus:ring-0 transition-all"
              placeholder="BOARD NAME..."
            />
            {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-[#CCFF00] text-[10px] uppercase tracking-widest block mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <label key={c} className="cursor-pointer">
                  <input {...register("color")} type="radio" value={c} className="hidden" />
                  <div
                    className="w-8 h-8 rounded transition-all"
                    style={{ backgroundColor: c, outline: selectedColor === c ? "3px solid #CCFF00" : "none", outlineOffset: "2px" }}
                  />
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-[#CCFF00] text-[#131313] font-black py-3 uppercase tracking-wider font-['Space_Grotesk'] hover:bg-[#ABD600] transition-colors">
            {isEdit ? "Save Changes" : "Create Board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoardForm;
