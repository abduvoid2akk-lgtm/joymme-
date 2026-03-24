import React, { useState } from 'react';
import { Navigation, MapPin, Search, List, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Listing } from '../types';
import { useNavigate } from 'react-router-dom';

interface MapWithRadiusProps {
  listings: Listing[];
  onToggleView?: () => void;
}

export const MapWithRadius: React.FC<MapWithRadiusProps> = ({ listings, onToggleView }) => {
  const [radius, setRadius] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock filtering based on radius
  // In a real app, this would use lat/lng distance calculation
  const filteredListings = listings.filter((_, i) => {
    // Simulate distance: listings with higher index are "further"
    const mockDistance = (i * 1.5) + 2; 
    return mockDistance <= radius;
  });

  return (
    <div className="relative w-full h-full bg-[#F0F2F5] overflow-hidden shadow-2xl">
      {/* Map Background */}
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/69.240562,41.311081,12,0/1200x800?access_token=mock')] bg-cover bg-center opacity-60 grayscale-[0.2]" />
      
      {/* Top Navigation Overlay */}
      <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-20 flex flex-col md:flex-row items-center md:items-start justify-between gap-3 md:gap-4">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center w-full">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="p-3 md:p-4 bg-white border border-black/5 rounded-[20px] md:rounded-[24px] hover:bg-gray-50 transition-all shadow-2xl active:scale-90 shrink-0"
          >
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          
          {/* Search Bar */}
          <div className="flex bg-white rounded-full shadow-2xl overflow-hidden border border-black/5 w-full max-w-2xl">
            <input
              type="text"
              placeholder="Qidirish..."
              className="flex-1 px-5 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-900 focus:outline-none placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              className="bg-[#FFB800] hover:bg-[#F5B000] text-gray-900 px-6 md:px-10 py-3 md:py-4 text-xs md:text-sm font-black transition-colors flex items-center justify-center gap-2"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Topish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Radius Circle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ width: radius * 100, height: radius * 100 }}
          className="bg-[#3B82F6]/5 rounded-full flex items-center justify-center relative transition-all duration-500"
        >
          {/* Radius Label */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#3B82F6] text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">
            {radius} KM
          </div>
        </motion.div>
      </div>

      {/* Markers (Green Dots) */}
      {filteredListings.length > 0 && [...Array(Math.min(15, filteredListings.length * 2))].map((_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute w-3 h-3 bg-[#059669] rounded-full border-2 border-white shadow-lg"
          style={{ 
            left: `${40 + (Math.sin(i * 2.5) * (radius * 2) + 10)}%`, 
            top: `${40 + (Math.cos(i * 2.2) * (radius * 2) + 10)}%` 
          }}
        />
      ))}

      {/* Price Labels (Yellow) */}
      {filteredListings.map((l, i) => (
        <div
          key={l.id}
          className="absolute cursor-pointer group z-10"
          style={{ 
            left: `${45 + (Math.sin(i * 3) * (radius * 1.5) + 5)}%`, 
            top: `${45 + (Math.cos(i * 2.8) * (radius * 1.5) + 5)}%` 
          }}
        >
          <div className="relative">
            <div className="bg-[#FFB800] px-2 py-1 md:px-3 md:py-1.5 rounded-lg shadow-2xl border border-[#F5B000] font-black text-[8px] md:text-[10px] text-gray-900 whitespace-nowrap group-hover:scale-110 transition-transform tracking-tight">
              {l.price.toLocaleString()} y.e
            </div>
          </div>
        </div>
      ))}

      {/* No Listings Message */}
      {filteredListings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-[24px] shadow-2xl border border-black/5 text-gray-400 font-black text-sm uppercase tracking-widest">
            Ushbu radiusda e'lonlar mavjud emas
          </div>
        </div>
      )}

      {/* User Marker (Me) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="w-10 h-10 bg-[#059669] rounded-full border-[4px] border-white shadow-2xl flex items-center justify-center text-white font-black text-xs">
          me
        </div>
        <div className="w-16 h-16 bg-[#059669]/20 rounded-full absolute -left-3 -top-3 animate-pulse" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex flex-col gap-3 md:gap-4 z-20">
        <button className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-[18px] md:rounded-[24px] shadow-2xl text-gray-900 hover:text-[#3B82F6] transition-all active:scale-90 border border-black/5 flex items-center justify-center">
          <Navigation size={24} className="md:w-7 md:h-7" />
        </button>
        <div className="bg-white p-1.5 md:p-2 rounded-[18px] md:rounded-[24px] shadow-2xl flex flex-col items-center gap-2 md:gap-4 border border-black/5">
          <button onClick={() => setRadius(Math.min(20, radius + 1))} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-xl md:text-2xl hover:text-[#3B82F6] transition-colors">+</button>
          <div className="h-px w-6 md:w-8 bg-gray-100" />
          <button onClick={() => setRadius(Math.max(1, radius - 1))} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-black text-xl md:text-2xl hover:text-[#3B82F6] transition-colors">-</button>
        </div>
      </div>
    </div>
  );
};
