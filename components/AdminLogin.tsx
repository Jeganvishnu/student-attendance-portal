import React, { useState } from 'react';
import { Shield, KeyRound, ArrowRight, ArrowLeft, Lock } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretKey === 'FACE') {
      onLoginSuccess();
    } else {
      setError('Invalid secret key. Access denied.');
      setSecretKey('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 md:top-8 md:left-8 p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
        title="Back to Home"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-blue-600 p-6 flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Admin Verification</h2>
              <p className="text-gray-500 mt-2 text-sm">Enter the secret key to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="secretKey" className="text-sm font-medium text-gray-700 block">
                  Secret Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="secretKey"
                    value={secretKey}
                    onChange={(e) => {
                      setSecretKey(e.target.value);
                      setError('');
                    }}
                    className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-all`}
                    placeholder="Enter key..."
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
                    <Lock className="w-3 h-3" /> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-95"
              >
                Verify & Access
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
             <p className="text-xs text-center text-gray-400">Authorized personnel only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;