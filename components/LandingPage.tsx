
import React from 'react';
import { Shield, Users, Camera, FileText, Database, ScanFace, History, Lock, UserCog, LogOut } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'student' | 'admin') => void;
  onLogout: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative">
      {/* Logout Button - Top Left */}
      <button
        onClick={onLogout}
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full shadow-sm text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-300 font-medium text-sm group z-10"
      >
        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">Logout</span>
      </button>

      <div className="text-center max-w-3xl mx-auto mb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full shadow-xl mb-2 ring-4 ring-blue-100">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-3">
            Face Recognition Attendance System
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Advanced AI-powered attendance tracking with real-time face recognition
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl px-2 md:px-4">
        {/* Admin Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-2xl transition-all duration-300 flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Admin Access</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">Manage students and view attendance records</p>
          
          <div className="space-y-4 mb-8 flex-grow bg-slate-50/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 text-slate-600">
              <UserCog className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Register new students</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">View all attendance logs</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Manage face recognition data</span>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('admin')}
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 transform active:scale-95"
          >
            <Shield className="w-4 h-4" />
            Continue as Admin
          </button>
        </div>

        {/* Student Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 hover:shadow-2xl transition-all duration-300 flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Student Access</h2>
          <p className="text-slate-500 text-center mb-8 text-sm">Mark attendance using face recognition</p>
          
          <div className="space-y-4 mb-8 flex-grow bg-slate-50/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 text-slate-600">
              <ScanFace className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium">Instant face verification</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <History className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium">View your attendance history</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium">Secure and contactless</span>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('student')}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform active:scale-95"
          >
            <Users className="w-4 h-4" />
            Continue as Student
          </button>
        </div>
      </div>

      <div className="mt-16 text-center animate-in fade-in duration-1000 delay-500">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Powered by AI • Secure • Real-time Recognition</p>
      </div>
    </div>
  );
};

export default LandingPage;
