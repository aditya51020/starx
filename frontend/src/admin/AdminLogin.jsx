// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { adminLogin } = useAuth(); // Use adminLogin
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminLogin(email, password); // Call adminLogin
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#FFFDF0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Lock className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 mt-2 font-medium">Secure Access Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Email</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-[#FFFDF0] focus:border-[#D4AF37] transition-all outline-none bg-slate-50 focus:bg-white"
                placeholder="admin@starx.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl 
                focus:ring-4 focus:ring-[#FFFDF0] focus:border-[#D4AF37] transition-all outline-none bg-slate-50 focus:bg-white"
                placeholder="Enter your secure password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D4AF37] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C5A059] shadow-lg hover:shadow-[#D4AF37]/30
            transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Verifying...
              </>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Protected by StarX Security Systems &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
