export interface AppNotification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const STORAGE_KEY = "app_notifications";

const getRawNotifications = (): AppNotification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse notifications", e);
    return [];
  }
};

const saveNotifications = (notifications: AppNotification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    // Trigger custom event to notify listening components
    window.dispatchEvent(new Event("app_notifications_updated"));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
};

export const getNotifications = (): AppNotification[] => {
  const notifs = getRawNotifications();
  if (notifs.length === 0) {
    // Return a default welcome notification if the list is empty
    const welcomeNotif: AppNotification = {
      id: "welcome",
      type: "success",
      title: "Welcome to Sports ERP",
      message: "Notification center is now active. Manage achievements and athletes profile easily.",
      time: new Date().toISOString(),
      read: false,
    };
    return [welcomeNotif];
  }
  return notifs;
};

export const addNotification = (
  title: string,
  message: string,
  type: AppNotification["type"] = "info"
) => {
  const list = getRawNotifications();
  const newNotif: AppNotification = {
    id: Math.random().toString(36).substring(2, 9),
    type,
    title,
    message,
    time: new Date().toISOString(),
    read: false,
  };
  list.unshift(newNotif);
  // Cap at 20 notifications
  saveNotifications(list.slice(0, 20));
};

export const markAsRead = (id: string) => {
  const list = getRawNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
};

export const markAllAsRead = () => {
  const list = getRawNotifications();
  const updated = list.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);
};

export const clearAllNotifications = () => {
  saveNotifications([]);
};
