import React from 'react';

const HomePage = ({ user, onNavigate, onLogout }) => {
  const labs = [
    { lab: 1, title: "Introduction to Systems Administration", titleAr: "مقدمة في إدارة الأنظمة", icon: "🖥️" },
    { lab: 2, title: "Linux Installation & Configuration", titleAr: "تثبيت وتكوين لينكس", icon: "💿" },
    { lab: 3, title: "User & Group Administration", titleAr: "إدارة المستخدمين والمجموعات", icon: "👥" },
    { lab: 4, title: "File System Management", titleAr: "إدارة نظام الملفات", icon: "📁" },
    { lab: 5, title: "Package Management", titleAr: "إدارة الحزم", icon: "📦" },
    { lab: 6, title: "Service & Process Management", titleAr: "إدارة الخدمات والعمليات", icon: "⚙️" },
    { lab: 7, title: "Network Configuration", titleAr: "تكوين الشبكة", icon: "🌐" },
    { lab: 8, title: "Security & Firewall", titleAr: "الأمان وجدار الحماية", icon: "🔒" },
    { lab: 9, title: "Backup & Recovery", titleAr: "النسخ الاحتياطي والاستعادة", icon: "💾" },
    { lab: 10, title: "Monitoring & Troubleshooting", titleAr: "المراقبة واستكشاف الأخطاء", icon: "📊" },
  ];

  const completedLabs = Object.values(user.progress).filter(p => p.completed).length;
  const progressPercent = Math.round((completedLabs / 10) * 100);

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-emerald-400';
    if (grade === 'B+' || grade === 'B') return 'text-cyan-400';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900">
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🖥️</span>
            </div>
            <div>
              <h1 className="text-white font-bold">Systems Administration</h1>
              <p className="text-cyan-300/70 text-xs font-arabic">إدارة الأنظمة</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('profile')} className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{user.studentName.charAt(0)}</div>
              <span className="text-white text-sm hidden sm:block">{user.studentName}</span>
            </button>
            <button onClick={onLogout} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Telegram Banner */}
        <a href="https://t.me/+DZ1h7v2duEoxOTQ0" target="_blank" rel="noopener noreferrer" className="block mb-8 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-2xl p-4 hover:from-cyan-500 hover:to-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Join Our Telegram Channel!</h3>
                <p className="text-white/80 text-sm font-arabic">انضم لقناة التليجرام للدعم والتحديثات</p>
              </div>
            </div>
            <div className="text-white text-2xl">→</div>
          </div>
        </a>

        {/* Terminal Welcome */}
        <div className="mb-8 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400 text-sm ml-2 font-mono">sysadmin@server:~$</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <p className="text-cyan-400">$ cat /etc/student-info</p>
            <p className="text-slate-300">Name: {user.studentName}</p>
            <p className="text-slate-300">ID: {user.studentNumber}</p>
            <p className="text-slate-300">Section: {user.sectionNumber}</p>
            <p className="text-slate-300">Course: Systems Administration</p>
            <p className="text-cyan-400 mt-2">$ systemctl status learning</p>
            <p className="text-green-400">● learning.service - Active ({completedLabs}/10 labs completed)</p>
            <p className="text-cyan-400 mt-2">$ _</p>
          </div>
        </div>

        {/* Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-2">Progress | التقدم</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-white">{progressPercent}%</span>
              <span className="text-slate-400 text-sm mb-1">{completedLabs}/10 labs</span>
            </div>
            <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-2">Current Grade | الدرجة</h3>
            <div className="flex items-end gap-3">
              <span className={`text-4xl font-bold ${getGradeColor(user.overallGrade)}`}>{user.overallGrade}</span>
              <span className="text-slate-400 text-sm mb-1">{user.totalScore}% avg</span>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-2">Student Info | معلومات الطالب</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="text-white">{user.studentName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">ID:</span><span className="text-white font-mono">{user.studentNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Section:</span><span className="text-cyan-400">{user.sectionNumber}</span></div>
            </div>
          </div>
        </div>

        {/* Labs */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Course Labs</h2>
          <p className="text-cyan-300/70 font-arabic">معامل الدورة</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab) => {
            const progress = user.progress[`lab${lab.lab}`];
            const isCompleted = progress?.completed;
            const score = progress?.score || 0;
            return (
              <div key={lab.lab} onClick={() => onNavigate(`lab${lab.lab}`)} className={`p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-700/30 border-slate-600 hover:border-cyan-500/50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isCompleted ? 'bg-emerald-600' : 'bg-cyan-600'}`}>{isCompleted ? '✓' : lab.icon}</div>
                  <div className="flex-1">
                    <span className="text-xs text-cyan-400 font-semibold">Lab {lab.lab} | المعمل {lab.lab}</span>
                    <h4 className="text-white font-semibold text-sm">{lab.title}</h4>
                    <p className="text-cyan-300/60 text-xs font-arabic">{lab.titleAr}</p>
                  </div>
                </div>
                {isCompleted ? (
                  <div className="mt-3 flex items-center justify-between bg-slate-800/50 rounded-lg p-2">
                    <span className="text-emerald-400 text-xs">Completed | مكتمل</span>
                    <span className={`font-bold text-sm ${score >= 90 ? 'text-emerald-400' : score >= 60 ? 'text-cyan-400' : 'text-red-400'}`}>{score}%</span>
                  </div>
                ) : (
                  <div className="mt-3 text-center"><span className="text-slate-400 text-xs">Click to start | انقر للبدء →</span></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-slate-800/50 rounded-2xl p-8 border border-slate-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Contact & Support</h2>
          <p className="text-cyan-300/70 font-arabic mb-6">التواصل والدعم</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a href="https://t.me/+DZ1h7v2duEoxOTQ0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              <div className="text-left">
                <p className="text-white font-bold">Telegram Channel</p>
                <p className="text-white/70 text-sm font-arabic">قناة التليجرام</p>
              </div>
            </a>
            <div>
              <p className="text-slate-400">Prepared by | إعداد</p>
              <p className="text-white font-semibold text-lg">Saad Alamri</p>
              <p className="text-cyan-300/70 font-arabic">سعد العمري</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center border-t border-slate-800 mt-8">
        <p className="text-slate-500 text-sm">Systems Administration | Taif University | جامعة الطائف</p>
        <p className="text-slate-600 text-xs mt-1">Section: 2520</p>
      </footer>
    </div>
  );
};

export default HomePage;
