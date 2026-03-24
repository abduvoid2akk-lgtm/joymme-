import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Camera, Mic, MapPin, CheckCircle2, Loader2, ChevronRight, ChevronLeft, Trash2, Play, Square, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingsContext';
import { useUser } from '../context/UserContext';
import { formatPhoneNumber } from '../utils/formatters';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Listing } from '../types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

type Role = 'seller' | 'buyer' | null;
type Purpose = 'daily_rent' | 'rent' | 'sell' | 'buy_rent' | 'buy' | null;
type PropertyType = 'apartment' | 'house' | 'hotel' | null;

interface FormData {
  images: string[];
  title: string;
  description: string;
  audio: string | null;
  postedBy: 'rieltor' | 'owner' | null;
  buildingType: 'secondary' | 'new' | null;
  phone: string;
  rooms: string;
  area: string;
  renovation: string;
  price: string;
  priceCurrency: 'sum' | 'rubl';
  country: string;
  region: string;
  district: string;
  lat: number;
  lng: number;
  // Hotel specific
  roomType: string;
  breakfast: 'ha' | 'yo\'q' | null;
  hotelCategory: string;
  // Apartment/House specific
  floor: string;
  totalFloors: string;
  // Promotion
  promotionType: 'vip' | 'top' | 'ordinary';
  tariff: 'standart' | 'turbo' | 'premium' | 'custom';
  boostDays: number;
  topDays: number;
  vipDays: number;
}

const TARIFFS = {
  standart: {
    name: 'Standart',
    price: 10000,
    features: [
      '5x ko’proq ko’rishlar',
      '7 kun TOP',
      '7 kun tepaga ko’tariladi',
      'Bugungacha 512 ta uy sotilgan'
    ]
  },
  turbo: {
    name: 'Turbo ⭐️',
    price: 25000,
    features: [
      '10x ko’proq ko’rishlar',
      '10 kun VIP',
      '15 kun TOP',
      '20 kun tepaga ko’tariladi',
      'Bugungacha 1956 ta uy sotilgan'
    ]
  },
  premium: {
    name: 'Premium ⚡️',
    price: 50000,
    features: [
      'Turbodan 3x kuchliroq',
      'Maksimal ko’rishlar',
      '30 kun VIP',
      '30 kun TOP',
      '30 kun tepaga ko’tariladi',
      'Bugungacha 3201 ta uy sotilgan'
    ]
  }
};

const CUSTOM_PRICES = {
  boost: 2000,
  top: 5000,
  vip: 10000
};

const COUNTRIES = [
  "O'zbekiston", "UAE(Dubai)", "Kyrgyzstan", "Turkmeniston", "Afghanistan", "Tajikistan", "Turkey", "Russia", "China"
];

const UZBEKISTAN_REGIONS: Record<string, string[]> = {
  "Toshkent shahri": ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Yashnobod", "Shayxontohur", "Olmazor", "Sergeli", "Yakkasaroy", "Bektemir", "Mirobod", "Uchtepa"],
  "Toshkent viloyati": ["Angren", "Olmaliq", "Chirchiq", "Bekobod", "Yangiyo'l", "Qibray", "Zangiota", "Parkent"],
  "Samarqand": ["Samarqand shahri", "Pastdarg'om", "Urgut", "Bulung'ur", "Narpay"],
  "Buxoro": ["Buxoro shahri", "G'ijduvon", "Kogon", "Qorako'l"],
  "Andijon": ["Andijon shahri", "Asaka", "Shahrixon", "Xonobod"],
  "Farg'ona": ["Farg'ona shahri", "Qo'qon", "Marg'ilon", "Quva"],
  "Namangan": ["Namangan shahri", "Chust", "Pop", "Uychi"],
  "Xorazm": ["Urganch", "Xiva", "Gurlan", "Bog'ot"],
  "Navoiy": ["Navoiy shahri", "Zarafshon", "Uchquduq", "Karmana"],
  "Qashqadaryo": ["Qarshi", "Shahrisabz", "Kitob", "G'uzor"],
  "Surxondaryo": ["Termiz", "Denov", "Sherobod", "Jarqo'rg'on"],
  "Jizzax": ["Jizzax shahri", "Zomin", "G'allaorol", "Paxtakor"],
  "Sirdaryo": ["Guliston", "Yangiyer", "Shirin", "Sardoba"],
  "Qoraqalpog'iston": ["Nukus", "Xo'jayli", "Qo'ng'irot", "To'rtko'l"]
};

