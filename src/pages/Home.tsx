import React, { useState, useMemo } from 'react';
import { useListings } from '../context/ListingsContext';
import { VIPSection } from '../components/VIPSection';
import { TopSection } from '../components/TopSection';
import { FreeSection } from '../components/FreeSection';
import { FilterPanel } from '../components/FilterPanel';
import { Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

import { FloatingChatButton } from '../components/FloatingChatButton';

export const Home: React.FC = () => {
  const { listings } = useListings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'Sotuv' | 'Ijara' | 'Kunlik'>('Sotuv');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const isApproved = l.status === 'approved';
      const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           l.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
      const matchesPrice = l.price >= priceRange[0] && l.price <= priceRange[1];
      const matchesTab = l.dealType === activeTab;
      return isApproved && matchesSearch && matchesCategory && matchesPrice && matchesTab;
    });
  }, [listings, searchQuery, selectedCategory, priceRange, activeTab]);

  const vipListings = filteredListings.filter(l => l.isVip);
  const topListings = filteredListings.filter(l => l.isTop);
  const freeListings = filteredListings.filter(l => !l.isVip && !l.isTop);

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Section */}
      <div className="relative h-[350px] md:h-[500px] -mt-14 md:-mt-20 overflow-hidden w-full">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury Real Estate"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-2 md:mb-4 leading-none drop-shadow-2xl"
          >
            ORZUYINGIZDAGI <br />
            <span className="text-emerald-400 uppercase">UYNI TOPING</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/90 text-sm md:text-xl font-bold max-w-2xl drop-shadow-lg"
          >
            O'zbekistondagi eng sara ko'chmas mulk e'lonlari
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-8 md:space-y-12">
        {/* Filter Panel below Hero */}
        <div className="relative z-10">
          <FilterPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onOpenFilters={() => setShowFilters(true)}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <VIPSection listings={vipListings} />
        <TopSection listings={topListings} />
        <FreeSection listings={freeListings} />
      </div>

      <FloatingChatButton />

      {/* Advanced Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[48px] z-[101] p-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black text-gray-900">Batafsil filterlar</h3>
                <button onClick={() => setShowFilters(false)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">E’lon turi</label>
                  <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
                    {(['Sotuv', 'Ijara', 'Kunlik'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
                          activeTab === tab 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">Narx oralig'i ($)</label>
                  <div className="flex gap-6">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-gray-400 mb-2 block uppercase">Min</span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-gray-400 mb-2 block uppercase">Max</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-lg"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-emerald-600 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl shadow-emerald-200 active:scale-95 transition-all"
                >
                  NATIJALARNI KO'RSATISH
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
