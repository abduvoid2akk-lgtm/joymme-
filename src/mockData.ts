import { Listing } from './types';

const generateMockListings = (): Listing[] => {
  const categories: Listing['category'][] = ['uy', 'dom', 'kvartira', 'boshqa'];
  const dealTypes: Listing['dealType'][] = ['Sotuv', 'Ijara', 'Kunlik'];
  const locations = [
    'Toshkent, Yunusobod', 'Toshkent, Chilonzor', 'Toshkent, Mirzo Ulugbek',
    'Samarqand, Markaz', 'Buxoro, Eski shahar', 'Namangan, Davlatobod',
    'Andijon, Yangi shahar', 'Farg\'ona, Markaz', 'Qarshi, Nasaf', 'Nukus, Markaz'
  ];
  const titles = [
    'Zamonaviy Hovli', 'Yevro Kvartira', 'Top Dom 4-xonali', 'Shinam Kvartira',
    'Yangi qurilgan uy', 'Kottej 2 qavatli', 'Penthouse Markazda', 'Arzon Uy',
    'Lux Kvartira', 'Dacha Chorvoqda', 'Ofis uchun joy', 'Do\'kon binosi'
  ];

  const listings: Listing[] = [];

  for (let i = 1; i <= 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const title = `${titles[Math.floor(Math.random() * titles.length)]} #${i}`;
    
    listings.push({
      id: i.toString(),
      title,
      description: `${location}da joylashgan juda qulay va shinam ${category}. Barcha sharoitlar mavjud, yevro remont, mebellari bilan. Narxi kelishiladi.`,
      price: Math.floor(Math.random() * 200000) + 10000,
      location,
      category,
      image: `https://picsum.photos/seed/listing${i}/800/600`,
      isVip: i <= 10, // First 10 are VIP
      isTop: i > 10 && i <= 25, // Next 15 are TOP
      status: 'approved',
      dealType,
      lat: 41.311081 + (Math.random() - 0.5) * 0.1,
      lng: 69.240562 + (Math.random() - 0.5) * 0.1,
      authorId: `u${(i % 5) + 1}`,
      authorName: ['Jasur', 'Malika', 'Sardor', 'Dilshod', 'Anvar'][i % 5],
      createdAt: Date.now() - Math.floor(Math.random() * 86400000 * 30)
    });
  }

  return listings;
};

export const MOCK_LISTINGS: Listing[] = generateMockListings();

