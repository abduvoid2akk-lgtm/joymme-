import React, { useState } from 'react';
import { useListings } from '../../context/ListingsContext';
import { Trash2, Edit, Star, ShieldCheck, Filter, Search } from 'lucide-react';
import { Category } from '../../types';

export const AdminAllListings: React.FC = () => {
  const { listings, deleteListing, updateListing } = useListings();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredListings = listings.filter(l => {
    const matchesCategory = filter === 'all' || l.category === filter;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                         l.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleVip = (id: string, current: boolean) => {
    updateListing(id, { isVip: !current });
  };

  const toggleTop = (id: string, current: boolean) => {
    updateListing(id, { isTop: !current });
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Barcha e'lonlar</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Platformadagi barcha e'lonlarni boshqarish</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Qidirish..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-black/5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-xl shadow-black/5 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="px-8 py-4 bg-white border border-black/5 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-xl shadow-black/5 transition-all appearance-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Barcha kategoriyalar</option>
            <option value="uy">Hovli</option>
            <option value="kvartira">Kvartira</option>
            <option value="dom">Dom</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-black/5">
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">E'lon</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Narxi</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">VIP/TOP</th>
                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center space-x-5">
                      <img src={listing.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                      <div>
                        <div className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{listing.title}</div>
                        <div className="text-xs font-bold text-gray-400">{listing.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      listing.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      listing.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-8 font-black text-gray-900 text-lg">${listing.price.toLocaleString()}</td>
                  <td className="p-8">
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => toggleVip(listing.id, !!listing.isVip)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${listing.isVip ? 'bg-amber-400 text-white shadow-lg shadow-amber-100' : 'bg-gray-100 text-gray-300 hover:text-amber-400'}`}
                        title="VIP"
                      >
                        <Star className={`w-5 h-5 ${listing.isVip ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => toggleTop(listing.id, !!listing.isTop)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 ${listing.isTop ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-100 text-gray-300 hover:text-indigo-600'}`}
                        title="TOP"
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-900 hover:text-white transition-all active:scale-90">
                        <Edit className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => deleteListing(listing.id)}
                        className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-90 shadow-lg shadow-red-50"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
