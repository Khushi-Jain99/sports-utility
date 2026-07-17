import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAchievements, deleteAchievement } from "../api/achievementApi";
import { uploadExcel } from "../api/excelApi";
import { addNotification } from "../utils/notificationHelper";
import {
  Search,
  Trophy,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  FileDown,
  Printer,
  Upload,
  RefreshCw,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Students() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<any[]>([]);

  // Filter Dropdowns Lists
  const [sports, setSports] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);

  // Filter States
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sportFilter, setSportFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<'game' | 'venue' | 'result' | null>(null);

  // Sync search state with searchParams
  useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearch(q);
  }, [searchParams]);

  const handleLocalSearchChange = (val: string) => {
    setSearch(val);
    if (val) {
      setSearchParams(
        (prev) => {
          prev.set("search", val);
          return prev;
        },
        { replace: true }
      );
    } else {
      setSearchParams(
        (prev) => {
          prev.delete("search");
          return prev;
        },
        { replace: true }
      );
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAchievements({ limit: 1000 });
      const list = res.data.data.achievements || [];
      setAchievements(list);
      setFilteredAchievements(list);

      // Extract unique list for filter dropdowns dynamically
      const uniqueSports = new Set<string>();
      const uniqueVenues = new Set<string>();
      const uniqueResults = new Set<string>();

      list.forEach((ach: any) => {
        if (ach.game) uniqueSports.add(ach.game.trim());
        if (ach.venue) uniqueVenues.add(ach.venue.trim());
        if (ach.results) uniqueResults.add(ach.results.trim());
      });

      setSports(Array.from(uniqueSports).sort((a, b) => a.localeCompare(b)));
      setVenues(Array.from(uniqueVenues).sort((a, b) => a.localeCompare(b)));
      setResults(Array.from(uniqueResults).sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load achievements records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter calculation logic
  useEffect(() => {
    let result = achievements;

    // Global text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (ach) =>
          ach.student?.name?.toLowerCase().includes(q) ||
          ach.student?.admissionNo?.toLowerCase().includes(q) ||
          ach.game?.toLowerCase().includes(q) ||
          ach.competition?.toLowerCase().includes(q)
      );
    }

    // Table Header select dropdown filters
    if (sportFilter) {
      result = result.filter((ach) => ach.game === sportFilter);
    }
    if (venueFilter) {
      result = result.filter((ach) => ach.venue === venueFilter);
    }
    if (resultFilter) {
      result = result.filter((ach) => ach.results === resultFilter);
    }

    setFilteredAchievements(result);
    setCurrentPage(1); // Reset page to 1 on filter
  }, [search, sportFilter, venueFilter, resultFilter, achievements]);

  const handleResetFilters = () => {
    setSearch("");
    setSearchParams({}, { replace: true });
    setSportFilter("");
    setVenueFilter("");
    setResultFilter("");
  };

  // Pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAchievements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);

  // File Exporters
  const handleExportExcel = () => {
    if (filteredAchievements.length === 0) {
      toast.error("No records to export");
      return;
    }

    // Build standard CSV
    const headers = [
      "Sr. No.",
      "Name",
      "Class",
      "Admission No",
      "Date of Birth",
      "Game / Sport",
      "Competition",
      "Venue",
      "Date",
      "Result / Position",
      "Contact No",
    ];

    const rows = filteredAchievements.map((ach, idx) => [
      idx + 1,
      ach.student?.name || "—",
      ach.student?.class || "—",
      ach.student?.admissionNo || "—",
      ach.student?.dob ? new Date(ach.student.dob).toLocaleDateString("en-GB") : "—",
      ach.game || "—",
      ach.competition || "—",
      ach.venue || "—",
      ach.date ? new Date(ach.date).toLocaleDateString("en-GB") : "—",
      ach.results || "—",
      ach.student?.phone || "—",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Shah_Satnamji_College_Sports_Achievements_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV file downloaded");
  };

  const handlePrint = () => {
    window.print();
  };



  // Direct Excel Upload Handler
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await uploadExcel(file);
      toast.success("Excel imported successfully!");
      addNotification(
        "Excel Imported",
        `Successfully processed and imported sports achievement records from spreadsheet.`,
        "success"
      );
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Excel import failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete Achievement record row
  const handleDeleteRow = async (ach: any) => {
    if (!window.confirm(`Are you sure you want to delete this achievement for ${ach.student?.name}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteAchievement(ach._id);
      // If student has no other achievements, we can delete the student record too, or just let them manage it
      toast.success("Record deleted successfully");
      addNotification(
        "Record Deleted",
        `Deleted achievement record in ${ach.game} for ${ach.student?.name || "Athlete"} (${ach.student?.admissionNo || "N/A"}).`,
        "warning"
      );
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Delete operation failed");
      setLoading(false);
    }
  };



  if (loading && achievements.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Querying achievements repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:bg-white print:p-0">
      {/* Title Header Card (Hidden on Print) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
              Achievements Records
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Shah Satnamji College Sports Repository &mdash; {filteredAchievements.length} records found
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer"
          title="Reload Data"
        >
          <RefreshCw size={16} className={loading ? "animate-spin text-emerald-600" : ""} />
        </button>
      </div>

      {/* Filter & Search Row (Hidden on Print) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 print:hidden bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="relative flex items-center w-full md:w-80">
          <Search size={14} className="text-slate-400 absolute left-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleLocalSearchChange(e.target.value)}
            placeholder="Search by name, admission no, game, competition..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition"
          />
        </div>

        {(search || sportFilter || venueFilter || resultFilter) && (
          <button
            onClick={handleResetFilters}
            className="w-full md:w-auto text-xs font-bold text-red-650 hover:text-red-750 bg-red-50 hover:bg-red-100 border border-red-200/50 px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>



      {/* Action Buttons Row (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4.5 print:hidden">
        {/* Left Side Download & Backup */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet size={14} />
            Export Excel
          </button>

          {/* Export PDF */}
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <FileDown size={14} />
            Export PDF
          </button>

          {/* Print List */}
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Printer size={14} />
            Print List
          </button>


        </div>

        {/* Right Side Create & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Hidden File Input for Excel Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelImport}
            accept=".xlsx,.xls"
            className="hidden"
          />

          {/* Import Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Upload size={14} />
            Import Excel
          </button>

          {/* Add Record */}
          <button
            onClick={() => navigate("/students/add")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            Add Record
          </button>

        </div>
      </div>

      {/* Main Records Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs print:border-0 print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3.5 text-center w-14">Sr. No.</th>
                <th className="px-4 py-3.5 w-14">Photo</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-4 py-3.5">Class</th>
                <th className="px-4 py-3.5">Admission No.</th>
                <th className="px-4 py-3.5">Date of Birth</th>
                <th className="px-4 py-3.5 relative">
                  <div
                    className="flex items-center gap-1.5 cursor-pointer select-none"
                    onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'game' ? null : 'game')}
                  >
                    <span className={sportFilter ? 'text-emerald-700 font-extrabold' : ''}>GAME</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${sportFilter ? 'text-emerald-700 font-extrabold' : 'text-slate-400'} ${activeHeaderDropdown === 'game' ? 'rotate-180' : ''}`} />
                  </div>

                  {activeHeaderDropdown === 'game' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveHeaderDropdown(null)} />
                      <div className="absolute left-4 mt-2.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-left font-semibold text-slate-700 normal-case animate-in fade-in slide-in-from-top-2 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setSportFilter("");
                            setActiveHeaderDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-xs transition ${!sportFilter ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-slate-50'}`}
                        >
                          All Games
                        </button>
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {sports.map((sport) => (
                            <button
                              key={sport}
                              type="button"
                              onClick={() => {
                                setSportFilter(sport);
                                setActiveHeaderDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-1.5 text-xs transition truncate ${sportFilter === sport ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-slate-50'}`}
                            >
                              {sport}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </th>
                <th className="px-5 py-3.5">Competition Name</th>
                <th className="px-4 py-3.5 relative">
                  <div
                    className="flex items-center gap-1.5 cursor-pointer select-none"
                    onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'venue' ? null : 'venue')}
                  >
                    <span className={venueFilter ? 'text-emerald-700 font-extrabold' : ''}>VENUE</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${venueFilter ? 'text-emerald-700 font-extrabold' : 'text-slate-400'} ${activeHeaderDropdown === 'venue' ? 'rotate-180' : ''}`} />
                  </div>

                  {activeHeaderDropdown === 'venue' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveHeaderDropdown(null)} />
                      <div className="absolute left-4 mt-2.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-left font-semibold text-slate-700 normal-case animate-in fade-in slide-in-from-top-2 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setVenueFilter("");
                            setActiveHeaderDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-xs transition ${!venueFilter ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-slate-50'}`}
                        >
                          All Venues
                        </button>
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {venues.map((vn) => (
                            <button
                              key={vn}
                              type="button"
                              onClick={() => {
                                setVenueFilter(vn);
                                setActiveHeaderDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-1.5 text-xs transition truncate ${venueFilter === vn ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-slate-50'}`}
                            >
                              {vn}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 relative">
                  <div
                    className="flex items-center justify-center gap-1.5 cursor-pointer select-none"
                    onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'result' ? null : 'result')}
                  >
                    <span className={resultFilter ? 'text-emerald-700 font-extrabold' : ''}>RESULT</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${resultFilter ? 'text-emerald-700 font-extrabold' : 'text-slate-400'} ${activeHeaderDropdown === 'result' ? 'rotate-180' : ''}`} />
                  </div>

                  {activeHeaderDropdown === 'result' && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setActiveHeaderDropdown(null)} />
                      <div className="absolute right-4 mt-2.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-left font-semibold text-slate-700 normal-case animate-in fade-in slide-in-from-top-2 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setResultFilter("");
                            setActiveHeaderDropdown(null);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-xs transition ${!resultFilter ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-slate-50'}`}
                        >
                          All Results
                        </button>
                        <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                          {results.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setResultFilter(r);
                                setActiveHeaderDropdown(null);
                              }}
                              className={`w-full text-left px-4 py-1.5 text-xs transition truncate ${resultFilter === r ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'hover:bg-slate-50'}`}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </th>
                <th className="px-4 py-3.5">Contact No.</th>
                <th className="px-4 py-3.5 text-center">Certificate</th>
                <th className="px-4 py-3.5 text-center w-28 print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center text-slate-400 font-semibold">
                    No achievements records matching filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((ach, idx) => {
                  const hasPhoto = !!ach.student?.photo;
                  const photoUrl = ach.student?.photo;

                  return (
                    <tr key={ach._id} className="hover:bg-slate-50/40 transition">
                      <td className="px-4 py-3 text-center font-mono text-slate-400">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        {hasPhoto ? (
                          <img
                            src={photoUrl}
                            alt={ach.student?.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-100 shadow-xs"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-emerald-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-emerald-600">
                            {ach.student?.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-800 font-extrabold whitespace-nowrap">
                        {ach.student?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{ach.student?.class}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-450">
                        {ach.student?.admissionNo}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {ach.student?.dob
                          ? new Date(ach.student.dob).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-850 font-bold whitespace-nowrap">
                        {ach.game}
                      </td>
                      <td className="px-5 py-3 leading-snug max-w-xs truncate-2-lines">
                        {ach.competition}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{ach.venue || "—"}</td>
                      <td className="px-4 py-3 font-mono whitespace-nowrap">
                        {ach.date ? new Date(ach.date).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eefcf4] text-emerald-700 border border-emerald-500/10">
                          {ach.results || "Participation"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono whitespace-nowrap">
                        {ach.student?.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ach.certificate ? (
                          <a
                            href={ach.certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 items-center justify-center text-red-500 transition cursor-pointer"
                            title="View Certificate"
                          >
                            <FileText size={14} />
                          </a>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Navigate to Profile */}
                          <button
                            onClick={() => navigate(`/students/${ach.student?._id}`)}
                            title="View Student"
                            className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 transition cursor-pointer"
                          >
                            <Eye size={12} />
                          </button>
                          {/* Edit Student */}
                          <button
                            onClick={() => navigate(`/students/edit/${ach.student?._id}`)}
                            title="Edit Record"
                            className="w-7 h-7 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg flex items-center justify-center text-blue-700 transition cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          {/* Delete Achievement Row */}
                          <button
                            onClick={() => handleDeleteRow(ach)}
                            title="Delete Record"
                            className="w-7 h-7 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center text-red-650 transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Section (Hidden on Print) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4.5 bg-slate-50/20 print:hidden">
            <span className="text-xs text-slate-450 font-semibold">
              Showing page <span className="font-extrabold text-slate-700">{currentPage}</span> of{" "}
              <span className="font-extrabold text-slate-700">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-450 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-450 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}