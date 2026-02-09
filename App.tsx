import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AttendanceCard from './components/AttendanceCard';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AttendanceLogs from './components/AttendanceLogs';
import RegisterStudent from './components/RegisterStudent';
import AuthPage from './components/AuthPage';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Student, AttendanceRecord } from './types';
import { 
  getStudentsFromDb, 
  addStudentToDb, 
  getAttendanceLogsFromDb, 
  addAttendanceToDb,
  deleteStudentFromDb
} from './services/dbService';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'student' | 'admin-login' | 'admin-dashboard' | 'attendance-logs' | 'register-student'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Database State
  const [registeredStudents, setRegisteredStudents] = useState<Student[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [students, logs] = await Promise.all([
          getStudentsFromDb(),
          getAttendanceLogsFromDb()
        ]);
        setRegisteredStudents(students);
        setAttendanceLogs(logs);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleNavigate = (newView: 'student' | 'admin') => {
    if (newView === 'admin') {
      setView('admin-login');
      return;
    }
    setView('student');
  };

  const handleRegisterStudent = async (newStudent: Student) => {
    // Save to Firebase
    await addStudentToDb(newStudent);
    
    // Update local state
    setRegisteredStudents(prev => [newStudent, ...prev]);
    
    // Navigate
    setView('admin-dashboard');
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      // Delete from Firebase
      await deleteStudentFromDb(studentId);
      
      // Update local state
      setRegisteredStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (error) {
      console.error("Failed to delete student", error);
      alert("Failed to delete student from database.");
    }
  };

  const handleAttendanceMarked = async (record: AttendanceRecord) => {
    try {
      // Save to Firebase
      await addAttendanceToDb(record);
      
      // Update local state
      setAttendanceLogs(prev => [record, ...prev]);
    } catch (error) {
      console.error("Failed to save attendance log remotely", error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Database...</p>
      </div>
    );
  }

  // Gateway: Auth Page
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  // View: Landing Page
  if (view === 'landing') {
    return <LandingPage onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  // View: Admin Login
  if (view === 'admin-login') {
    return (
      <AdminLogin 
        onLoginSuccess={() => setView('admin-dashboard')}
        onBack={() => setView('landing')}
      />
    );
  }

  // View: Admin Dashboard
  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard 
        onLogout={() => {
          setView('landing');
        }}
        onViewLogs={() => setView('attendance-logs')}
        onRegister={() => setView('register-student')}
        onDeleteStudent={handleDeleteStudent}
        students={registeredStudents}
        attendanceLogs={attendanceLogs}
      />
    );
  }

  // View: Attendance Logs
  if (view === 'attendance-logs') {
    return (
      <AttendanceLogs 
        onBack={() => setView('admin-dashboard')}
        logs={attendanceLogs}
      />
    );
  }

  // View: Register Student
  if (view === 'register-student') {
    return (
      <RegisterStudent 
        onBack={() => setView('admin-dashboard')}
        onRegister={handleRegisterStudent}
      />
    );
  }

  // View: Student Attendance Portal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative">
      {/* Back Button to return to Landing Page */}
      <button 
        onClick={() => setView('landing')}
        className="absolute top-4 left-4 md:top-8 md:left-8 p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
        title="Back to Home"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-4xl flex flex-col items-center mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Header />
        <main className="w-full flex justify-center">
          <AttendanceCard 
            students={registeredStudents} 
            onAttendanceMarked={handleAttendanceMarked}
          />
        </main>
        
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Academic Institution. Secure Attendance System.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;