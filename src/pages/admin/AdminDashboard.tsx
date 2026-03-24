import React from 'react';
import { useListings } from '../../context/ListingsContext';
import { useUser } from '../../context/UserContext';
import { 
  Home, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { listings } = useListings();
  const { users } = useUser();

  const stats = [
    { 
      label: 'Jami e\'lonlar', 
      value: listings.length, 
      icon: Home, 
      color: 'text-gray-900', 
      bg: 'bg-gray-100' 
    },
    { 
      label: 'Tasdiqlangan', 
      value: listings.filter(l => l.status === 'approved').length, 
      icon: CheckCircle, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
    { 
      label: 'Kutilayotgan', 
      value: listings.filter(l => l.status === 'pending').length, 
      icon: Clock, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50' 
    },
    { 
      label: 'Userlar soni', 
      value: users.length, 
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Dashboard</h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Platforma umumiy statistikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[32px] shadow-2xl shadow-black/5 border border-black/5 group hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-6">
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <TrendingUp className="w-6 h-6 text-gray-200 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{stat.value}</div>
            <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Oxirgi e'lonlar</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Barchasi</button>
          </div>
          <div className="space-y-6">
            {listings.slice(0, 5).map(listing => (
              <div key={listing.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-all group">
                <div className="flex items-center space-x-5">
                  <img src={listing.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                  <div>
                    <div className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{listing.title}</div>
                    <div className="text-xs font-bold text-gray-400">{listing.location}</div>
                  </div>
                </div>
                <div className="text-lg font-black text-gray-900">${listing.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">Yangi userlar</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Barchasi</button>
          </div>
          <div className="space-y-6">
            {users.slice(0, 5).map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-all group">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-900 font-black text-xl shadow-inner">
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                    <div className="text-xs font-bold text-gray-400">{user.username || user.email}</div>
                  </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
