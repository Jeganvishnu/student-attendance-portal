
import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center text-center mb-8 space-y-3">
      <div className="p-3 bg-blue-600 rounded-full shadow-lg ring-4 ring-blue-50 transform transition hover:scale-105 duration-300">
        <Camera className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Student Attendance Portal
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
          Mark your attendance using AI-powered face recognition
        </p>
      </div>
    </header>
  );
};

export default Header;
