import React, { useState } from "react";
import api from "../mock/api";

const ROLES = ["admin", "member", "viewer"];

const InviteMember = ({ workspaceId, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const usersRes = await api.get("/users");
      const user = usersRes.data.find((u) => u.email === email);
      if (!user) { setError("User not found with this email"); return; }

      const existing = await api.get("/workspace_members", { params: { workspaceId, userId: user.id } });
      if (existing.data.length > 0) { setError("User already in workspace"); return; }

      await api.post("/workspace_members", { workspaceId, userId: user.id, role });
      await api.post("/notifications", {
        userId: user.id,
        type: "invite",
        message: `You were invited to workspace`,
        workspaceId,
        read: false,
        createdAt: new Date().toISOString(),
      });
      setSuccess(`${email} invited as ${role}`);
      setEmail("");
    } catch {
      setError("Failed to invite user");
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1C1B1B] border-2 border-[#CCFF00] w-full max-w-md shadow-[0_0_50px_rgba(204,255,0,0.1)]">
        <div className="bg-[#CCFF00] px-6 py-4 flex items-center justify-between">
          <h2 className="text-[#131313] font-black text-xl uppercase tracking-tighter font-['Space_Grotesk']">Invite_Member</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border-2 border-[#131313] hover:bg-[#131313] hover:text-[#CCFF00] transition-all">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <form onSubmit={handleInvite} className="p-6 space-y-4">
          <div>
            <label className="text-[#CCFF00] text-[10px] uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#131313] border-b-2 border-[#444] focus:border-[#CCFF00] text-[#E5E2E1] py-2 px-0 text-sm focus:ring-0 transition-all"
              placeholder="user@email.com"
            />
          </div>
          <div>
            <label className="text-[#CCFF00] text-[10px] uppercase tracking-widest block mb-2">Role</label>
            <div className="flex gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all ${role === r ? "border-[#CCFF00] bg-[#CCFF00] text-[#131313]" : "border-[#444] text-[#E5E2E1] hover:border-[#CCFF00]/50"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-[#CCFF00] text-xs">{success}</p>}
          <button type="submit" className="w-full bg-[#CCFF00] text-[#131313] font-black py-3 uppercase tracking-wider font-['Space_Grotesk'] hover:bg-[#ABD600] transition-colors">
            Send Invite
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteMember;
