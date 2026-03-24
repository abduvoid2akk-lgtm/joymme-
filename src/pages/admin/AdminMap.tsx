import React from 'react';
import { useListings } from '../../context/ListingsContext';
import { MapPin, Home } from 'lucide-react';

export const AdminMap: React.FC = () => {
  const { listings } = useListings();
  const approvedListings = listings.filter(l => l.status === 'approved');

  return (
    <div className="space-y-12 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Xarita nazorati</h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Barcha e'lonlarning xaritadagi joylashuvi</p>
      </div>

      <div className="flex-1 bg-white rounded-[48px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden relative">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-[#F0F2F5] flex items-center justify-center">
          <div className="text-gray-300 flex flex-col items-center">
            <MapPin className="w-20 h-20 mb-4 animate-bounce opacity-20" />
            <span className="font-black uppercase tracking-[0.2em] text-xs">Xarita yuklanmoqda...</span>
          </div>
        </div>

        {/* Mock Pins */}
        <div className="absolute inset-0 p-12">
          {approvedListings.map((listing, index) => (
            <div 
              key={listing.id}
              className="absolute group cursor-pointer"
              style={{ 
                left: `${20 + (index * 15) % 60}%`, 
                top: `${20 + (index * 20) % 60}%` 
              }}
            >
              <div className="relative">
                <div className={`w-12 h-12 flex items-center justify-center rounded-[18px] shadow-2xl transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-500 ${listing.isVip ? 'bg-amber-500 shadow-amber-200' : 'bg-gray-900 shadow-gray-200'}`}>
                  <Home className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none w-64 bg-white p-4 rounded-[32px] shadow-2xl border border-black/5 z-10">
                  <img src={listing.image} alt="" className="w-full h-32 rounded-[24px] object-cover mb-4 shadow-lg" />
                  <div className="text-sm font-black text-gray-900 tracking-tight mb-1">{listing.title}</div>
                  <div className="text-xs text-emerald-600 font-black tracking-widest uppercase">${listing.price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Controls Overlay */}
        <div className="absolute top-8 right-8 space-y-3">
          <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[24px] shadow-2xl border border-white flex flex-col gap-2">
            <button className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-[18px] text-gray-900 font-black text-xl transition-all active:scale-90 shadow-sm">+</button>
            <div className="h-px bg-black/5 mx-2" />
            <button className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-[18px] text-gray-900 font-black text-xl transition-all active:scale-90 shadow-sm">-</button>
          </div>
        </div>

        <div className="absolute bottom-8 left-8">
          <div className="bg-white/80 backdrop-blur-xl px-8 py-4 rounded-full shadow-2xl border border-white flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
              <span className="text-gray-900">VIP</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-900 shadow-lg shadow-gray-200" />
              <span className="text-gray-900">Oddiy</span>
            </div>
            <div className="text-gray-400 pl-8 border-l border-black/5">
              Jami: {approvedListings.length} ta e'lon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
