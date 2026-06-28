import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileSpreadsheet,
  Settings,
  Trophy,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Students", path: "/students", icon: Users },
  { name: "Add Student", path: "/students/add", icon: UserPlus },
  { name: "Excel Import", path: "/excel-import", icon: FileSpreadsheet },
  { name: "Change Credentials", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col bg-slate-900 text-white shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Sports Utility</h1>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <Icon size={16} className="shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700/60">
        <p className="text-[11px] text-slate-500 text-center">
          &copy; {new Date().getFullYear()} Sports Utility
        </p>
      </div>
    </aside>
  );
}