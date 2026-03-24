import React, { useState } from 'react';
import { Home, Search, PlusCircle, User, Bell, MessageCircle, ChevronLeft, Map as MapIcon, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { icon: Home, label: 'Asosiy', path: '/' },
    { icon: Heart, label: 'Saqlanganlar', path: '/favorites' },
    { icon: PlusCircle, label: 'E\'lon', path: '/add', isAction: true },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  const isMapOrChat = location.pathname === '/chat' || (location.pathname === '/search' && new URLSearchParams(location.search).get('view') === 'map');

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-0 md:pt-16">
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white border-bottom border-black/5 z-50 items-center justify-between px-8 shadow-sm">
        <Link to="/" className="text-2xl font-black text-emerald-600 tracking-tighter">
          UYBOZOR
        </Link>
        
        <div className="flex items-center gap-6">
          {navItems.filter(i => !i.isAction).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 font-medium transition-colors ${
                location.pathname === item.path ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            to="/add"
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
          >
            <PlusCircle size={20} />
            <span>E'lon qo'shish</span>
          </Link>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-bottom border-black/5 z-50 flex items-center justify-between px-4">
        {location.pathname !== '/' || isMapOrChat ? (
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="text-xl font-black text-emerald-600 tracking-tighter">UYBOZOR</div>
        )}
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500"
          >
            <Bell size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-20 md:pt-8">
        {children}
      </main>

      {/* Floating Action Buttons (Mobile) */}
      {!isMapOrChat && (
        <div className="md:hidden fixed bottom-24 right-6 flex flex-col gap-4 z-40">
          <Link
            to="/search?view=map"
            className="w-14 h-14 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-gray-900 border border-black/5 active:scale-90 transition-transform"
          >
            <MapIcon size={24} />
          </Link>
          <Link
            to="/chat"
            className="w-14 h-14 bg-emerald-600 shadow-2xl rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <MessageCircle size={24} />
          </Link>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-black/5 px-6 py-3 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] safe-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          if (item.isAction) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative -top-6 bg-emerald-600 text-white p-4 rounded-2xl shadow-xl shadow-emerald-200 active:scale-90 transition-all"
              >
                <Icon size={24} />
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
                isActive ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed top-16 right-4 md:right-8 w-80 bg-white rounded-2xl shadow-2xl z-[70] overflow-hidden border border-black/5"
            >
              <div className="p-4 border-b border-black/5 font-bold text-gray-900">Bildirishnomalar</div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border-b border-black/5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Yangi xabar</p>
                        <p className="text-xs text-gray-500 mt-0.5">Sizning e'loningiz bo'yicha yangi xabar keldi.</p>
                        <p className="text-[10px] text-gray-400 mt-1">2 daqiqa oldin</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
