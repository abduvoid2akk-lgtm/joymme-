import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Bell, MessageCircle, PlusCircle, ChevronLeft, Menu, Search, User as UserIcon, Wallet, LogOut, Star, Settings } from 'lucide-react';
import { CustomUserIcon } from './CustomUserIcon';
import { useUser } from '../context/UserContext';
import { NotificationBell } from './NotificationBell';

export const Header: React.FC = () => {
  const { user, users, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 md:h-20 bg-white/80 backdrop-blur-md border-b border-black/5 z-50 px-3 md:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 md:gap-6">
        {!isHome && (
          <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 text-gray-900 md:hidden">
            <ChevronLeft size={20} />
          </button>
        )}
        <Link to="/" className="text-xl md:text-3xl font-black text-emerald-600 tracking-tighter">
          JOYMEE
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-4">
          <Link to="/" className={`flex items-center gap-2 font-black text-sm transition-colors ${location.pathname === '/' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>
            <Home size={18} />
            <span>Asosiy</span>
          </Link>
          <Link to="/search" className={`flex items-center gap-2 font-black text-sm transition-colors ${location.pathname === '/search' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>
            <Search size={18} />
            <span>Qidiruv</span>
          </Link>
          <Link to="/chat" className={`flex items-center gap-2 font-black text-sm transition-colors ${location.pathname.startsWith('/chat') ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>
            <MessageCircle size={18} />
            <span>Chat</span>
          </Link>
        </nav>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-1.5 md:gap-4">
        <Link
          to="/add"
          className="hidden md:flex bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <PlusCircle size={20} />
          <span>E'lon qo'shish</span>
        </Link>

        <NotificationBell />

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button 
              onMouseEnter={() => setIsProfileOpen(true)}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full border border-black/5 hover:bg-gray-100 transition-all"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <CustomUserIcon size={16} />
                </div>
              )}
              <span className="hidden lg:block text-sm font-black text-gray-700">{user.name.split(' ')[0]}</span>
            </button>

            {isProfileOpen && (
              <div 
                onMouseLeave={() => setIsProfileOpen(false)}
                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden z-50 py-2"
              >
                <div className="px-6 py-4 border-b border-black/5 bg-gray-50/50">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Balans</div>
                  <div className="text-xl font-black text-emerald-600">{(user.balance || 0).toLocaleString()} so'm</div>
                </div>
                
                <Link to="/profile" className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-gray-700 font-bold">
                  <UserIcon size={20} className="text-gray-400" />
                  Profil
                </Link>
                <Link to="/profile?tab=settings" className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-gray-700 font-bold">
                  <Settings size={20} className="text-gray-400" />
                  Sozlamalar
                </Link>
                <Link to="/profile?tab=balance" className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-gray-700 font-bold">
                  <Wallet size={20} className="text-gray-400" />
                  Balans va To'lovlar
                </Link>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-red-600 font-bold border-t border-black/5"
                >
                  <LogOut size={20} />
                  Chiqish
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="bg-gray-900 text-white px-4 py-2 md:px-8 md:py-3 rounded-xl md:rounded-2xl font-black text-sm md:text-base hover:bg-black transition-all">
            Kirish
          </Link>
        )}
      </div>
    </header>
  );
};
