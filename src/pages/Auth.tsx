import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-block text-3xl font-black text-emerald-600 tracking-tighter mb-6">
            UYBOZOR
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">
            {isLogin ? 'Xush kelibsiz!' : 'Ro\'yxatdan o\'tish'}
          </h2>
          <p className="text-gray-500 font-bold text-sm">
            {isLogin ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
          </p>
        </div>

        <div className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">To'liq ism</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Ismingizni kiriting"
                  className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email manzili</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold transition-all text-sm"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Eslab qolish</span>
              </label>
              <button className="text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest">Parolni unutdingizmi?</button>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2 group uppercase tracking-widest"
          >
            <span>{isLogin ? 'KIRISH' : 'RO\'YXATDAN O\'TISH'}</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-gray-400 bg-white px-4">Yoki</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-4 bg-white border border-black/5 rounded-2xl font-black text-xs text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest">
              <Chrome size={18} className="text-red-500" />
              <span>Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-4 bg-white border border-black/5 rounded-2xl font-black text-xs text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest">
              <Github size={18} />
              <span>GitHub</span>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 font-bold text-sm">
              {isLogin ? 'Hisobingiz yo\'qmi?' : 'Hisobingiz bormi?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-emerald-600 font-black hover:underline uppercase tracking-widest text-xs"
              >
                {isLogin ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
