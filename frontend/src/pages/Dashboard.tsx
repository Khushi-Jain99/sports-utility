import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboardApi";
import {
  Users,
  Trophy,
  Medal,
  FileCheck,
  TrendingUp,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

const statCards = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: Users,
    color: "blue",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    numColor: "text-blue-700",
    border: "border-blue-100",
    bar: "bg-blue-500",
  },
  {
    key: "totalAchievements",
    label: "Achievements",
    icon: Trophy,
    color: "emerald",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    numColor: "text-emerald-700",
    border: "border-emerald-100",
    bar: "bg-emerald-500",
  },
  {
    key: "sportsCovered",
    label: "Sports Covered",
    icon: Medal,
    color: "purple",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
    numColor: "text-purple-700",
    border: "border-purple-100",
    bar: "bg-purple-500",
  },
  {
    key: "certificatesUploaded",
    label: "Certificates",
    icon: FileCheck,
    color: "amber",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    numColor: "text-amber-700",
    border: "border-amber-100",
    bar: "bg-amber-500",
  },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getDashboard();
      setDashboard(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-white" />
          <div className="absolute -bottom-16 -left-8 w-72 h-72 rounded-full border border-blue-300" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-blue-300" />
              <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Overview</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Sports Utility Dashboard
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-md">
              Manage students, track achievements, and maintain certificates — everything in one place.
            </p>
          </div>
          <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white bg-opacity-10 border border-white border-opacity-20 items-center justify-center">
            <Trophy size={32} className="text-blue-300" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = dashboard?.[card.key] ?? 0;
          return (
            <div
              key={card.key}
              className={`bg-white rounded-xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.bg} ${card.iconColor} p-2.5 rounded-lg`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {card.label}
              </p>
              <p className={`text-4xl font-extrabold ${card.numColor} leading-none`}>
                {value}
              </p>
              <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${card.bar} rounded-full`} style={{ width: `${Math.min(value * 10, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Students */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Recent Students</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest additions to the system</p>
          </div>
          <Users size={16} className="text-slate-300" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Admission</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dashboard?.recentStudents?.map((student: any) => (
                <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3">
                    {student.photo ? (
                      <img
                        src={`${BASE_URL}${student.photo}`}
                        className="h-9 w-9 rounded-full object-cover border-2 border-slate-100"
                        alt={student.name}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-400">
                          {student.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-slate-500">{student.admissionNo}</td>
                  <td className="px-6 py-3 font-medium text-slate-800">{student.name}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {student.class}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Achievements */}
      {dashboard?.recentAchievements?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Achievements</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest recorded achievements</p>
            </div>
            <Trophy size={16} className="text-slate-300" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Game</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Competition</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Result</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dashboard.recentAchievements.map((a: any) => (
                  <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {a.student?.photo ? (
                          <img
                            src={`${BASE_URL}${a.student.photo}`}
                            className="h-7 w-7 rounded-full object-cover border border-slate-100"
                            alt={a.student?.name}
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400">
                              {a.student?.name?.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-slate-800 text-xs">{a.student?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{a.game}</td>
                    <td className="px-6 py-3 text-slate-600">{a.competition}</td>
                    <td className="px-6 py-3">
                      {a.results ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {a.results}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs">
                      {a.date ? new Date(a.date).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}