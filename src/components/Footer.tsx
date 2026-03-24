import React from 'react';
import { Home, Heart, PlusCircle, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Footer: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Asosiy', path: '/' },
    { icon: Heart, label: 'Saqlanganlar', path: '/favorites' },
    { icon: PlusCircle, label: 'E\'lon', path: '/add', isAction: true },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-black/5 px-2 py-2 grid grid-cols-5 justify-items-center items-center z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        if (item.isAction) {
          return (
            <div key={item.path} className="flex justify-center items-center">
              <Link
                to={item.path}
                className="relative -top-8 bg-emerald-600 text-white p-5 rounded-full shadow-2xl shadow-emerald-300 active:scale-90 transition-all border-4 border-white"
              >
                <Icon size={28} strokeWidth={3} />
              </Link>
            </div>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center h-12 transition-all active:scale-90 ${
              isActive ? 'text-emerald-600' : 'text-gray-400'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
          </Link>
        );
      })}
    </footer>
  );
};