const MapPicker: React.FC<{ lat: number; lng: number; onChange: (lat: number, lng: number) => void }> = ({ lat, lng, onChange }) => {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState({ lat, lng });

  const onMapClick = useCallback((e: any) => {
    const newLat = e.detail.latLng.lat;
    const newLng = e.detail.latLng.lng;
    setMarkerPos({ lat: newLat, lng: newLng });
    onChange(newLat, newLng);
  }, [onChange]);

  return (
    <Map
      defaultCenter={{ lat, lng }}
      defaultZoom={13}
      mapId="DEMO_MAP_ID"
      onClick={onMapClick}
      {...({ internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'] } as any)}
      style={{ width: '100%', height: '100%' }}
    >
      <AdvancedMarker position={markerPos}>
        <Pin background="#10b981" glyphColor="#fff" borderColor="#064e3b" />
      </AdvancedMarker>
    </Map>
  );
};

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i + 1 <= currentStep 
              ? 'w-8 bg-emerald-600' 
              : 'w-2 bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export const AddListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('id');
  const isEditing = searchParams.get('edit') === 'true' && !!listingId;
  
  const { listings, addListing, updateListing } = useListings();
  const { user } = useUser();

  const [step, setStep] = useState(1); // 1: Role/Purpose, 2: Property Type, 3: Main Form, 4: Promotion, 5: Success
  const [role, setRole] = useState<Role>(null);
  const [purpose, setPurpose] = useState<Purpose>(null);
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    images: [],
    title: '',
    description: '',
    audio: null,
    postedBy: null,
    buildingType: null,
    phone: '+998 ',
    rooms: '',
    area: '',
    renovation: '',
    price: '',
    priceCurrency: 'sum',
    country: "O'zbekiston",
    region: '',
    district: '',
    lat: 41.2995,
    lng: 69.2401,
    roomType: '',
    breakfast: null,
    hotelCategory: '',
    floor: '',
    totalFloors: '',
    promotionType: 'ordinary',
    tariff: 'standart',
    boostDays: 0,
    topDays: 0,
    vipDays: 0,
  });

  useEffect(() => {
    if (isEditing && listings.length > 0) {
      const listing = listings.find(l => l.id === listingId);
      if (listing) {
        // Map listing data to formData
        setFormData({
          ...formData,
          title: listing.title,
          description: listing.description || '',
          price: listing.price.toString(),
          promotionType: listing.promotionType || 'ordinary',
          tariff: listing.tariff || 'standart',
          boostDays: listing.boostDays || 0,
          topDays: listing.topDays || 0,
          vipDays: listing.vipDays || 0,
          lat: listing.lat,
          lng: listing.lng,
          images: listing.images || [listing.image],
          phone: listing.phone || '+998 ',
          rooms: listing.rooms || '',
          area: listing.area || '',
          renovation: listing.renovation || '',
          floor: listing.floor || '',
          totalFloors: listing.totalFloors || '',
          postedBy: listing.postedBy as any || null,
          buildingType: listing.buildingType as any || null,
          roomType: listing.roomType || '',
          breakfast: listing.breakfast as any || null,
          hotelCategory: listing.hotelCategory || '',
          priceCurrency: listing.priceCurrency || 'sum',
          country: listing.country || "O'zbekiston",
          region: listing.location.split(',')[0].trim(),
          district: listing.location.split(',')[1]?.trim() || '',
        });
        // Set steps and types based on listing
        setStep(3); // Go straight to main form
        if (listing.category === 'kvartira') setPropertyType('apartment');
        else if (listing.category === 'uy') setPropertyType('house');
        else setPropertyType('hotel');
      }
    }
  }, [isEditing, listingId, listings]);

  const calculateTotalPrice = () => {
    if (formData.tariff === 'custom') {
      return (formData.boostDays * CUSTOM_PRICES.boost) + 
             (formData.topDays * CUSTOM_PRICES.top) + 
             (formData.vipDays * CUSTOM_PRICES.vip);
    }
    if (formData.tariff === 'standart') return TARIFFS.standart.price;
    if (formData.tariff === 'turbo') return TARIFFS.turbo.price;
    if (formData.tariff === 'premium') return TARIFFS.premium.price;
    return 0;
  };

  const totalPrice = calculateTotalPrice();

  const canGoNext = () => {
    if (step === 3) {
      const basicValid = formData.images.length > 0 &&
                         formData.title.length >= 5 && 
                         formData.description.length >= 10 && 
                         formData.price !== '' && 
                         formData.region !== '' &&
                         formData.phone.length >= 17; // +998 XX XXX XX XX

      if (propertyType === 'apartment') {
        return basicValid && formData.rooms !== '' && formData.area !== '' && formData.floor !== '' && formData.totalFloors !== '';
      }
      if (propertyType === 'house') {
        return basicValid && formData.rooms !== '' && formData.area !== '' && formData.totalFloors !== '';
      }
      if (propertyType === 'hotel') {
        return basicValid && formData.roomType !== '' && formData.hotelCategory !== '';
      }
      return basicValid;
    }
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file as File));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10)
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (totalPrice > (user?.balance || 0)) {
      setError("Balansingizda yetarli mablag' mavjud emas. Iltimos, balansni to'ldiring.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (isEditing && listingId) {
      updateListing(listingId, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: `${formData.region}, ${formData.district}`,
        image: formData.images[0] || 'https://picsum.photos/seed/default/800/600',
        images: formData.images,
        promotionType: formData.promotionType,
        tariff: formData.tariff,
        boostDays: formData.boostDays,
        topDays: formData.topDays,
        vipDays: formData.vipDays,
        totalPrice: totalPrice,
        lat: formData.lat,
        lng: formData.lng,
        phone: formData.phone,
        rooms: formData.rooms,
        area: formData.area,
        renovation: formData.renovation,
        floor: formData.floor,
        totalFloors: formData.totalFloors,
        postedBy: formData.postedBy || undefined,
        buildingType: formData.buildingType || undefined,
        roomType: formData.roomType,
        breakfast: formData.breakfast || undefined,
        hotelCategory: formData.hotelCategory,
        priceCurrency: formData.priceCurrency,
        country: formData.country,
        isVip: formData.promotionType === 'vip',
        isTop: formData.promotionType === 'top',
        isFree: formData.promotionType === 'ordinary',
      });
    } else {
      const newListing: Listing = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: `${formData.region}, ${formData.district}`,
        category: (propertyType === 'apartment' ? 'kvartira' : propertyType === 'house' ? 'uy' : 'dom') as any,
        image: formData.images[0] || 'https://picsum.photos/seed/default/800/600',
        images: formData.images,
        status: 'pending' as const,
        dealType: 'Sotuv',
        promotionType: formData.promotionType,
        tariff: formData.tariff as any,
        boostDays: formData.boostDays,
        topDays: formData.topDays,
        vipDays: formData.vipDays,
        totalPrice: totalPrice,
        lat: formData.lat,
        lng: formData.lng,
        authorId: user?.id || 'anonymous',
        authorName: user?.name || 'Foydalanuvchi',
        createdAt: Date.now(),
        phone: formData.phone,
        rooms: formData.rooms,
        area: formData.area,
        renovation: formData.renovation,
        floor: formData.floor,
        totalFloors: formData.totalFloors,
        postedBy: formData.postedBy || undefined,
        buildingType: formData.buildingType || undefined,
        roomType: formData.roomType,
        breakfast: formData.breakfast || undefined,
        hotelCategory: formData.hotelCategory,
        priceCurrency: formData.priceCurrency,
        country: formData.country,
        isVip: formData.promotionType === 'vip',
        isTop: formData.promotionType === 'top',
        isFree: formData.promotionType === 'ordinary',
      };
      addListing(newListing);
    }

    setStep(5);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <StepIndicator currentStep={step} totalSteps={5} />
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 md:space-y-8"
          >
            <div className="text-center space-y-1 md:space-y-2">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">E'lon turini tanlang</h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Sizga qanday xizmat kerak?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Seller Section */}
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-2 md:ml-4">Sotuvchi sifatida</h3>
                <div className="space-y-2 md:space-y-3">
                  {[
                    { id: 'daily_rent', label: 'Kunlik ijaraga beraman' },
                    { id: 'rent', label: 'Ijaraga beraman' },
                    { id: 'sell', label: 'Sotaman' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setRole('seller');
                        setPurpose(p.id as Purpose);
                        setStep(2);
                      }}
                      className="w-full bg-white border border-black/5 p-4 md:p-6 rounded-xl md:rounded-[24px] flex items-center justify-between group hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all active:scale-[0.98]"
                    >
                      <span className="text-sm md:text-xl font-black text-gray-800">{p.label}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <ChevronRight size={18} className="md:w-6 md:h-6" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Buyer Section */}
              <div className="space-y-2 md:space-y-4">
                <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-2 md:ml-4">Xaridor sifatida</h3>
                <div className="space-y-2 md:space-y-3">
                  {[
                    { id: 'buy_rent', label: 'Ijaraga olaman' },
                    { id: 'buy', label: 'Sotib olaman' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setRole('buyer');
                        setPurpose(p.id as Purpose);
                        setStep(2);
                      }}
                      className="w-full bg-white border border-black/5 p-4 md:p-6 rounded-xl md:rounded-[24px] flex items-center justify-between group hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all active:scale-[0.98]"
                    >
                      <span className="text-sm md:text-xl font-black text-gray-800">{p.label}</span>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <ChevronRight size={18} className="md:w-6 md:h-6" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 md:space-y-8"
          >
            <button onClick={() => setStep(1)} className="flex items-center gap-1 md:gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors text-[10px] md:text-sm">
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
              ORQAGA
            </button>
            
            <div className="text-center space-y-1 md:space-y-2">
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Ko'chmas mulk turi</h2>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Nima haqida e'lon bermoqchisiz?</p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {[
                { id: 'apartment', label: 'Kvartira' },
                { id: 'house', label: 'Uy / Kottej' },
                { id: 'hotel', label: 'Mehmonxona' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setPropertyType(t.id as PropertyType);
                    setStep(3);
                  }}
                  className="w-full bg-white border border-black/5 p-5 md:p-8 rounded-2xl md:rounded-[32px] flex items-center justify-between group hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all active:scale-[0.99]"
                >
                  <span className="text-lg md:text-2xl font-black text-gray-800">{t.label}</span>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <ChevronRight size={20} className="md:w-7 md:h-7" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl md:rounded-[40px] p-5 md:p-12 shadow-2xl border border-black/5"
          >
            <div className="flex items-center justify-between mb-6 md:mb-12">
              <div className="flex items-center gap-4">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 md:gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors text-[10px] md:text-sm">
                  <ChevronLeft size={16} className="md:w-5 md:h-5" />
                  ORQAGA
                </button>
                {isEditing && (
                  <button onClick={() => navigate('/profile')} className="text-red-500 font-bold text-[10px] md:text-sm hover:text-red-700 transition-colors">
                    BEKOR QILISH
                  </button>
                )}
              </div>
              <div className="px-3 py-1 md:px-4 md:py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest">
                {isEditing ? "E'lonni tahrirlash" : "To'liq ma'lumot"}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-6 md:space-y-12">
              {/* 1. Images */}
              <div className="space-y-2 md:space-y-4">
                <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Rasmlar (maksimal 10 ta)</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <Trash2 size={16} className="md:w-6 md:h-6" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 10 && (
                    <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Camera className="text-gray-400 md:w-6 md:h-6" size={18} />
                      <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Yuklash</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              {/* 2. Title & 3. Description */}
              <div className="grid grid-cols-1 gap-4 md:gap-8">
                <div>
                  <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-3 ml-1">E'lon sarlavhasi</label>
                  <input
                    required
                    type="text"
                    placeholder="Masalan: Markazdagi shinam kvartira"
                    className="w-full bg-gray-50 border border-black/5 rounded-xl md:rounded-2xl py-3 md:py-5 px-4 md:px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs md:text-lg font-bold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 md:mb-3 ml-1">
                    <label className="block text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Tavsif</label>
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-400">{formData.description.length}/1000</span>
                  </div>
                  <textarea
                    required
                    maxLength={1000}
                    placeholder="Batafsil ma'lumot bering..."
                    rows={4}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl md:rounded-3xl py-3 md:py-5 px-4 md:px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-xs md:text-lg font-medium resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* 4. Audio */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Audio xabar</label>
                <div className="flex items-center gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 cursor-pointer hover:scale-110 transition-transform">
                    <Mic size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-indigo-900">Ovozli tavsif qo'shish</div>
                    <div className="text-xs font-bold text-indigo-400">Xaridorlar uchun qulayroq</div>
                  </div>
                </div>
              </div>

              {/* 5. Posted By & 6. Building Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Kim joylashtirdi</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'rieltor', label: 'Rieltor' },
                      { id: 'owner', label: 'Egasi' }
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, postedBy: b.id as any })}
                        className={`py-4 rounded-2xl font-black text-sm transition-all ${
                          formData.postedBy === b.id 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                            : 'bg-gray-50 text-gray-400 border border-black/5 hover:bg-gray-100'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                {propertyType !== 'house' && propertyType !== 'hotel' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Kvartira turi</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'secondary', label: 'Ikkinchi qo\'l' },
                        { id: 'new', label: 'Yangi bino' }
                      ].map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, buildingType: b.id as any })}
                          className={`py-4 rounded-2xl font-black text-sm transition-all ${
                            formData.buildingType === b.id 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                              : 'bg-gray-50 text-gray-400 border border-black/5 hover:bg-gray-100'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Phone & 8. Rooms/Capacity & 9. Area */}
              <div className={`grid grid-cols-1 ${propertyType === 'house' ? 'md:grid-cols-2' : propertyType === 'hotel' ? 'md:grid-cols-1' : 'md:grid-cols-3'} gap-8`}>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Telefon raqam</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                {propertyType !== 'hotel' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      {propertyType === 'house' ? "Uyingiz nechta odamga mo'ljallangan" : "Honalar soni"}
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    />
                  </div>
                )}
                {propertyType !== 'house' && propertyType !== 'hotel' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Maydon, m²</label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                )}
                {propertyType === 'house' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Maydon, sotix</label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {/* Hotel Specific Fields */}
              {propertyType === 'hotel' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Xona turi</label>
                    <select
                      required
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none"
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    >
                      <option value="">Tanlang...</option>
                      <option value="bir o'rinli">Bir o'rinli</option>
                      <option value="2 o'rinli">2 o'rinli</option>
                      <option value="3 o'rinli">3 o'rinli</option>
                      <option value="ko'proq">Ko'proq</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Nonushta</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'ha', label: 'Ha' },
                        { id: 'yo\'q', label: 'Yo\'q' }
                      ].map(b => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, breakfast: b.id as any })}
                          className={`py-4 rounded-2xl font-black text-sm transition-all ${
                            formData.breakfast === b.id 
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                              : 'bg-gray-50 text-gray-400 border border-black/5 hover:bg-gray-100'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Toifasi</label>
                    <select
                      required
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none"
                      value={formData.hotelCategory}
                      onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
                    >
                      <option value="">Tanlang...</option>
                      <option value="ekonom">Ekonom</option>
                      <option value="standart">Standart</option>
                      <option value="yarim lyuks">Yarim lyuks</option>
                      <option value="lyuks">Lyuks</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Apartment/House Specific Fields: Floor */}
              {(propertyType === 'apartment' || propertyType === 'house') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {propertyType === 'apartment' && (
                    <div>
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Qavati</label>
                      <input
                        required
                        type="number"
                        placeholder="0"
                        className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                      Uyning qavatlari soni
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* 10. Renovation & 11. Price */}
              <div className={`grid grid-cols-1 ${propertyType === 'house' || propertyType === 'hotel' ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
                {propertyType !== 'house' && propertyType !== 'hotel' && (
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Ta'mirlash</label>
                    <select
                      required
                      className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none"
                      value={formData.renovation}
                      onChange={(e) => setFormData({ ...formData, renovation: e.target.value })}
                    >
                      <option value="">Tanlang...</option>
                      <option value="kerak">Kerak</option>
                      <option value="kerak emas">Kerak emas</option>
                      <option value="kosmetik">Kosmetik</option>
                      <option value="yevro remont">Yevro remont</option>
                      <option value="dizaynerlik">Dizaynerlik</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                    Narxi {propertyType === 'house' ? '' : "(so'mda)"}
                  </label>
                  <div className="flex gap-3">
                    <input
                      required
                      type="number"
                      placeholder="0"
                      className="flex-1 bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    {propertyType === 'house' && (
                      <select
                        className="w-32 bg-gray-50 border border-black/5 rounded-2xl py-5 px-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none"
                        value={formData.priceCurrency}
                        onChange={(e) => setFormData({ ...formData, priceCurrency: e.target.value as any })}
                      >
                        <option value="sum">so'm</option>
                        <option value="rubl">rubl</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* 12. Country & 13. Region & 14. District */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Davlat</label>
                  <select
                    required
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, region: '', district: '' })}
                  >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Viloyat</label>
                  <select
                    required
                    disabled={formData.country !== "O'zbekiston"}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none disabled:opacity-50"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value, district: '' })}
                  >
                    <option value="">Tanlang...</option>
                    {Object.keys(UZBEKISTAN_REGIONS).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tuman</label>
                  <select
                    required
                    disabled={!formData.region}
                    className="w-full bg-gray-50 border border-black/5 rounded-2xl py-5 px-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-lg font-bold appearance-none disabled:opacity-50"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  >
                    <option value="">Tanlang...</option>
                    {formData.region && UZBEKISTAN_REGIONS[formData.region].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* 15. Map Location */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Joylashuv (Xaritada)</label>
                <div className="w-full h-[400px] bg-gray-100 rounded-[32px] overflow-hidden relative border border-black/5">
                  {hasValidKey ? (
                    <>
                      <APIProvider apiKey={API_KEY} version="weekly">
                        <MapPicker 
                          lat={formData.lat} 
                          lng={formData.lng} 
                          onChange={(lat, lng) => setFormData({ ...formData, lat, lng })} 
                        />
                      </APIProvider>
                      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-black/5 flex items-center gap-3 shadow-xl">
                        <MapPin className="text-emerald-600" size={20} />
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tanlangan koordinatalar</div>
                          <div className="text-xs font-bold text-gray-700">{formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-gray-50">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                          <Info size={32} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-gray-900">Xarita yuklanmadi</h4>
                          <p className="text-xs text-gray-500 font-medium">API kaliti sozlanmagan. <br /> Lekin siz e'lonni joylashtirishingiz mumkin.</p>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Settings → Secrets → GOOGLE_MAPS_PLATFORM_KEY
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !canGoNext()}
                className="w-full bg-emerald-600 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>JOYLASHTIRILMOQDA...</span>
                  </>
                ) : (
                  <span>E'LONNI JOYLASHTIRISH</span>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button onClick={() => setStep(3)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors text-sm">
                <ChevronLeft size={20} />
                ORQAGA
              </button>
              {isEditing && (
                <button onClick={() => navigate('/profile')} className="text-red-500 font-bold text-sm hover:text-red-700 transition-colors">
                  BEKOR QILISH
                </button>
              )}
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">E'lonni reklama qilish</h2>
              <p className="text-sm text-gray-500 font-medium">Ko'proq xaridorlarni jalb qiling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'ordinary', label: 'Oddiy', desc: 'Tekin', color: 'bg-gray-100' },
                { id: 'top', label: 'TOP', desc: 'Tepada turadi', color: 'bg-amber-100 text-amber-700' },
                { id: 'vip', label: 'VIP', desc: 'Eng ko\'rinadigan', color: 'bg-indigo-100 text-indigo-700' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setFormData({ ...formData, promotionType: p.id as any })}
                  className={`p-6 rounded-3xl border-2 transition-all text-left ${
                    formData.promotionType === p.id 
                      ? 'border-emerald-600 bg-emerald-50' 
                      : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center mb-4 font-black text-xs`}>
                    {p.label[0]}
                  </div>
                  <div className="font-black text-lg text-gray-900">{p.label}</div>
                  <div className="text-sm font-bold text-gray-500">{p.desc}</div>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-gray-900">Tarifni tanlang</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(Object.entries(TARIFFS) as [keyof typeof TARIFFS, any][]).map(([key, t]) => (
                  <div 
                    key={key}
                    onClick={() => setFormData({ ...formData, tariff: key })}
                    className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all relative overflow-hidden ${
                      formData.tariff === key 
                        ? 'border-emerald-600 bg-emerald-50/50' 
                        : 'border-transparent bg-white shadow-lg'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="font-black text-xl text-gray-900">{t.name}</div>
                        <div className="text-emerald-600 font-black">{t.price.toLocaleString()} so'm</div>
                      </div>
                      <ul className="space-y-2">
                        {t.features.map((f: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-gray-500 flex items-start gap-2">
                            <span className="text-emerald-500">•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div 
                onClick={() => setFormData({ ...formData, tariff: 'custom' })}
                className={`p-8 rounded-[32px] border-2 cursor-pointer transition-all ${
                  formData.tariff === 'custom' 
                    ? 'border-emerald-600 bg-emerald-50/50' 
                    : 'border-transparent bg-white shadow-lg'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="font-black text-2xl text-gray-900">Tarifni sozlash</div>
                    <p className="text-sm font-bold text-gray-500">O'zingizga mos tarifni yarating</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ko'tarish kunlari</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 font-black"
                        value={formData.boostDays}
                        onChange={(e) => setFormData({ ...formData, boostDays: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TOP kunlari</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 font-black"
                        value={formData.topDays}
                        onChange={(e) => setFormData({ ...formData, topDays: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">VIP kunlari</label>
                      <input 
                        type="number" 
                        min="0"
                        className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 font-black"
                        value={formData.vipDays}
                        onChange={(e) => setFormData({ ...formData, vipDays: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Umumiy to'lov</div>
                <div className="text-3xl font-black">{totalPrice.toLocaleString()} so'm</div>
                <div className="text-sm font-bold text-emerald-400">Balans: {(user?.balance || 0).toLocaleString()} so'm</div>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'TO\'LOV QILISH VA JOYLASHTIRISH'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-12 shadow-2xl border border-black/5 text-center"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Muvaffaqiyatli!</h2>
            <p className="text-gray-500 mb-12 font-medium leading-relaxed text-lg">
              Sizning e'loningiz qabul qilindi. <br />
              <span className="text-amber-600 font-bold">Admin tasdiqlashi kutilmoqda.</span>
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black text-xl shadow-2xl transition-all active:scale-[0.98]"
            >
              ASOSIY SAHIFAGA QAYTISH
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
