import React from 'react';
import { useListings } from '../context/ListingsContext';
import { ListingCard } from '../components/ListingCard';
import { ChevronLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const HistoryPage: React.FC = () => {
  const { listings, history } = useListings();
  const navigate = useNavigate();

  const historyListings = history
    .map(id => listings.find(l => l.id === id))
    .filter((l): l is any => !!l);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 pb-32">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 text-gray-500 font-black hover:text-gray-900 transition-colors uppercase tracking-widest text-xs"
      >
        <ChevronLeft size={20} />
        Orqaga qaytish
      </button>

      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-[24px] bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Clock size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ko'rilganlar</h1>
          <p className="text-gray-500 font-bold">Siz oxirgi marta ko'rgan e'lonlar ro'yxati</p>
        </div>
      </div>

      {historyListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {historyListings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[48px] p-20 text-center border border-dashed border-gray-200">
          <Clock size={64} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-black text-gray-900 mb-2">Hali hech narsa ko'rmagansiz</h3>
          <p className="text-gray-400 font-bold mb-8">E'lonlarni ko'rishni boshlang va ular shu yerda paydo bo'ladi</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
          >
            E'LONLARNI KO'RISH
          </button>
        </div>
      )}
    </div>
  );
};
