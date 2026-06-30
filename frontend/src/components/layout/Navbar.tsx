import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { Bell, Search, User, LogOut, Settings as SettingsIcon, Check, Info, AlertTriangle, Trash2, CheckSquare } from "lucide-react";
import { getStudents } from "../../api/studentApi";
import { getNotifications, markAllAsRead, clearAllNotifications, markAsRead, type AppNotification } from "../../utils/notificationHelper";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recordsCount, setRecordsCount] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const loadNotifications = () => {
      setNotifications(getNotifications());
    };

    loadNotifications();

    window.addEventListener("app_notifications_updated", loadNotifications);
    return () => {
      window.removeEventListener("app_notifications_updated", loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Sync search input if URL search parameter changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchVal(params.get("search") || "");
  }, [location.search]);

  // Fetch count of students for the subtitle dynamically if we are on achievements page
  useEffect(() => {
    if (location.pathname.startsWith("/achievements") || location.pathname.startsWith("/students")) {
      getStudents({ limit: 1 })
        .then((res) => {
          setRecordsCount(res.data.data.totalStudents);
        })
        .catch((err) => console.error(err));
    }
  }, [location.pathname]);

  // Page titles and subtitles mapping
  const getHeaderDetails = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) {
      return {
        title: "Dashboard",
        subtitle: "Shah Satnamji College Sports Portal",
      };
    } else if (path.startsWith("/achievements") || path.startsWith("/students")) {
      if (path.includes("/add")) {
        return {
          title: "Add Student Record",
          subtitle: "Create a new sports achievement profile",
        };
      }
      if (path.includes("/edit")) {
        return {
          title: "Edit Student Record",
          subtitle: "Update sports achievement details",
        };
      }
      return {
        title: "Achievements Records",
        subtitle: `Shah Satnamji College Sports Repository — ${recordsCount !== null ? recordsCount : "3"} records`,
      };
    } else if (path.startsWith("/gallery")) {
      return {
        title: "Achievement Gallery",
        subtitle: `Shah Satnamji College Sports Repository — ${recordsCount !== null ? recordsCount : "3"} champions on display`,
      };
    } else if (path.startsWith("/analytics")) {
      return {
        title: "Analytics Dashboard",
        subtitle: "Shah Satnamji College Sports Portal",
      };
    } else if (path.startsWith("/settings")) {
      return {
        title: "Settings",
        subtitle: "Manage admin portal credentials",
      };
    } else if (path.startsWith("/excel-import")) {
      return {
        title: "Excel Import",
        subtitle: "Bulk import student and achievements",
      };
    }
    return {
      title: "Sports Portal",
      subtitle: "Shah Satnamji College Sports Administration",
    };
  };

  const { title, subtitle } = getHeaderDetails();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 relative z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Left Page Title Info */}
        <div className="min-w-0 flex-1 sm:flex-initial">
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Center Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate(`/students?search=${encodeURIComponent(searchVal.trim())}`);
          }}
          className="hidden md:flex items-center flex-1 max-w-md relative"
        >
          <button type="submit" className="absolute left-4.5 focus:outline-none cursor-pointer flex items-center justify-center">
            <Search size={16} className="text-slate-400 hover:text-emerald-650 transition" />
          </button>
          <input
            type="text"
            placeholder="Search players, games..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/60 transition"
          />
        </form>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-4.5">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              className="relative w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center border border-slate-200 transition cursor-pointer"
            >
              <Bell size={18} className="text-slate-500" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse flex items-center justify-center text-[7px] text-white font-bold" />
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 bg-slate-50/65 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-800">Notifications</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {unreadCount} unread message{unreadCount !== 1 && "s"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <CheckSquare size={12} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Dropdown List */}
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-400">All caught up!</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">No new notifications.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        let IconComponent = Info;
                        let iconColor = "text-blue-500 bg-blue-50";

                        if (notif.type === "success") {
                          IconComponent = Check;
                          iconColor = "text-emerald-500 bg-emerald-50";
                        } else if (notif.type === "warning") {
                          IconComponent = AlertTriangle;
                          iconColor = "text-amber-500 bg-amber-50";
                        } else if (notif.type === "error") {
                          IconComponent = AlertTriangle;
                          iconColor = "text-red-500 bg-red-50";
                        }

                        return (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`px-4 py-3 flex gap-3 transition cursor-pointer ${
                              notif.read ? "opacity-75 hover:bg-slate-50/50" : "bg-emerald-50/10 hover:bg-emerald-50/20"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconColor}`}>
                              <IconComponent size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs truncate ${notif.read ? "font-semibold text-slate-655" : "font-extrabold text-slate-800"}`}>
                                  {notif.title}
                                </p>
                                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                  {formatTimeAgo(notif.time)}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/40 flex justify-end">
                      <button
                        onClick={() => {
                          clearAllNotifications();
                          setNotificationsOpen(false);
                        }}
                        className="text-[10px] text-slate-400 hover:text-red-650 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full pl-3 pr-2.5 py-1.5 transition text-left cursor-pointer"
            >
              <div className="hidden sm:block">
                <p className="text-xs font-extrabold text-slate-700 leading-tight">
                  Sports Teacher
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">
                  Admin Panel
                </p>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 bg-emerald-50 flex items-center justify-center shrink-0">
                <User size={14} className="text-emerald-600" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-1.5 border-b border-slate-50 mb-1.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                      {user?.username ?? "Admin"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition"
                  >
                    <SettingsIcon size={14} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50/50 transition border-t border-slate-50 mt-1.5 pt-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}