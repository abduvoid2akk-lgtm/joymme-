import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, List, Map as MapIcon, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_LISTINGS } from '../mockData';
import { ListingCard } from '../components/ListingCard';

export const Search: React.FC = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(5); // km
  const [mapCenter, setMapCenter] = useState({ lat: 41.311081, lng: 69.240562 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col -mx-4">
      {/* Search Header */}
      <div className="bg-white border-b border-black/5 p-4 flex gap-2 z-10">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Hududni qidiring..."
            className="w-full bg-gray-50 border border-black/5 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none text-sm"
          />
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="bg-gray-900 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg"
        >
          {viewMode === 'map' ? <List size={18} /> : <MapIcon size={18} />}
          <span>{viewMode === 'map' ? 'Ro\'yxat' : 'Xarita'}</span>
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-100"
            >
              {/* Mock Map Background */}
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/69.240562,41.311081,12,0/800x800?access_token=mock')] bg-cover bg-center opacity-50" />
              
              {/* Radius Circle Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                  className="border-2 border-emerald-500/30 bg-emerald-500/10 rounded-full transition-all duration-500"
                  style={{ width: `${radius * 40}px`, height: `${radius * 40}px` }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded-t-lg">
                    {radius} km radius
                  </div>
                </div>
              </div>

              {/* Markers */}
              {MOCK_LISTINGS.map((l) => (
                <div
                  key={l.id}
                  className="absolute cursor-pointer group"
                  style={{ 
                    left: `${50 + (l.lng - 69.240562) * 500}%`, 
                    top: `${50 - (l.lat - 41.311081) * 500}%` 
                  }}
                >
                  <div className="bg-white px-2 py-1 rounded-lg shadow-xl border border-black/5 font-bold text-xs text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-110">
                    ${(l.price / 1000).toFixed(0)}k
                  </div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mx-auto mt-1 shadow-lg" />
                </div>
              ))}

              {/* User Marker */}
              {userLocation && (
                <div
                  className="absolute"
                  style={{ left: '50%', top: '50%' }}
                >
                  <div className="bg-indigo-600 text-white px-3 py-1 rounded-full shadow-xl font-bold text-xs animate-bounce">
                    Me
                  </div>
                  <div className="w-4 h-4 bg-indigo-600/30 rounded-full absolute -left-0 -top-0 animate-ping" />
                </div>
              )}

              {/* Map Controls */}
              <div className="absolute bottom-8 right-4 flex flex-col gap-2">
                <button className="p-3 bg-white rounded-2xl shadow-xl text-gray-600 hover:text-emerald-600 transition-colors">
                  <Navigation size={20} />
                </button>
                <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col items-center gap-2">
                  <button onClick={() => setRadius(Math.min(20, radius + 1))} className="w-8 h-8 flex items-center justify-center font-bold text-lg">+</button>
                  <div className="h-px w-6 bg-gray-100" />
                  <button onClick={() => setRadius(Math.max(1, radius - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-lg">-</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 overflow-y-auto p-4 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_LISTINGS.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
