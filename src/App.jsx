import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import LabLesson from './pages/LabLesson';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
    const saved = localStorage.getItem('sysadminUser');
    if (saved) {
      setUser(JSON.parse(saved));
      setCurrentPage('home');
    }
    setLoading(false);
  }, []);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('sysadmin_students')
        .select('*')
        .order('registered_at', { ascending: false });
      if (error) {
        console.error('Error loading students:', error);
        return;
      }
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
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('sysadminUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('sysadminUser');
    }
  }, [user]);

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
      if (error || !student) {
        return false;
      }
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
      setCurrentPage('home');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
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
      if (error) {
        console.error('Registration error:', error);
        return false;
      }
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
      setCurrentPage('home');
      await loadStudents();
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sysadminUser');
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('login');
  };

  const handleExerciseComplete = async (labNum, score) => {
    if (!user) return;
    const updated = { ...user };
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
      const { error } = await supabase
        .from('sysadmin_students')
        .update({
          progress: updated.progress,
          total_score: updated.totalScore,
          overall_grade: updated.overallGrade
        })
        .eq('id', user.id);
      if (error) {
        console.error('Error updating progress:', error);
        return;
      }
      setUser(updated);
      setStudents(students.map(s => s.id === user.id ? updated : s));
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const navigate = (page) => setCurrentPage(page);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

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
