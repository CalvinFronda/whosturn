import React, { useState, useEffect } from "react";
import type { Notification } from "../types/types";

const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!userId) return;

    const loadNotifications = () => {
      const stored = localStorage.getItem("notifications");
      if (stored) {
        const allNotifs = JSON.parse(stored);
        const userNotifs = allNotifs.filter((n: any) => n.userId === userId);
        setNotifications(userNotifs);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = (notifId: string) => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      const allNotifs = JSON.parse(stored);
      const updated = allNotifs.map((n: Notification) =>
        n.id === notifId ? { ...n, read: true } : n
      );
      localStorage.setItem("notifications", JSON.stringify(updated));
      setNotifications(
        notifications.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    }
  };

  return {
    notifications,
    markAsRead,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};

export default useNotifications;
