import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LabLesson from './pages/LabLesson';
import AdminDashboard from './pages/AdminDashboard';

const defaultSeedStudents = [
  {
    id: 'seed-1',
    studentNumber: '44101234',
    studentName: 'أحمد الغامدي',
    password: '1234',
    sectionNumber: '2520',
    progress: {
      lab1: { completed: true, score: 95, attempts: 1, completedAt: new Date().toISOString() },
      lab2: { completed: true, score: 90, attempts: 1, completedAt: new Date().toISOString() }
    },
    totalScore: 93,
    overallGrade: 'A',
    registeredAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'seed-2',
    studentNumber: '44105678',
    studentName: 'محمد الثبيتي',
    password: '1234',
    sectionNumber: '2520',
    progress: {
      lab1: { completed: true, score: 85, attempts: 2, completedAt: new Date().toISOString() }
    },
    totalScore: 85,
    overallGrade: 'A',
    registeredAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sysadminUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const saved = localStorage.getItem('sysadminUser');
      return saved ? 'home' : 'login';
    } catch (e) {
      return 'login';
    }
  });

  const [students, setStudents] = useState(() => {
    try {
      const local = localStorage.getItem('sysadmin_local_students');
      return local ? JSON.parse(local) : defaultSeedStudents;
    } catch (e) {
      return defaultSeedStudents;
    }
  });

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('sysadmin_students')
        .select('*')
        .order('registered_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const transformedStudents = data.map(student => ({
          id: student.id,
          studentNumber: student.student_number,
          studentName: student.student_name,
          password: student.password,
          sectionNumber: student.section_number,
          progress: student.progress || {},
          totalScore: student.total_score || 0,
          overallGrade: student.overall_grade || 'N/A',
          registeredAt: student.registered_at
        }));
        setStudents(transformedStudents);
        localStorage.setItem('sysadmin_local_students', JSON.stringify(transformedStudents));
        return;
      }
    } catch (err) {
      console.warn('Failed to load students from Supabase, checking local cache:', err);
    }
    const local = localStorage.getItem('sysadmin_local_students');
    if (local) {
      try {
        setStudents(JSON.parse(local));
      } catch (e) {
        setStudents(defaultSeedStudents);
      }
    } else {
      setStudents(defaultSeedStudents);
      localStorage.setItem('sysadmin_local_students', JSON.stringify(defaultSeedStudents));
    }
  };

  const handleLogin = async (studentNumber, password) => {
    if (studentNumber === 'admin' && password === 'Saad@1234') {
      setIsAdmin(true);
      await loadStudents();
      setCurrentPage('admin');
      return true;
    }
    try {
      const { data: student, error } = await supabase
        .from('sysadmin_students')
        .select('*')
        .eq('student_number', studentNumber)
        .eq('password', password)
        .single();
      if (!error && student) {
        const transformedStudent = {
          id: student.id,
          studentNumber: student.student_number,
          studentName: student.student_name,
          password: student.password,
          sectionNumber: student.section_number,
          progress: student.progress || {},
          totalScore: student.total_score || 0,
          overallGrade: student.overall_grade || 'N/A',
          registeredAt: student.registered_at
        };
        setUser(transformedStudent);
        localStorage.setItem('sysadminUser', JSON.stringify(transformedStudent));
        setCurrentPage('home');
        return true;
      }
    } catch (err) {
      console.warn('Supabase login query error, checking local store:', err);
    }
    const localStudents = JSON.parse(localStorage.getItem('sysadmin_local_students') || '[]');
    const match = localStudents.find(s => s.studentNumber === studentNumber && s.password === password);
    if (match) {
      setUser(match);
      localStorage.setItem('sysadminUser', JSON.stringify(match));
      setCurrentPage('home');
      return true;
    }
    return false;
  };

  const handleRegister = async (data) => {
    try {
      const { data: existing } = await supabase
        .from('sysadmin_students')
        .select('student_number')
        .eq('student_number', data.studentNumber)
        .single();
      if (existing) {
        return false;
      }
      const { data: newStudent, error } = await supabase
        .from('sysadmin_students')
        .insert([{
          student_number: data.studentNumber,
          student_name: data.studentName,
          password: data.password,
          section_number: data.sectionNumber,
          progress: {},
          total_score: 0,
          overall_grade: 'N/A'
        }])
        .select()
        .single();
      if (!error && newStudent) {
        const transformedUser = {
          id: newStudent.id,
          studentNumber: newStudent.student_number,
          studentName: newStudent.student_name,
          password: newStudent.password,
          sectionNumber: newStudent.section_number,
          progress: {},
          totalScore: 0,
          overallGrade: 'N/A',
          registeredAt: newStudent.registered_at
        };
        setUser(transformedUser);
        localStorage.setItem('sysadminUser', JSON.stringify(transformedUser));
        setCurrentPage('home');
        const localList = JSON.parse(localStorage.getItem('sysadmin_local_students') || '[]');
        localStorage.setItem('sysadmin_local_students', JSON.stringify([transformedUser, ...localList]));
        await loadStudents();
        return true;
      }
    } catch (err) {
      console.warn('Supabase registration error, falling back to local registration:', err);
    }
    const localList = JSON.parse(localStorage.getItem('sysadmin_local_students') || '[]');
    if (localList.some(s => s.studentNumber === data.studentNumber)) {
      return false;
    }
    const localUser = {
      id: 'local-' + Date.now(),
      studentNumber: data.studentNumber,
      studentName: data.studentName,
      password: data.password,
      sectionNumber: data.sectionNumber,
      progress: {},
      totalScore: 0,
      overallGrade: 'N/A',
      registeredAt: new Date().toISOString()
    };
    const updatedList = [localUser, ...localList];
    localStorage.setItem('sysadmin_local_students', JSON.stringify(updatedList));
    setStudents(updatedList);
    setUser(localUser);
    localStorage.setItem('sysadminUser', JSON.stringify(localUser));
    setCurrentPage('home');
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('sysadminUser');
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('login');
  };

  const handleExerciseComplete = async (labNum, score) => {
    if (!user) return;
    const updated = {
      ...user,
      progress: { ...(user.progress || {}) }
    };
    updated.progress[`lab${labNum}`] = {
      completed: true,
      score,
      attempts: (updated.progress[`lab${labNum}`]?.attempts || 0) + 1,
      completedAt: new Date().toISOString()
    };
    const scores = Object.values(updated.progress).filter(p => p.completed).map(p => p.score);
    updated.totalScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const avg = updated.totalScore;
    if (avg >= 90) updated.overallGrade = 'A+';
    else if (avg >= 85) updated.overallGrade = 'A';
    else if (avg >= 80) updated.overallGrade = 'B+';
    else if (avg >= 75) updated.overallGrade = 'B';
    else if (avg >= 70) updated.overallGrade = 'C+';
    else if (avg >= 65) updated.overallGrade = 'C';
    else if (avg >= 60) updated.overallGrade = 'D+';
    else if (avg >= 50) updated.overallGrade = 'D';
    else updated.overallGrade = 'F';

    try {
      await supabase
        .from('sysadmin_students')
        .update({
          progress: updated.progress,
          total_score: updated.totalScore,
          overall_grade: updated.overallGrade
        })
        .eq('id', user.id);
    } catch (err) {
      console.warn('Error updating progress in Supabase (local update applied):', err);
    }

    setUser(updated);
    localStorage.setItem('sysadminUser', JSON.stringify(updated));
    setStudents(prev => {
      const next = prev.map(s => s.id === user.id ? updated : s);
      localStorage.setItem('sysadmin_local_students', JSON.stringify(next));
      return next;
    });
  };

  const navigate = (page) => setCurrentPage(page);

  if (isAdmin && currentPage === 'admin') {
    return <AdminDashboard students={students} onNavigate={navigate} onLogout={handleLogout} onRefresh={loadStudents} />;
  }

  if (!user) {
    if (currentPage === 'register') return <RegisterPage onRegister={handleRegister} onNavigate={navigate} />;
    return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
  }

  if (currentPage === 'profile') return <ProfilePage user={user} onNavigate={navigate} onLogout={handleLogout} />;
  if (currentPage.startsWith('lab')) {
    const labNum = parseInt(currentPage.replace('lab', ''));
    return <LabLesson labNum={labNum} user={user} onNavigate={navigate} onExerciseComplete={handleExerciseComplete} />;
  }
  return <HomePage user={user} onNavigate={navigate} onLogout={handleLogout} />;
}

export default App;
