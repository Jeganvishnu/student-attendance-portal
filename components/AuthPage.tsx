
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Camera, Loader2, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const REQUIRED_EMAIL = "jeganvishnu22@gmail.com";
    const REQUIRED_PASS = "Jegan@2004";

    setTimeout(() => {
      setIsLoading(false);
      
      if (isLogin) {
        if (formData.email === REQUIRED_EMAIL && formData.password === REQUIRED_PASS) {
          onAuthSuccess();
        } else {
          setError("Invalid email or password. Please try again.");
        }
      } else {
        onAuthSuccess();
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        {/* Logo Section - Reverted to Original Camera Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4 ring-4 ring-white">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AttendAI</h1>
          <p className="text-slate-500 text-sm font-medium">Smart Attendance Solution</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {isLogin 
                  ? 'Please enter your details to sign in.' 
                  : 'Join us to start managing attendance efficiently.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border ${error ? 'border-red-200' : 'border-slate-200'} rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm`}
                    placeholder="name@institution.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`block w-full pl-11 pr-4 py-3 bg-slate-50 border ${error ? 'border-red-200' : 'border-slate-200'} rounded-2xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={handleToggle}
                className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
              >
                {isLogin ? 'Sign up now' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
