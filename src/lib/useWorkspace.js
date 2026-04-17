import { useState, useEffect, useCallback } from "react";
import api from "../mock/api";

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const res = await api.get("/workspaces");
    setWorkspaces(res.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { workspaces, loading, refetch: fetch };
};

export const useBoards = (workspaceId) => {
  const [boards, setBoards] = useState([]);

  const fetch = useCallback(async () => {
    const params = workspaceId ? { workspaceId } : {};
    const res = await api.get("/boards", { params });
    setBoards(res.data);
  }, [workspaceId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { boards, refetch: fetch };
};

export const useLists = (boardId) => {
  const [lists, setLists] = useState([]);

  const fetch = useCallback(async () => {
    if (!boardId) return;
    const res = await api.get("/lists", { params: { boardId } });
    setLists(res.data.sort((a, b) => a.order - b.order));
  }, [boardId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { lists, refetch: fetch };
};

export const useMembers = (workspaceId) => {
  const [members, setMembers] = useState([]);

  const fetch = useCallback(async () => {
    if (!workspaceId) return;
    const [membersRes, usersRes] = await Promise.all([
      api.get("/workspace_members", { params: { workspaceId } }),
      api.get("/users"),
    ]);
    const enriched = membersRes.data.map((m) => ({
      ...m,
      user: usersRes.data.find((u) => u.id === m.userId),
    }));
    setMembers(enriched);
  }, [workspaceId]);

  useEffect(() => { fetch(); }, [fetch]);
  return { members, refetch: fetch };
};
