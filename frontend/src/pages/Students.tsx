import { useEffect, useState } from "react";
import { getStudents } from "../api/studentApi";
import SearchBar from "../components/students/SearchBar";
import ClassFilter from "../components/students/ClassFilter";
import StudentsTable from "../components/students/StudentsTable";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [studentClass, setStudentClass] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getStudents({
        page,
        limit: 10,
        search,
        class: studentClass,
      });
      const data = response.data.data;
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search, studentClass]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Students</h1>
          <p className="text-sm text-slate-400 mt-0.5">View and manage all registered students</p>
        </div>
        <button
          onClick={() => navigate("/students/add")}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <UserPlus size={15} />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
          <ClassFilter
            value={studentClass}
            onChange={(value) => {
              setStudentClass(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Users size={40} strokeWidth={1.5} />
            <p className="text-sm font-medium">No students found</p>
            <button
              onClick={() => navigate("/students/add")}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Add the first student
            </button>
          </div>
        ) : (
          <StudentsTable students={students} refreshStudents={fetchStudents} />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition"
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <span className="text-sm text-slate-500 px-3">
            Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}