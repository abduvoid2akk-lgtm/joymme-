import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useListings } from '../context/ListingsContext';
import { ListingCard } from '../components/ListingCard';
import { Settings, LogOut, ShieldCheck, Heart, List, Clock, ChevronRight, Wallet, Plus, History, CreditCard } from 'lucide-react';
import { CustomUserIcon } from '../components/CustomUserIcon';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export const UserProfile: React.FC = () => {
  const { user, logout, updateProfile, topUpBalance } = useUser();
  const { listings, favorites } = useListings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = React.useState(searchParams.get('tab') || 'listings');
  const [twoFactor, setTwoFactor] = React.useState(true);
  const [notifications, setNotifications] = React.useState({
    messages: true,
    status: true
  });
  const [language, setLanguage] = React.useState('uz');
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showTopUpModal, setShowTopUpModal] = React.useState(false);
  const [topUpAmount, setTopUpAmount] = React.useState('');
  const [selectedMethod, setSelectedMethod] = React.useState('');
  const [passwordData, setPasswordData] = React.useState({ current: '', new: '', confirm: '' });
  const [isSaving, setIsSaving] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Profile Edit State
  const [editData, setEditData] = React.useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || !selectedMethod) return;
    topUpBalance(parseInt(topUpAmount), selectedMethod);
    setShowTopUpModal(false);
    setTopUpAmount('');
    setSelectedMethod('');
    setSuccessMessage('Balans muvaffaqiyatli to\'ldirildi!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    setSuccessMessage('Parol muvaffaqiyatli o\'zgartirildi!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSuccessMessage('Sozlamalar saqlandi!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateProfile(editData);
    setIsSaving(false);
    setSuccessMessage('Profil muvaffaqiyatli yangilandi!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditData({ ...editData, avatar: event.target.result as string });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const userListings = listings.filter(l => l.authorId === user?.id);
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  if (!user) return <div className="py-24 text-center font-black text-2xl">Iltimos, tizimga kiring</div>;

  const menuItems = [
    { id: 'listings', icon: List, label: 'Mening e\'lonlarim', count: userListings.length },
    { id: 'favorites', icon: Heart, label: 'Saqlanganlar', count: favorites.length },
    { id: 'balance', icon: Wallet, label: 'Balans va To\'lovlar', count: null },
    { id: 'security', icon: ShieldCheck, label: 'Xavfsizlik', count: null },
    { id: 'settings', icon: Settings, label: 'Sozlamalar', count: null },
  ];

  const paymentMethods = [
    { id: 'uzum', name: 'Uzum Pay', color: 'bg-purple-600' },
    { id: 'click', name: 'Click', color: 'bg-blue-500' },
    { id: 'payme', name: 'Payme', color: 'bg-cyan-500' },
    { id: 'uzcard', name: 'Uzcard', color: 'bg-indigo-600' },
    { id: 'humo', name: 'Humo', color: 'bg-orange-500' }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-12 pb-32 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 mb-6 md:mb-12">
        <div className="relative">
          {user.avatar ? (
            <img src={user.avatar} className="w-20 h-20 md:w-40 md:h-40 rounded-2xl md:rounded-[40px] object-cover border-2 md:border-4 border-emerald-50 shadow-xl" alt={user.name} />
          ) : (
            <div className="w-20 h-20 md:w-40 md:h-40 rounded-2xl md:rounded-[40px] bg-gray-100 flex items-center justify-center text-gray-400 border-2 md:border-4 border-emerald-50 shadow-xl">
              <CustomUserIcon size={32} className="md:w-20 md:h-20" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-emerald-600 text-white p-1 md:p-3 rounded-lg md:rounded-2xl shadow-xl border-2 md:border-4 border-white">
            <ShieldCheck size={14} className="md:w-6 md:h-6" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-4xl font-black text-gray-900 tracking-tight mb-0.5 md:mb-2">{user.name}</h2>
          <p className="text-gray-500 font-bold text-xs md:text-base mb-3 md:mb-6">{user.phone}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-3">
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 md:px-5 md:py-2 rounded-full text-[7px] md:text-xs font-black uppercase tracking-widest border border-emerald-100">TASDIQLANGAN</span>
            <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-black">
              <Wallet size={14} className="text-emerald-400" />
              {(user.balance || 0).toLocaleString()} so'm
            </div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} className="p-2 md:p-5 text-red-500 hover:bg-red-50 rounded-xl md:rounded-3xl transition-all active:scale-90">
          <LogOut size={20} className="md:w-8 md:h-8" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-16">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setActiveTab(item.id)}
            className={`p-4 md:p-6 rounded-2xl md:rounded-[32px] border transition-all group cursor-pointer flex items-center justify-between ${
              activeTab === item.id 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200' 
                : 'bg-white border-black/5 text-gray-900 hover:shadow-2xl'
            }`}
          >
            <div className="flex items-center gap-3 md:gap-5">
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${
                activeTab === item.id ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'
              }`}>
                <item.icon size={20} className="md:w-7 md:h-7" />
              </div>
              <div>
                <p className="font-black text-sm md:text-lg">{item.label}</p>
                {item.count !== null && (
                  <p className={`text-[8px] md:text-xs font-bold uppercase tracking-widest ${
                    activeTab === item.id ? 'text-emerald-100' : 'text-gray-400'
                  }`}>
                    {item.count} TA ELEMENT
                  </p>
                )}
              </div>
            </div>
            <ChevronRight size={18} className={`md:w-6 md:h-6 transition-all ${
              activeTab === item.id ? 'text-white' : 'text-gray-200 group-hover:text-emerald-600'
            }`} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'listings' && (
          <motion.section
            key="listings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Mening e'lonlarim</h3>
              <Link to="/add" className="bg-emerald-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm shadow-lg hover:bg-emerald-700 transition-all active:scale-95 uppercase tracking-widest">Yangi qo'shish</Link>
            </div>
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                {userListings.map((listing) => (
                  <div key={listing.id} className="relative group">
                    <ListingCard listing={listing} />
                    <div className="absolute top-4 right-14 flex gap-2">
                      <Link
                        to={`/add?edit=true&id=${listing.id}`}
                        className="bg-white/90 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-xl border border-white/20"
                        title="Tahrirlash"
                      >
                        <Settings size={16} className="md:w-5 md:h-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] md:rounded-[40px] p-10 md:p-20 text-center border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold mb-4 md:mb-6 text-sm md:text-base">Sizda hali e'lonlar yo'q</p>
                <Link to="/add" className="text-emerald-600 font-black hover:underline text-sm md:text-base">Birinchi e'lonni qo'shing</Link>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'balance' && (
          <motion.section
            key="balance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 md:space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-gray-900 rounded-3xl md:rounded-[40px] p-6 md:p-10 text-white space-y-6 md:space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-500/10 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 blur-3xl"></div>
                <div className="space-y-1 md:space-y-2 relative">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">Joriy balans</p>
                  <h3 className="text-3xl md:text-5xl font-black">{(user.balance || 0).toLocaleString()} so'm</h3>
                </div>
                <button 
                  onClick={() => setShowTopUpModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-sm md:text-lg transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-emerald-900/20"
                >
                  <Plus size={20} className="md:w-6 md:h-6" />
                  BALANSNI TO'LDIRISH
                </button>
              </div>

              <div className="bg-white rounded-3xl md:rounded-[40px] p-6 md:p-8 border border-black/5 space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-2">
                    <History size={18} className="text-emerald-600 md:w-5 md:h-5" />
                    Oxirgi to'lovlar
                  </h4>
                </div>
                <div className="space-y-3 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-1 md:pr-2 no-scrollbar">
                  {user.paymentHistory && user.paymentHistory.length > 0 ? (
                    user.paymentHistory.map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border border-black/5">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${record.type === 'topup' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {record.type === 'topup' ? <Plus size={16} className="md:w-[18px] md:h-[18px]" /> : <CreditCard size={16} className="md:w-[18px] md:h-[18px]" />}
                          </div>
                          <div>
                            <div className="font-black text-xs md:text-sm text-gray-900 line-clamp-1">{record.description}</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase">{new Date(record.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className={`font-black text-xs md:text-base whitespace-nowrap ${record.type === 'topup' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {record.type === 'topup' ? '+' : '-'}{record.amount.toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 md:py-10 text-gray-400 font-bold text-xs md:text-sm">To'lovlar tarixi mavjud emas</div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeTab === 'favorites' && (
          <motion.section
            key="favorites"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Saqlangan e'lonlar</h3>
            {favoriteListings.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                {favoriteListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] md:rounded-[40px] p-10 md:p-20 text-center border border-dashed border-gray-200">
                <Heart size={32} className="mx-auto text-gray-200 mb-4 md:w-12 md:h-12" />
                <p className="text-gray-400 font-bold mb-4 md:mb-6 text-sm md:text-base">Sizda hali saqlangan e'lonlar yo'q</p>
                <Link to="/" className="text-emerald-600 font-black hover:underline text-sm md:text-base">E'lonlarni ko'rish</Link>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'security' && (
          <motion.section
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl md:rounded-[40px] p-5 md:p-10 border border-black/5 space-y-4 md:space-y-8"
          >
            <h3 className="text-lg md:text-3xl font-black text-gray-900 tracking-tight">Xavfsizlik sozlamalari</h3>
            
            <div className="bg-amber-50 border border-amber-100 p-4 md:p-6 rounded-xl md:rounded-3xl">
              <h4 className="text-xs md:text-base font-black text-amber-900 mb-1 md:mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="md:w-5 md:h-5" />
                Xavfsizlik bo'yicha tavsiyalar
              </h4>
              <ul className="text-[10px] md:text-sm text-amber-800 space-y-1 md:space-y-2 font-medium list-disc ml-4 md:ml-5">
                <li>Hech qachon parolingizni boshqalarga bermang.</li>
                <li>Shubhali havolalarga kirmang.</li>
                <li>Muntazam ravishda parolingizni yangilab turing.</li>
                <li>Ikki bosqichli tasdiqlashni yoqib qo'ying.</li>
              </ul>
            </div>

            <div className="space-y-3 md:space-y-6">
              <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-3xl border border-black/5">
                <div>
                  <p className="text-xs md:text-base font-black text-gray-900">Ikki bosqichli tasdiqlash</p>
                  <p className="text-[10px] md:text-sm text-gray-500 font-medium">Hisobingizni qo'shimcha himoya qiling</p>
                </div>
                <div 
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-10 h-6 md:w-14 md:h-8 rounded-full relative cursor-pointer transition-all ${twoFactor ? 'bg-emerald-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 md:top-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-all ${twoFactor ? 'right-0.5 md:right-1' : 'left-0.5 md:left-1'}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-3xl border border-black/5">
                <div>
                  <p className="text-xs md:text-base font-black text-gray-900">Parolni o'zgartirish</p>
                  <p className="text-[10px] md:text-sm text-gray-500 font-medium">Oxirgi marta 3 oy oldin o'zgartirilgan</p>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="text-emerald-600 font-black text-[10px] md:text-sm hover:underline"
                >
                  O'ZGARTIRISH
                </button>
              </div>
              
              <div className="p-4 md:p-6 bg-gray-50 rounded-xl md:rounded-3xl border border-black/5">
                <p className="text-xs md:text-base font-black text-gray-900 mb-1 md:mb-2">Faol seanslar</p>
                <div className="flex items-center justify-between text-[10px] md:text-sm">
                  <span className="text-gray-500 font-medium">iPhone 13 Pro • Toshkent</span>
                  <span className="text-emerald-600 font-black">HOZIR FAOL</span>
                </div>
              </div>

              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full bg-emerald-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? 'SAQLANMOQDA...' : 'XAVFSIZLIKNI SAQLASH'}
              </button>
            </div>
          </motion.section>
        )}

        {activeTab === 'settings' && (
          <motion.section
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[40px] p-10 border border-black/5 space-y-8"
          >
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Profil sozlamalari</h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[32px] overflow-hidden bg-gray-100 border-4 border-emerald-50 shadow-xl">
                    {editData.avatar ? (
                      <img src={editData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <CustomUserIcon size={64} />
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] cursor-pointer text-white font-black text-xs uppercase tracking-widest">
                    O'zgartirish
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Profil rasmini yuklang</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ism va familiya</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Telefon raqam</label>
                  <input 
                    type="tel"
                    required
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                <h4 className="text-xl font-black text-gray-900 mb-6">Tizim sozlamalari</h4>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Til</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    >
                      <option value="uz">O'zbekcha</option>
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Xabarnomalar</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setNotifications({...notifications, messages: !notifications.messages})}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${notifications.messages ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'}`}>
                          {notifications.messages && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="font-bold text-gray-700">Yangi xabarlar haqida bildirishnoma</span>
                      </div>
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setNotifications({...notifications, status: !notifications.status})}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${notifications.status ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-gray-300'}`}>
                          {notifications.status && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="font-bold text-gray-700">E'lonlar holati o'zgarganda bildirishnoma</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? 'SAQLANMOQDA...' : 'PROFILNI SAQLASH'}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3"
          >
            <ShieldCheck size={24} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Up Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTopUpModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl md:rounded-[40px] p-6 md:p-10 shadow-2xl"
            >
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-4 md:mb-6">Balansni to'ldirish</h3>
              <form onSubmit={handleTopUp} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3 ml-1">To'lov usuli</label>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-1 md:gap-2 ${
                          selectedMethod === method.id 
                            ? 'border-emerald-600 bg-emerald-50' 
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${method.color} flex items-center justify-center text-white font-black text-[8px] md:text-[10px]`}>
                          {method.name[0]}
                        </div>
                        <span className="text-[10px] md:text-xs font-black text-gray-700">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2 ml-1">Summa (so'm)</label>
                  <input 
                    required
                    type="number"
                    min="1000"
                    placeholder="10 000"
                    className="w-full bg-gray-50 border border-black/5 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm md:text-base"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>
                <div className="pt-2 md:pt-4 flex gap-2 md:gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowTopUpModal(false)}
                    className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                  >
                    BEKOR QILISH
                  </button>
                  <button 
                    type="submit"
                    disabled={!topUpAmount || !selectedMethod}
                    className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    TO'LDIRISH
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-gray-900 mb-6">Parolni o'zgartirish</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Joriy parol</label>
                  <input 
                    required
                    type="password"
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Yangi parol</label>
                  <input 
                    required
                    type="password"
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Yangi parolni tasdiqlang</label>
                  <input 
                    required
                    type="password"
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                  >
                    BEKOR QILISH
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving || passwordData.new !== passwordData.confirm}
                    className="flex-1 py-4 rounded-2xl font-black text-sm bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'SAQLANMOQDA...' : 'SAQLASH'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl flex items-center gap-3"
          >
            <ShieldCheck size={24} />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
