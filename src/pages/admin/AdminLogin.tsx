import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, users } = useUser();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const adminUser = users.find(u => u.username === username && u.role === 'admin');

    if (adminUser && password === 'admin123') {
      login(adminUser);
      navigate('/admin');
    } else {
      setError('Username yoki parol noto\'g\'ri, yoki siz admin emassiz.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[48px] shadow-2xl shadow-black/5 border border-black/5 p-12">
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-emerald-50 rounded-[24px] flex items-center justify-center text-emerald-600 mb-6 shadow-lg shadow-emerald-50">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Admin Panel</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Tizimga kirish</p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center text-red-600 text-xs font-bold">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Username</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-black/5 transition-all font-bold"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Parol</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="password"
                required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:border-black/5 transition-all font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-emerald-600 hover:shadow-emerald-100 transition-all active:scale-[0.98]"
          >
            Kirish
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-black/5 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Faqat vakolatli xodimlar uchun
          </p>
        </div>
      </div>
    </div>
  );
};
