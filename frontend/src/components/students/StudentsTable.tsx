import { useNavigate } from "react-router-dom";
import { Eye, Pencil,  } from "lucide-react";

const BASE_URL = "http://localhost:5000";

interface Props {
  students: any[];
  refreshStudents: () => void;
}

export default function StudentsTable({ students,  }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Student</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Admission No.</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Class</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</th>
            <th className="px-5 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {students.map((student) => (
            <tr key={student._id} className="hover:bg-slate-50/60 transition-colors group">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      className="h-9 w-9 rounded-full object-cover border-2 border-slate-100 shrink-0"
                      alt={student.name}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-blue-50 border-2 border-slate-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-500">
                        {student.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="font-semibold text-slate-800">{student.name}</span>
                </div>
              </td>
              <td className="px-5 py-3 font-mono text-xs text-slate-500">{student.admissionNo}</td>
              <td className="px-5 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {student.class}
                </span>
              </td>
              <td className="px-5 py-3 text-slate-500">{student.phone || "—"}</td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => navigate(`/students/${student._id}`)}
                    title="View"
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    <Eye size={12} />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/students/edit/${student._id}`)}
                    title="Edit"
                    className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}