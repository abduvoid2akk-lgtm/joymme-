import React from 'react';
import { Bell, ChevronLeft, MessageCircle, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

interface Notification {
  id: string;
  type: 'message' | 'like' | 'system';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'message', title: 'Yangi xabar', description: 'Sizning "Zamonaviy hovli" e\'loningiz bo\'yicha yangi xabar keldi.', time: '2 daqiqa oldin', isRead: false },
  { id: '2', type: 'like', title: 'E\'lon yoqdi', description: 'Ali Karimov sizning e\'loningizni saqlanganlarga qo\'shdi.', time: '1 soat oldin', isRead: false },
  { id: '3', type: 'system', title: 'E\'lon tasdiqlandi', description: 'Sizning "Kvartira" e\'loningiz moderator tomonidan tasdiqlandi.', time: '3 soat oldin', isRead: true },
  { id: '4', type: 'message', title: 'Yangi xabar', description: 'Malika Ahmedova sizga xabar yubordi.', time: 'Kecha', isRead: true },
];

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 px-4 pb-32">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 md:mb-8 flex items-center gap-2 text-gray-500 font-black hover:text-gray-900 transition-colors uppercase tracking-widest text-[10px] md:text-xs"
      >
        <ChevronLeft size={18} />
        Orqaga qaytish
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Bell size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Bildirishnomalar</h1>
            <p className="text-xs md:text-sm text-gray-500 font-bold">Barcha yangiliklar va xabarlar</p>
          </div>
        </div>
        <button className="text-emerald-600 font-black text-xs md:text-sm hover:underline text-left md:text-right">Hammasini o'qilgan deb belgilash</button>
      </div>

      <div className="space-y-3 md:space-y-4">
        {MOCK_NOTIFICATIONS.map((notification, i) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-black/5 flex gap-4 md:gap-6 transition-all cursor-pointer ${
              notification.isRead ? 'bg-white' : 'bg-emerald-50/50 border-emerald-100 shadow-lg shadow-emerald-50'
            }`}
          >
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[20px] flex items-center justify-center shrink-0 ${
              notification.type === 'message' ? 'bg-blue-50 text-blue-600' :
              notification.type === 'like' ? 'bg-pink-50 text-pink-600' :
              'bg-emerald-50 text-emerald-600'
            }`}>
              {notification.type === 'message' ? <MessageCircle size={20} className="md:w-6 md:h-6" /> :
               notification.type === 'like' ? <Heart size={20} className="md:w-6 md:h-6" /> :
               <Star size={20} className="md:w-6 md:h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1 gap-2">
                <h3 className="font-black text-gray-900 tracking-tight text-sm md:text-base truncate">{notification.title}</h3>
                <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase shrink-0 mt-1">{notification.time}</span>
              </div>
              <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 md:line-clamp-none">{notification.description}</p>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 rounded-full mt-2 shrink-0" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
