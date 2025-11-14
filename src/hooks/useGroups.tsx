import React, { useState, useEffect } from "react";
import type { Group, Member, User } from "../types/types";

const addNotification = ({
  groupId,
  groupName,
  message,
  userId,
}: {
  groupId: string;
  groupName: string;
  message: string;
  userId: string;
}) => {
  const stored = localStorage.getItem("notifications");
  const notifications = stored ? JSON.parse(stored) : [];

  // Anti-spam: Check if similar notification exists in last 5 minutes
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  const recent = notifications.find(
    (n: any) =>
      n.groupId === groupId && n.timestamp > fiveMinAgo && n.message === message
  );

  if (!recent) {
    notifications.push({
      id: Date.now().toString(),
      groupId,
      groupName,
      message,
      timestamp: Date.now(),
      read: false,
      userId,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }
};

const useGroups = (userId: string | undefined) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (!userId) return;
    const stored = localStorage.getItem("groups");
    if (stored) {
      const allGroups = JSON.parse(stored);
      const userGroups = allGroups.filter(
        (g: Group) =>
          g.members.some((m) => m.id === userId) || g.createdBy === userId
      );
      setGroups(userGroups);
    }
  }, [userId]);

  const createGroup = (
    name: string,
    description: string,
    memberEmails: string[],
    user: User
  ) => {
    const members: Member[] = memberEmails.map((email, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: email.split("@")[0],
      email,
    }));

    members.unshift({ id: user.id, name: user.name, email: user.email });

    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      description,
      members,
      currentTurnIndex: 0,
      createdBy: user.id,
    };

    const stored = localStorage.getItem("groups");
    const allGroups = stored ? JSON.parse(stored) : [];
    allGroups.push(newGroup);
    localStorage.setItem("groups", JSON.stringify(allGroups));
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = (groupId: string) => {
    const stored = localStorage.getItem("groups");
    if (stored) {
      const allGroups = JSON.parse(stored);
      const filtered = allGroups.filter((g: Group) => g.id !== groupId);
      localStorage.setItem("groups", JSON.stringify(filtered));
      setGroups(groups.filter((g) => g.id !== groupId));
    }
  };

  const completeTurn = (groupId: string, userId: string) => {
    const stored = localStorage.getItem("groups");
    if (stored) {
      const allGroups: Group[] = JSON.parse(stored);
      const groupIdx = allGroups.findIndex((g) => g.id === groupId);

      if (groupIdx !== -1) {
        const group = allGroups[groupIdx];
        const currentMember = group.members[group.currentTurnIndex];

        if (currentMember.id === userId) {
          group.currentTurnIndex =
            (group.currentTurnIndex + 1) % group.members.length;
          allGroups[groupIdx] = group;
          localStorage.setItem("groups", JSON.stringify(allGroups));

          const updatedGroups = groups.map((g) =>
            g.id === groupId ? group : g
          );
          setGroups(updatedGroups);

          // Create notification for next person
          const nextMember = group.members[group.currentTurnIndex];
          addNotification({
            groupId,
            groupName: group.name,
            message: `It's your turn! ${currentMember.name} just completed their turn.`,
            userId: nextMember.id,
          });

          return true;
        }
      }
    }
    return false;
  };

  const nudgeMember = (groupId: string, fromUserId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      const currentMember = group.members[group.currentTurnIndex];
      const fromMember = group.members.find((m) => m.id === fromUserId);

      if (fromMember && currentMember.id !== fromUserId) {
        addNotification({
          groupId,
          groupName: group.name,
          message: `${fromMember.name} is reminding you it's your turn!`,
          userId: currentMember.id,
        });
        return true;
      }
    }
    return false;
  };

  return { groups, createGroup, deleteGroup, completeTurn, nudgeMember };
};

export default useGroups;
