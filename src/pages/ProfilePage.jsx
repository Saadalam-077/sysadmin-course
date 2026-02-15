import React from 'react';

const ProfilePage = ({ user, onNavigate, onLogout }) => {
  const labs = [
    { lab: 1, title: "Introduction to Systems Administration" },
    { lab: 2, title: "Linux Installation & Configuration" },
    { lab: 3, title: "User & Group Administration" },
    { lab: 4, title: "File System Management" },
    { lab: 5, title: "Package Management" },
    { lab: 6, title: "Service & Process Management" },
    { lab: 7, title: "Network Configuration" },
    { lab: 8, title: "Security & Firewall" },
    { lab: 9, title: "Backup & Recovery" },
    { lab: 10, title: "Monitoring & Troubleshooting" },
  ];

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D+';
    if (score >= 50) return 'D';
    return 'F';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-emerald-400';
    if (grade === 'B+' || grade === 'B') return 'text-cyan-400';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-400';
    if (grade === 'D+' || grade === 'D') return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900">
      <header className="bg-slate-800/80 border-b border-slate-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="px-4 py-2 bg-slate-700 rounded-lg text-white">← Back</button>
          <h1 className="text-white font-bold">Grade Report | تقرير الدرجات</h1>
          <button onClick={onLogout} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg">Logout</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">{user.studentName.charAt(0)}</div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.studentName}</h2>
              <p className="text-slate-400">{user.studentNumber} | Section {user.sectionNumber}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Average | المعدل</p>
              <p className="text-2xl font-bold text-white">{user.totalScore}%</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Grade | الدرجة</p>
              <p className={`text-2xl font-bold ${getGradeColor(user.overallGrade)}`}>{user.overallGrade}</p>
            </div>
            <div className="bg-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm">Completed | مكتمل</p>
              <p className="text-2xl font-bold text-white">{Object.values(user.progress).filter(p => p.completed).length}/10</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-300">Lab | المعمل</th>
                <th className="px-4 py-3 text-center text-slate-300">Score | الدرجة</th>
                <th className="px-4 py-3 text-center text-slate-300">Grade | التقدير</th>
                <th className="px-4 py-3 text-center text-slate-300">Status | الحالة</th>
              </tr>
            </thead>
            <tbody>
              {labs.map((lab) => {
                const progress = user.progress[`lab${lab.lab}`];
                const score = progress?.score || 0;
                const grade = progress?.completed ? getGrade(score) : '-';
                return (
                  <tr key={lab.lab} className="border-t border-slate-700">
                    <td className="px-4 py-3 text-white">Lab {lab.lab}: {lab.title}</td>
                    <td className="px-4 py-3 text-center text-white">{progress?.completed ? `${score}%` : '-'}</td>
                    <td className={`px-4 py-3 text-center font-bold ${getGradeColor(grade)}`}>{grade}</td>
                    <td className="px-4 py-3 text-center">{progress?.completed ? <span className="text-emerald-400">✓</span> : <span className="text-slate-500">-</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-4">Grading Scale | مقياس الدرجات</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-sm">
            <div className="bg-emerald-900/30 rounded-lg p-2"><span className="text-emerald-400 font-bold">A+</span><p className="text-slate-400">90-100%</p></div>
            <div className="bg-emerald-900/20 rounded-lg p-2"><span className="text-emerald-300 font-bold">A</span><p className="text-slate-400">85-89%</p></div>
            <div className="bg-cyan-900/30 rounded-lg p-2"><span className="text-cyan-400 font-bold">B+</span><p className="text-slate-400">80-84%</p></div>
            <div className="bg-cyan-900/20 rounded-lg p-2"><span className="text-cyan-300 font-bold">B</span><p className="text-slate-400">75-79%</p></div>
            <div className="bg-yellow-900/30 rounded-lg p-2"><span className="text-yellow-400 font-bold">C+</span><p className="text-slate-400">70-74%</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
