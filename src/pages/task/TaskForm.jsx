import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../mock/api";
import {
  LABELS,
  LABEL_COLORS,
  PRIORITIES,
  PRIORITY_COLORS,
} from "../../constants/taskConstants";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  deadline: z.string().optional(),
  priority: z.string().min(1),
  status: z.string().min(1),
  tags: z.string().optional(),
});

const TaskForm = ({
  onClose,
  task,
  defaultStatus = "todo",
  defaultListId,
  boardId,
}) => {
  const user = JSON.parse(localStorage.getItem("users") || "{}");
  const isEdit = !!task;
  const [selectedLabels, setSelectedLabels] = useState(task?.labels || []);
  const [assignees, setAssignees] = useState(
    task?.assignees || [user?.email || ""],
  );
  const [assigneeInput, setAssigneeInput] = useState("");

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: isEdit
      ? { ...task, status: task.status || defaultStatus }
      : {
          priority: "medium",
          status: defaultStatus,
        },
  });

  const toggleLabel = (label) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const addAssignee = () => {
    if (assigneeInput.trim() && !assignees.includes(assigneeInput.trim())) {
      setAssignees((prev) => [...prev, assigneeInput.trim()]);
      setAssigneeInput("");
    }
  };

  const removeAssignee = (a) =>
    setAssignees((prev) => prev.filter((x) => x !== a));

  const onHdSubmit = async (data) => {
    const payload = {
      ...data,
      labels: selectedLabels,
      assignees,
      createBy: isEdit ? task.createBy : user?.name || user?.email || "",
      createAt: isEdit ? task.createAt : new Date().toISOString().split("T")[0],
      boardId: boardId || task?.boardId || 1,
      listId: data.listId
        ? Number(data.listId)
        : defaultListId || task?.listId || 1,
      projectId: task?.projectId || 1,
    };
    try {
      if (isEdit) {
        await api.put(`/tasks/${task.id}`, payload);
        await api.post("/activities", {
          taskId: task.id,
          userId: user.id,
          userName: user.name || user.email,
          action: "edited task",
          createdAt: new Date().toISOString(),
        });
      } else {
        const res = await api.post("/tasks", payload);
        await api.post("/activities", {
          taskId: res.data.id,
          userId: user.id,
          userName: user.name || user.email,
          action: "created task",
          createdAt: new Date().toISOString(),
        });
        // Notify assignees
        for (const email of assignees) {
          if (email !== user.email) {
            const usersRes = await api.get("/users");
            const assignedUser = usersRes.data.find((u) => u.email === email);
            if (assignedUser) {
              await api.post("/notifications", {
                userId: assignedUser.id,
                type: "assign",
                message: `You were assigned to task: ${data.title}`,
                taskId: res.data.id,
                read: false,
                createdAt: new Date().toISOString(),
              });
            }
          }
        }
      }
      reset();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-surface-container-lowest opacity-90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface-container border-2 border-primary w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(204,255,0,0.1)] max-h-[90vh] overflow-y-auto">
        <div className="bg-primary px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-on-primary font-headline font-black text-3xl uppercase tracking-tighter">
              {isEdit ? "Edit_Task" : "New_Task"}
            </h2>
            <p className="text-on-primary opacity-70 text-xs font-label uppercase tracking-widest mt-1">
              {isEdit ? "Edit_Mode" : "Create_Mode"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center border-2 border-on-primary hover:bg-yellow-200 hover:text-primary transition-all"
          >
            <span className="material-symbols-outlined text-black">close</span>
          </button>
        </div>

        <form
          className="p-8 space-y-6 bg-surface-container-low"
          onSubmit={handleSubmit(onHdSubmit)}
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
              Title *
            </label>
            <input
              {...register("title")}
              className="w-full bg-slate-200 text-slate-500 border-0 border-b-2 border-outline focus:border-primary focus:ring-0 font-headline font-bold px-3 py-3 text-xl uppercase transition-all"
              placeholder="TASK TITLE..."
            />
            {errors.title && (
              <p className="text-error text-[10px] font-label">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full bg-slate-200 text-black border-2 border-outline-variant focus:border-primary focus:ring-0 p-4 text-sm font-body resize-none transition-all"
              placeholder="Task description..."
              rows="3"
            />
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
              Labels
            </label>
            <div className="flex gap-2 flex-wrap">
              {LABELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleLabel(l)}
                  className={`h-7 w-14 rounded transition-all border-2 ${selectedLabels.includes(l) ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"} ${LABEL_COLORS[l]}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div className="space-y-3">
              <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
                Priority *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map((p) => (
                  <label key={p} className="cursor-pointer">
                    <input
                      {...register("priority")}
                      value={p}
                      className="peer hidden"
                      type="radio"
                    />
                    <div
                      className={`border-2 border-outline-variant p-2 text-center text-[10px] font-label uppercase tracking-widest transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary ${PRIORITY_COLORS[p]}`}
                    >
                      {p}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
                Status *
              </label>
              <select
                {...register("status")}
                className="w-full bg-surface-container border-2 border-outline-variant focus:border-primary focus:ring-0 p-3 text-xs font-label uppercase tracking-widest text-on-surface transition-all"
              >
                <option value="todo">TO DO</option>
                <option value="in_progress">IN PROGRESS</option>
                <option value="review">REVIEW</option>
                <option value="done">DONE</option>
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
                Deadline
              </label>
              <input
                {...register("deadline")}
                className="w-full bg-slate-200 border-0 border-b-2 border-outline focus:border-primary focus:ring-0 text-black font-body py-3 px-3 text-sm transition-all"
                type="date"
              />
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-2">
            <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
              Assignees
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {assignees.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 py-1 text-xs text-on-surface"
                >
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-black text-[9px] font-black">
                    {a[0].toUpperCase()}
                  </div>
                  {a}
                  <button
                    type="button"
                    onClick={() => removeAssignee(a)}
                    className="ml-1 hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[12px]">
                      close
                    </span>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={assigneeInput}
                onChange={(e) => setAssigneeInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAssignee())
                }
                className="flex-1 bg-slate-200 border-0 border-b-2 border-outline focus:border-primary focus:ring-0 text-black font-body py-2 px-3 text-sm transition-all"
                placeholder="email or name, press Enter..."
              />
              <button
                type="button"
                onClick={addAssignee}
                className="px-3 bg-primary/20 text-primary hover:bg-primary hover:text-on-primary transition-all text-xs font-bold uppercase"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-primary font-label text-[10px] tracking-[0.2em] uppercase">
              Tags
            </label>
            <input
              {...register("tags")}
              className="w-full bg-slate-200 border-0 border-b-2 border-outline focus:border-primary focus:ring-0 text-black font-body py-3 px-3 text-sm transition-all"
              placeholder="design, frontend, urgent..."
            />
          </div>

          <div className="pt-4 flex justify-end border-t border-outline-variant">
            <button
              type="submit"
              className="bg-primary text-on-primary font-headline font-black px-12 py-4 text-lg uppercase tracking-tighter hover:brightness-110 transition-all"
            >
              {isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
