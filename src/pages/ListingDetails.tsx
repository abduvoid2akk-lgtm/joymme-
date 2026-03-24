import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Share2, 
  Heart, 
  ChevronLeft, 
  Maximize2, 
  Bed, 
  Bath, 
  Square,
  MessageCircle,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { useListings } from '../context/ListingsContext';
import { useUser } from '../context/UserContext';
import { formatPrice } from '../utils/formatPrice';

export const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, addToHistory, favorites, toggleFavorite } = useListings();
  const { user } = useUser();

  const listing = listings.find((l) => l.id === id);

  useEffect(() => {
    if (id) {
      addToHistory(id);
    }
  }, [id, addToHistory]);

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tighter">E'lon topilmadi</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95"
        >
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  const isFavorite = favorites.includes(listing.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 pb-32">
      {/* Mobile Header Overlay */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:hidden">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-900 active:scale-90 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-gray-900 active:scale-90 transition-all">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => toggleFavorite(listing.id)}
            className={`w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all ${isFavorite ? 'text-red-500' : 'text-gray-900'}`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left Column: Images & Main Info */}
        <div className="lg:col-span-8 space-y-8">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-[40px] overflow-hidden bg-gray-100 aspect-[4/3] md:aspect-[16/9] shadow-2xl shadow-black/5 group"
          >
            <img 
              src={listing.image} 
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 right-6 flex gap-2">
              <button className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:bg-white transition-all">
                <Maximize2 size={14} />
                <span>Barcha rasmlar</span>
              </button>
            </div>
            {listing.isVip && (
              <div className="absolute top-6 left-6 bg-emerald-600 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                <TrendingUp size={14} />
                <span>Premium</span>
              </div>
            )}
          </motion.div>

          {/* Desktop Title & Stats */}
          <div className="hidden md:block">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-500 font-bold text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-emerald-600" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-emerald-600" />
                    <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-emerald-600 tracking-tighter mb-1">
                  {formatPrice(listing.price)}
                </div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Kelishilgan narx
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-black/5 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Bed className="mx-auto mb-3 text-emerald-600" size={24} />
              <div className="text-xl font-black text-gray-900">3</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Xonalar</div>
            </div>
            <div className="bg-white border border-black/5 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Bath className="mx-auto mb-3 text-emerald-600" size={24} />
              <div className="text-xl font-black text-gray-900">2</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Yuvinish</div>
            </div>
            <div className="bg-white border border-black/5 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <Square className="mx-auto mb-3 text-emerald-600" size={24} />
              <div className="text-xl font-black text-gray-900">120</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">m² Maydon</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-black/5 rounded-[32px] p-8 md:p-10 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Tavsif</h3>
            <p className="text-gray-600 font-medium leading-relaxed text-lg whitespace-pre-line">
              {listing.description || "Ushbu ko'chmas mulk barcha qulayliklarga ega. Zamonaviy dizayn, sifatli qurilish materiallari va qulay joylashuv. Yaqin atrofda maktab, bog'cha va supermarketlar mavjud. Batafsil ma'lumot uchun sotuvchi bilan bog'laning."}
            </p>
          </div>
        </div>

        {/* Right Column: Seller & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mobile Title & Price */}
          <div className="md:hidden space-y-4 px-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {listing.title}
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-black text-emerald-600 tracking-tighter">
                {formatPrice(listing.price)}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 font-bold text-xs">
                <MapPin size={14} className="text-emerald-600" />
                <span>{listing.location}</span>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white border border-black/5 rounded-[32px] p-8 shadow-xl shadow-black/5 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <img 
                  src={`https://picsum.photos/seed/${listing.authorId}/200/200`} 
                  alt={listing.authorName || 'Sotuvchi'}
                  className="w-16 h-16 rounded-2xl object-cover shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg shadow-lg">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-lg tracking-tight">{listing.authorName || 'Sotuvchi'}</h4>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Tasdiqlangan sotuvchi</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3 group uppercase tracking-widest">
                <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                <span>+998 90 123 45 67</span>
              </button>
              <button 
                onClick={() => navigate(`/chat/${listing.authorId}`)}
                className="w-full bg-white border-2 border-emerald-600 text-emerald-600 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                <MessageCircle size={18} />
                <span>Xabar yuborish</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-black/5">
              <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                <span>Sotuvchi haqida</span>
                <TrendingUp size={14} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-900 font-black">12</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest">E'lonlar</div>
                </div>
                <div>
                  <div className="text-gray-900 font-black">2 yil</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest">Tajriba</div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100">
            <h5 className="text-amber-800 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck size={16} />
              Xavfsizlik maslahatlari
            </h5>
            <ul className="space-y-3 text-amber-700 font-bold text-xs leading-relaxed">
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                Oldindan to'lov qilmang
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                Uchrashuvni xavfsiz joyda belgilang
              </li>
              <li className="flex gap-2">
                <span className="text-amber-400">•</span>
                Hujjatlarni diqqat bilan tekshiring
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
