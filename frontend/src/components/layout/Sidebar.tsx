import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Achievements", path: "/achievements", icon: Trophy },
  { name: "Gallery", path: "/gallery", icon: ImageIcon },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col bg-white border-r border-slate-200 text-slate-700 shrink-0">
      {/* Brand / Logo Section */}
      <div className="px-5 py-6 border-b border-slate-100 flex justify-center items-center">
        {/* logo.png */}
        <img
          src="/logo.png"
          alt="Shah Satnamji College Logo"
          className="h-12 w-auto object-contain max-w-full"
        />
      </div>

      {/* Nav Menu */}
      <div className="flex-1 px-4 py-6">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-4">
          Menu
        </p>
        <nav className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#eefcf4] text-emerald-700 border border-emerald-500/20 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Partner Branding */}
      <div className="p-4 border-t border-slate-100 flex flex-col items-center justify-center gap-2">
        <img
          src="/od.png"
          alt="Okie Dokie Logo"
          className="h-7 w-auto object-contain"
        />
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
            Crafted with <span className="text-rose-500">❤️</span> by <span className="font-extrabold text-slate-700">Okie Dokie</span>
          </p>
          <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
            Haryana's No. 1 Campus Automation Partner
          </p>
        </div>
      </div>
    </aside>
  );
}