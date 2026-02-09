import React, { useState } from 'react';
import { ArrowLeft, Download, Filter, Search, Calendar, BookOpen } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface AttendanceLogsProps {
  onBack: () => void;
  logs: AttendanceRecord[];
}

const AttendanceLogs: React.FC<AttendanceLogsProps> = ({ onBack, logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  
  const records = logs.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.studentId.includes(searchTerm);
    const matchesSubject = record.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    // Simple date string check
    const matchesDate = dateFilter ? record.date.includes(dateFilter) : true; 
    
    return matchesSearch && matchesSubject && matchesDate;
  });

  const handleExportCSV = () => {
    // Define CSV headers
    const headers = ['Student ID', 'Name', 'Date', 'Time', 'Subject', 'Status', 'Confidence'];
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...records.map(row => [
        row.studentId,
        row.name,
        `"${row.date}"`, // Quote date to handle commas
        row.time,
        row.subject,
        row.status,
        row.confidence.toFixed(2)
      ].join(','))
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-blue-50/30 font-sans p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button 
              onClick={onBack}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Attendance Logs</h1>
          </div>
          <p className="text-slate-500 ml-10">View and export attendance records</p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-green-200"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-4">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 ml-1">Search Student</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Name or ID" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 ml-1">Filter by Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="dd/mm/yyyy" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 ml-1">Filter by Subject</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Subject name" 
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Attendance Records ({records.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{record.studentId}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.time}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.subject}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        record.confidence > 0.8 ? 'bg-green-50 text-green-600 border-green-100' : 
                        record.confidence > 0.5 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {(record.confidence * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No records found. Export to CSV to save data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLogs;
