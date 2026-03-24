import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, User as UserIcon, ShieldCheck, Loader2, ChevronRight, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { formatPhoneNumber } from '../utils/formatters';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [step, setStep] = useState(1); // 1: Info, 2: Code
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998 ',
    code: '',
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) });
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length < 17) {
      setError("Telefon raqamini to'liq kiriting");
      return;
    }
    if (formData.name.length < 2) {
      setError("Ismingizni kiriting");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, name: formData.name }),
      });

      const data = await response.json();
      if (data.success) {
        setStep(2);
      } else {
        setError(data.error || "Xatolik yuz berdi");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.length !== 6) {
      setError("6 xonali kodni kiriting");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, code: formData.code }),
      });

      const data = await response.json();
      if (data.success) {
        login(data.user);
        navigate('/profile');
      } else {
        setError(data.error || "Kod noto'g'ri");
      }
    } catch (err) {
      setError("Server bilan bog'lanishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-black/5"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-100">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {step === 1 ? "Kirish" : "Kodni tasdiqlash"}
          </h2>
          <p className="text-gray-500 font-medium mt-2">
            {step === 1 
              ? "Telefon raqamingiz orqali tizimga kiring" 
              : "Telegram bot orqali yuborilgan kodni kiriting (yoki 123456)"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendCode} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Ismingiz</label>
                <div className="relative">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    required
                    type="text"
                    placeholder="Ismingizni kiriting"
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Telefon raqam</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <span>KODNI OLISH</span>
                    <ChevronRight size={20} />
                  </>
                )}
              </button>

              <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <MessageSquare className="text-indigo-600 shrink-0" size={24} />
                  <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                    Tasdiqlash kodi bizning Telegram botimiz orqali yuboriladi. Botni ishga tushirganingizga ishonch hosil qiling.
                  </p>
                </div>
                <a 
                  href="https://t.me/new_joyme_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <MessageSquare size={16} />
                  <span>BOT LINK</span>
                </a>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyCode} 
              className="space-y-8"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center block">6 xonali kod</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-gray-50 border border-black/5 rounded-3xl py-8 text-center text-4xl font-black tracking-[1em] focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.replace(/\D/g, '') })}
                />
                <p className="text-center text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">
                  Test uchun: 123456
                </p>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">
                  {error}
                </p>
              )}

              <div className="space-y-4">
                <button
                  disabled={loading}
                  className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "TASDIQLASH"}
                </button>

                {/* Telegram Bot Link */}
                <a
                  href="https://t.me/new_joyme_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-indigo-50 text-indigo-600 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border border-indigo-100 hover:bg-indigo-100 transition-all"
                >
                  <MessageSquare size={20} />
                  <span>BOTGA O'TISH (KODNI OLISH)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-400 font-black text-sm hover:text-gray-900 transition-colors"
                >
                  RAQAMNI O'ZGARTIRISH
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
