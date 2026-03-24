import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  ListOrdered, 
  Users, 
  Map as MapIcon, 
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useUser();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/pending', icon: Clock, label: 'Kutilayotgan' },
    { to: '/admin/listings', icon: ListOrdered, label: 'E\'lonlar' },
    { to: '/admin/users', icon: Users, label: 'Userlar' },
    { to: '/admin/map', icon: MapIcon, label: 'Xarita' },
    { to: '/admin/chats', icon: MessageSquare, label: 'Chatlar' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-black/5 min-h-screen flex flex-col p-6">
      <div className="mb-12 px-4">
        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
          UY<span className="text-emerald-600">BOZOR</span>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-400 mt-1">Admin Panel</span>
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => `
              flex items-center px-6 py-4 rounded-2xl transition-all duration-300 font-black text-sm
              ${isActive 
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 translate-x-2' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-emerald-400' : ''}`} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-black/5">
        <button
          onClick={logout}
          className="flex items-center w-full px-6 py-4 rounded-2xl transition-all duration-300 font-black text-sm text-red-500 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-4" />
          Chiqish
        </button>
      </div>
    </aside>
  );
};
