import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Sports Achievement Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage students, achievements & records
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* User badge */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={12} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-700">
              {user?.username ?? "Admin"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
          >
            <LogOut size={13} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}