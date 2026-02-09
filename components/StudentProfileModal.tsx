
import React, { useState } from 'react';
import { X, User, Mail, Hash, Calendar, GraduationCap, Trash2, AlertTriangle } from 'lucide-react';
import { Student } from '../types';

interface StudentProfileModalProps {
  student: Student;
  onClose: () => void;
  onDelete: () => void;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Only show close button if not confirming (or handle differently) */}
        {!showConfirm ? (
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
           <div className="h-2 bg-red-500 w-full"></div>
        )}

        <div className="px-6 pb-6">
          {!showConfirm ? (
            /* --- Profile View --- */
            <>
              <div className="relative -mt-16 mb-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h2 className="mt-3 text-2xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-gray-500 font-medium">{student.department}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Student ID</p>
                    <p className="font-semibold text-gray-900">{student.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email Address</p>
                    <p className="font-semibold text-gray-900">{student.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Year</p>
                      <p className="font-semibold text-gray-900">{student.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="p-2 bg-orange-100 rounded-full text-orange-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Registered</p>
                      <p className="font-semibold text-gray-900">{student.registrationDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Student
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </>
          ) : (
            /* --- Confirmation View --- */
            <div className="py-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Student?</h3>
              <p className="text-gray-500 mb-8 max-w-xs">
                Are you sure you want to delete <span className="font-bold text-gray-800">{student.name}</span>? 
                This action cannot be undone and will remove them from the database.
              </p>
              
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-200"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
