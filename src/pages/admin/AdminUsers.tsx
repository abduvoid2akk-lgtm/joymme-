import React from 'react';
import { useUser } from '../../context/UserContext';
import { useListings } from '../../context/ListingsContext';
import { Ban, CheckCircle, User as UserIcon, Mail, Phone, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminUsers: React.FC = () => {
  const { users, blockUser, unblockUser } = useUser();
  const { listings } = useListings();

  const getUserListingCount = (userId: string) => {
    return listings.filter(l => l.authorId === userId).length;
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Userlar boshqaruvi</h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Platforma foydalanuvchilari ro'yxati va ularning holati</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`p-8 rounded-[40px] shadow-2xl shadow-black/5 border flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:scale-[1.01] transition-all ${
              user.isBlocked 
                ? 'bg-gray-50/80 border-red-100 grayscale-[0.5]' 
                : 'bg-white border-black/5'
            }`}
          >
            <div className="flex items-center space-x-8">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-3xl font-black shadow-inner overflow-hidden transition-all ${
                user.isBlocked ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-900'
              }`}>
                {user.avatar ? (
                  <img src={user.avatar} alt="" className={`w-full h-full object-cover ${user.isBlocked ? 'grayscale' : ''}`} />
                ) : (user.name?.[0] || 'U')}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className={`text-2xl font-black tracking-tighter transition-colors ${user.isBlocked ? 'text-gray-400' : 'text-gray-900'}`}>{user.name}</h3>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.isBlocked 
                      ? 'bg-gray-200 text-gray-500' 
                      : user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {user.role}
                  </span>
                  {user.isBlocked && (
                    <motion.span 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-4 py-1 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100"
                    >
                      Bloklangan
                    </motion.span>
                  )}
                </div>
                <div className="flex flex-wrap gap-6 text-sm font-bold text-gray-400">
                  <div className="flex items-center">
                    <Mail className={`w-4 h-4 mr-2 ${user.isBlocked ? 'text-gray-300' : 'text-gray-300'}`} />
                    {user.username || user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className={`w-4 h-4 mr-2 ${user.isBlocked ? 'text-gray-300' : 'text-gray-300'}`} />
                      {user.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-2 ${user.isBlocked ? 'text-gray-300' : 'text-gray-300'}`} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-12">
              <div className="text-center px-8 border-x border-black/5">
                <div className={`text-3xl font-black tracking-tighter ${user.isBlocked ? 'text-gray-400' : 'text-gray-900'}`}>{getUserListingCount(user.id)}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">E'lonlar</div>
              </div>
              
              <div className="flex items-center gap-3">
                {user.role !== 'admin' && (
                  user.isBlocked ? (
                    <button 
                      onClick={() => unblockUser(user.id)}
                      className="flex items-center px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-90 shadow-xl shadow-emerald-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Blokdan yechish
                    </button>
                  ) : (
                    <button 
                      onClick={() => blockUser(user.id)}
                      className="flex items-center px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-lg shadow-red-50"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Bloklash
                    </button>
                  )
                )}
                <button className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${
                  user.isBlocked ? 'bg-gray-200 text-gray-400' : 'bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}>
                  <UserIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
