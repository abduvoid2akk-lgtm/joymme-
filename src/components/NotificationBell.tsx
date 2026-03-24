import React, { useState } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 md:p-2.5 text-gray-500 hover:text-emerald-600 transition-colors bg-gray-50 rounded-xl md:rounded-2xl border border-black/5"
      >
        <Bell size={20} className="md:w-[22px] md:h-[22px]" />
        <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="fixed md:absolute top-20 md:top-14 right-4 md:right-0 left-4 md:left-auto w-auto md:w-80 bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden border border-black/5"
            >
              <div className="p-5 border-b border-black/5 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Bildirishnomalar</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">3 YANGI</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border-b border-black/5 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Yangi xabar</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">Sizning "Zamonaviy hovli" e'loningiz bo'yicha yangi xabar keldi.</p>
                      <p className="text-[10px] text-gray-400 mt-2 font-bold">2 daqiqa oldin</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="w-full p-4 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                Barchasini ko'rish
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
