
import React, { useState } from 'react';
import {
  Users,
  LogOut,
  UserPlus,
  TrendingUp,
  ClipboardCheck,
  Inbox,
  User
} from 'lucide-react';
import { Student, AttendanceRecord } from '../types';
import StudentProfileModal from './StudentProfileModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewLogs: () => void;
  onRegister: () => void;
  onDeleteStudent: (id: string) => Promise<void>;
  students: Student[];
  attendanceLogs: AttendanceRecord[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  onViewLogs, 
  onRegister, 
  onDeleteStudent,
  students, 
  attendanceLogs 
}) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Calculate stats
  const today = new Date().toLocaleDateString();
  const todaysAttendanceCount = attendanceLogs.filter(log => log.date === today).length;
  const uniqueStudentsPresent = new Set(attendanceLogs.filter(log => log.date === today).map(log => log.studentId)).size;
  const presencePercentage = students.length > 0 ? Math.round((uniqueStudentsPresent / students.length) * 100) : 0;

  const recentAttendance = attendanceLogs.slice(0, 5);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

  const handleDelete = async () => {
    if (selectedStudent) {
      await onDeleteStudent(selectedStudent.id);
      setSelectedStudent(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/30 font-sans p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-start animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage students and monitor attendance</p>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all p-2 rounded-lg flex items-center gap-2 text-sm font-medium"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Students */}
          <div className="bg-blue-600 rounded-xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-blue-100 text-sm">Total Students</h3>
              <Users className="w-5 h-5 text-blue-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{students.length}</div>
            <div className="text-xs text-blue-200 font-medium">{students.length} active</div>
          </div>

          {/* Today's Attendance */}
          <div className="bg-emerald-500 rounded-xl p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-emerald-100 text-sm">Today's Attendance</h3>
              <ClipboardCheck className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{todaysAttendanceCount}</div>
            <div className="text-xs text-emerald-200 font-medium">{presencePercentage}% of students</div>
          </div>

          {/* Total Records */}
          <div className="bg-purple-600 rounded-xl p-6 text-white relative overflow-hidden shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-purple-100 text-sm">Total Records</h3>
              <TrendingUp className="w-5 h-5 text-purple-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{attendanceLogs.length}</div>
            <div className="text-xs text-purple-200 font-medium">All time</div>
          </div>

          {/* Quick Action */}
          <div className="bg-orange-600 rounded-xl p-6 text-white relative overflow-hidden shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-shadow duration-300">
             <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-orange-100 text-sm">Quick Action</h3>
              <UserPlus className="w-5 h-5 text-orange-200" />
            </div>
            <button 
              onClick={onRegister}
              className="w-full bg-white text-orange-600 font-semibold py-2 rounded-lg text-sm hover:bg-orange-50 transition-colors mt-1 shadow-sm"
            >
              Register Student
            </button>
          </div>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Attendance */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 flex flex-col h-full">
            <h2 className="font-bold text-slate-800 mb-4 text-sm">Recent Attendance</h2>
            <div className="flex-grow space-y-2 min-h-[200px]">
              {recentAttendance.length > 0 ? (
                recentAttendance.map((record, idx) => (
                  <div key={record.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-default group">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${colors[idx % colors.length]} text-white flex items-center justify-center font-semibold text-sm shadow-sm`}>
                        {getInitials(record.name)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{record.name}</p>
                        <p className="text-xs text-slate-500">{record.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-700">{record.time}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{record.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-lg p-8">
                  <Inbox className="w-8 h-8 text-slate-300" />
                  <p className="text-sm">No recent attendance records</p>
                </div>
              )}
            </div>
            <button 
              onClick={onViewLogs}
              className="w-full mt-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              View All Records
            </button>
          </div>

          {/* Recently Registered Students */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 flex flex-col h-full">
             <h2 className="font-bold text-slate-800 mb-4 text-sm">Recently Registered Students</h2>
             <div className="flex-grow space-y-2 min-h-[200px]">
               {students.length > 0 ? (
                 students.map((student) => (
                   <div 
                    key={student.id} 
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => setSelectedStudent(student)}
                   >
                     <div className="flex items-center gap-3">
                       <div className="relative">
                          {student.avatar ? (
                            <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100 group-hover:border-blue-200 transition-all" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-slate-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                          )}
                       </div>
                       
                       <div>
                         <p className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{student.name}</p>
                         <p className="text-xs text-slate-500">{student.id}</p>
                       </div>
                     </div>
                     <div className="text-right max-w-[140px]">
                       <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate">{student.department}</p>
                       <p className="text-xs text-slate-500 font-medium">{student.year}</p>
                     </div>
                   </div>
                 ))
               ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-100 rounded-lg p-8">
                  <UserPlus className="w-8 h-8 text-slate-300" />
                  <p className="text-sm">No students registered yet</p>
                </div>
               )}
             </div>
             <button 
                onClick={onRegister}
                className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
             >
                <UserPlus className="w-4 h-4" />
                Register New Student
            </button>
          </div>
        </div>
      </div>
      
      {/* Student Profile Modal */}
      {selectedStudent && (
        <StudentProfileModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
