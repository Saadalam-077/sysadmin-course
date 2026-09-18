import React, { useState, useMemo } from 'react';

const AdminDashboard = ({ students, onNavigate, onLogout, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterSection, setFilterSection] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const labs = [
    { lab: 1, titleEn: "Introduction to Systems Administration" },
    { lab: 2, titleEn: "Linux Installation & Configuration" },
    { lab: 3, titleEn: "User & Group Administration" },
    { lab: 4, titleEn: "File System Management" },
    { lab: 5, titleEn: "Package Management" },
    { lab: 6, titleEn: "Service & Process Management" },
    { lab: 7, titleEn: "Network Configuration" },
    { lab: 8, titleEn: "Security & Firewall" },
    { lab: 9, titleEn: "Backup & Recovery" },
    { lab: 10, titleEn: "Monitoring & Troubleshooting" },
  ];
  const totalLabs = labs.length;

  const sections = useMemo(() => {
    if (!students || students.length === 0) return ['all'];
    const sectionSet = new Set(students.map(s => s.sectionNumber));
    return ['all', ...Array.from(sectionSet).sort()];
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];
    let result = [...students];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.studentName?.toLowerCase().includes(term) || 
        s.studentNumber?.toLowerCase().includes(term)
      );
    }
    if (filterSection !== 'all') {
      result = result.filter(s => s.sectionNumber === filterSection);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return (a.studentName || '').localeCompare(b.studentName || '');
        case 'id': return (a.studentNumber || '').localeCompare(b.studentNumber || '');
        case 'grade': return (b.totalScore || 0) - (a.totalScore || 0);
        case 'progress':
          const aP = a.progress ? Object.values(a.progress).filter(w => w.completed).length : 0;
          const bP = b.progress ? Object.values(b.progress).filter(w => w.completed).length : 0;
          return bP - aP;
        default: return 0;
      }
    });
    return result;
  }, [students, searchTerm, sortBy, filterSection]);

  const stats = useMemo(() => {
    if (!students || students.length === 0) {
      return { total: 0, avgScore: 0, avgProgress: 0, gradeDistribution: {} };
    }
    const totalScore = students.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    const totalProgress = students.reduce((sum, s) => {
      const completed = s.progress ? Object.values(s.progress).filter(w => w.completed).length : 0;
      return sum + (completed / totalLabs) * 100;
    }, 0);
    const gradeDistribution = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0, 'N/A': 0 };
    students.forEach(s => {
      const g = s.overallGrade || 'N/A';
      if (gradeDistribution.hasOwnProperty(g)) gradeDistribution[g]++;
    });
    return {
      total: students.length,
      avgScore: students.length > 0 ? Math.round(totalScore / students.length) : 0,
      avgProgress: students.length > 0 ? Math.round(totalProgress / students.length) : 0,
      gradeDistribution
    };
  }, [students]);

  const getGradeColor = (g) => {
    if (g === 'A+' || g === 'A') return 'text-emerald-400';
    if (g === 'B+' || g === 'B') return 'text-cyan-400';
    if (g === 'C+' || g === 'C') return 'text-yellow-400';
    if (g === 'D+' || g === 'D') return 'text-orange-400';
    if (g === 'F') return 'text-red-400';
    return 'text-slate-400';
  };

  const getGradeBg = (g) => {
    if (g === 'A+' || g === 'A') return 'bg-emerald-500/20 border-emerald-500/50';
    if (g === 'B+' || g === 'B') return 'bg-cyan-500/20 border-cyan-500/50';
    if (g === 'C+' || g === 'C') return 'bg-yellow-500/20 border-yellow-500/50';
    if (g === 'D+' || g === 'D') return 'bg-orange-500/20 border-orange-500/50';
    if (g === 'F') return 'bg-red-500/20 border-red-500/50';
    return 'bg-slate-500/20 border-slate-500/50';
  };

  const getScoreColor = (s) => {
    if (s >= 90) return 'text-emerald-400';
    if (s >= 75) return 'text-cyan-400';
    if (s >= 60) return 'text-yellow-400';
    if (s >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🖥️</span>
              </div>
              <div>
                <h1 className="text-white font-bold">Admin Dashboard</h1>
                <p className="text-cyan-300/70 text-xs">SysAdmin | لوحة تحكم المدير</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-600/20 rounded-lg border border-emerald-500/30">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-xs">Connected to Supabase</span>
              </div>
              <button onClick={handleRefresh} disabled={refreshing} className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button onClick={onLogout} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
            <span className="text-slate-400 text-sm">Total Students</span>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
            <span className="text-slate-400 text-sm">Avg Score</span>
            <p className={`text-3xl font-bold ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}%</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
            <span className="text-slate-400 text-sm">Avg Progress</span>
            <p className="text-3xl font-bold text-cyan-400">{stats.avgProgress}%</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
            <span className="text-slate-400 text-sm">Sections</span>
            <p className="text-3xl font-bold text-purple-400">{Math.max(0, sections.length - 1)}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Grade Distribution</h3>
          <div className="flex flex-wrap gap-3">
            {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].map(g => (
              <div key={g} className={`px-4 py-2 rounded-lg border ${getGradeBg(g)} flex items-center gap-2`}>
                <span className={`font-bold ${getGradeColor(g)}`}>{g}</span>
                <span className="text-slate-400 text-sm">({stats.gradeDistribution[g] || 0})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400"
            />
            <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white">
              {sections.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Sections' : `Section ${s}`}</option>
              ))}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white">
              <option value="name">Sort by Name</option>
              <option value="id">Sort by ID</option>
              <option value="grade">Sort by Grade</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Students</h3>
            <span className="text-slate-400 text-sm">{filteredStudents.length} students</span>
          </div>
          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 text-lg mb-2">No students found</p>
              <button onClick={handleRefresh} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm">Refresh Data</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Student</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Section</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Progress</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Score</th>
                    <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredStudents.map(student => {
                    const completed = student.progress ? Object.values(student.progress).filter(p => p.completed).length : 0;
                    const pct = Math.round((completed / totalLabs) * 100);
                    return (
                      <tr key={student.id || student.studentNumber} className="hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {student.studentName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-white font-medium">{student.studentName}</p>
                              <p className="text-slate-400 text-xs">{student.studentNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-slate-700 rounded text-cyan-400 text-sm">{student.sectionNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-slate-400 text-sm">{completed}/{totalLabs}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${getScoreColor(student.totalScore || 0)}`}>{student.totalScore || 0}%</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getGradeBg(student.overallGrade || 'N/A')} ${getGradeColor(student.overallGrade || 'N/A')}`}>
                            {student.overallGrade || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer className="py-6 text-center border-t border-slate-800 mt-8">
        <p className="text-slate-500 text-sm">Systems Administration | Taif University</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
