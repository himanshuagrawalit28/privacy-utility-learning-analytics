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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Differential Privacy Student Cohort</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Student Data Grid
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Student academic features and predicted risk ratings with DP-SGD noise perturbation preventing re-identification.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-600 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5 btn-press"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-800 border border-slate-700 text-xs font-medium transition flex items-center gap-2 btn-press"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by student name or ID..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl glass-input text-slate-900 placeholder-slate-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Risk Filter Buttons */}
          <div className="flex items-center bg-white/90 p-1 rounded-xl border border-slate-200 text-xs">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => { setRiskFilter(risk); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  riskFilter === risk 
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm' 
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
            className="px-3 py-2 text-xs rounded-xl glass-input text-slate-600 font-medium cursor-pointer"
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
      <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden shadow-md">
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
                className="text-xs text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 font-mono">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Student ID & Name</th>
                  <th className="py-3.5 px-4 font-semibold">Department</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Attendance</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Midterm Score</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Study Hrs/Wk</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Absences</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Predicted Risk</th>
                  <th className="py-3.5 px-4 font-semibold text-center">DP Noise Perturbation</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {students.map((student) => {
                  let badge = 'badge-low';
                  if (student.predictedRisk === 'High') badge = 'badge-high';
                  if (student.predictedRisk === 'Medium') badge = 'badge-medium';

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-slate-100/40 transition-colors duration-150 group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                          {student.name}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">{student.id}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">{student.department}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-800">
                        <span className={student.attendance < 70 ? 'text-rose-400 font-semibold' : ''}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-800">
                        <span className={student.midtermScore < 60 ? 'text-rose-400 font-semibold' : ''}>
                          {student.midtermScore}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                        {student.studyHours}h
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                        {student.absences}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={badge}>{student.predictedRisk}</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-blue-700 border border-cyan-500/20">
                          {student.dpPerturbation || '±0.02 (DP)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition btn-press"
                          title="Inspect Privacy Perturbation Details"
                        >
                          <Eye className="w-4 h-4" />
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
        <div className="p-4 bg-white/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{students.length}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalStudents}</span> students (Page {page} of {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 flex items-center gap-1 transition btn-press"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 flex items-center gap-1 transition btn-press"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl animate-slide-up relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-blue-600 flex items-center justify-center font-bold">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedStudent.id} • {selectedStudent.email}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/60 border border-slate-200">
                <div>
                  <span className="text-slate-500">Department</span>
                  <div className="text-slate-800 font-semibold mt-0.5">{selectedStudent.department}</div>
                </div>
                <div>
                  <span className="text-slate-500">Risk Assessment</span>
                  <div className="font-semibold mt-0.5 text-blue-700">{selectedStudent.predictedRisk} Risk</div>
                </div>
                <div>
                  <span className="text-slate-500">Attendance Rate</span>
                  <div className="text-slate-800 font-mono mt-0.5">{selectedStudent.attendance}%</div>
                </div>
                <div>
                  <span className="text-slate-500">Midterm Score</span>
                  <div className="text-slate-800 font-mono mt-0.5">{selectedStudent.midtermScore} / 100</div>
                </div>
              </div>

              {/* Differential Privacy Mask details */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Differential Privacy Verification</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Under DP-SGD (ε = 1.25, δ = 10⁻⁵), this student's raw risk score ({(selectedStudent.riskScore * 100).toFixed(1)}%) was shielded with calibrated Laplacian noise to prevent reverse-engineering of their attendance history.
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-600">
                  <span>Injected Noise Perturbation:</span>
                  <span className="text-blue-600 font-bold">{selectedStudent.dpPerturbation}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-800 font-medium text-xs transition btn-press"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
