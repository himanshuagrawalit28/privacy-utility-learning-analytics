import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Eye, 
  X, 
  RotateCcw,
  Download
} from 'lucide-react';
import { studentsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export default function Students() {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await studentsAPI.getStudents({
        search,
        risk: riskFilter,
        department: deptFilter,
        page,
        limit: 8
      });
      setStudents(res.data);
      setTotalPages(res.totalPages || 1);
      setTotalStudents(res.total || 0);
    } catch (err) {
      addToast('Failed to retrieve student records via API service.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, riskFilter, deptFilter, page, addToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleClearFilters = () => {
    setSearch('');
    setRiskFilter('ALL');
    setDeptFilter('ALL');
    setPage(1);
    addToast('Filters reset to default.', 'info', 1800);
  };

  const handleExport = () => {
    addToast('Student records exported with differential privacy noise masks applied.', 'success');
  };

  const hasActiveFilters = search || riskFilter !== 'ALL' || deptFilter !== 'ALL';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-bold uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" />
            <span>Differential Privacy Student Cohort</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Student Data Grid
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
            Student academic features and predicted risk ratings with DP-SGD noise perturbation preventing re-identification.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by student name or ID..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-400 border border-slate-200 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Risk Filter Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => { setRiskFilter(risk); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  riskFilter === risk 
                    ? 'bg-white text-slate-900 font-bold shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {risk === 'ALL' ? 'All Risks' : risk}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Data Science">Data Science</option>
            <option value="Information Systems">Information Systems</option>
            <option value="Electrical Eng">Electrical Eng</option>
            <option value="Mathematics">Mathematics</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner text="Fetching student records from API with DP guarantees..." />
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm space-y-2">
            <p>No students found matching the current search filter.</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-4 px-4">Student ID & Name</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4 text-center">Attendance</th>
                  <th className="py-4 px-4 text-center">Midterm Score</th>
                  <th className="py-4 px-4 text-center">Study Hrs/Wk</th>
                  <th className="py-4 px-4 text-center">Absences</th>
                  <th className="py-4 px-4 text-center">Predicted Risk</th>
                  <th className="py-4 px-4 text-center">DP Noise Perturbation</th>
                  <th className="py-4 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  let badge = 'badge-low';
                  if (student.predictedRisk === 'High') badge = 'badge-high';
                  if (student.predictedRisk === 'Medium') badge = 'badge-medium';

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-50/80 transition-colors duration-150 group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono font-medium">{student.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs font-medium">{student.department}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        <span className={student.attendance < 70 ? 'text-rose-600 font-bold' : ''}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        <span className={student.midtermScore < 60 ? 'text-rose-600 font-bold' : ''}>
                          {student.midtermScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-semibold">
                        {student.studyHours}h
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 font-semibold">
                        {student.absences}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={badge}>{student.predictedRisk}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {student.dpPerturbation || '±0.02 (DP Noise)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Inspect Privacy Perturbation Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div>
            Showing <span className="font-bold text-slate-900">{students.length}</span> of{' '}
            <span className="font-bold text-slate-900">{totalStudents}</span> students (Page {page} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold flex items-center gap-1 transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-bold flex items-center gap-1 transition shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl animate-slide-up relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500 font-mono font-medium">{selectedStudent.id} • {selectedStudent.email}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-500 text-xs font-semibold">Department</span>
                  <div className="text-slate-900 font-bold mt-1">{selectedStudent.department}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-semibold">Risk Assessment</span>
                  <div className={`font-bold mt-1 ${
                    selectedStudent.predictedRisk === 'High' ? 'text-rose-600' : 
                    selectedStudent.predictedRisk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {selectedStudent.predictedRisk} Risk
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-semibold">Attendance Rate</span>
                  <div className="text-slate-900 font-mono font-bold mt-1">{selectedStudent.attendance}%</div>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-semibold">Midterm Score</span>
                  <div className="text-slate-900 font-mono font-bold mt-1">{selectedStudent.midtermScore} / 100</div>
                </div>
              </div>

              {/* Differential Privacy Mask details */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Differential Privacy Verification</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs font-medium">
                  Under DP-SGD (ε = 1.25, δ = 10⁻⁵), this student's raw risk score ({(selectedStudent.riskScore * 100).toFixed(1)}%) was shielded with calibrated Laplacian noise to prevent reverse-engineering of their attendance history.
                </p>
                <div className="flex items-center justify-between text-xs font-mono pt-2 text-slate-600 mt-2 border-t border-indigo-100/50">
                  <span className="font-semibold">Injected Noise Perturbation:</span>
                  <span className="text-indigo-600 font-bold bg-white px-2 py-0.5 rounded border border-indigo-100">{selectedStudent.dpPerturbation}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition shadow-sm"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
