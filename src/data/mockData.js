export const INITIAL_CATEGORIES = [
  { id: 'grains', name: 'Grains & Atta', icon: 'Wheat', count: 4 },
  { id: 'dairy', name: 'Dairy & Bakery', icon: 'Milk', count: 3 },
  { id: 'spices', name: 'Oils & Spices', icon: 'Flame', count: 3 },
  { id: 'snacks', name: 'Snacks & Sweets', icon: 'Cookie', count: 3 },
  { id: 'beverages', name: 'Beverages & Drinks', icon: 'Coffee', count: 3 }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Aashirvaad Shuddh Chakki Atta',
    category: 'grains',
    price: 365,
    originalPrice: 410,
    unit: '10 kg',
    quantity: 45,
    description: '100% pure whole wheat grain flour milled with traditional chakki process for soft rotis.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: 'p2',
    name: 'Fortune Everyday Basmati Rice',
    category: 'grains',
    price: 145,
    originalPrice: 170,
    unit: '1 kg',
    quantity: 60,
    description: 'Long grain aromatic everyday basmati rice suitable for biryani and regular meals.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.6,
    reviewsCount: 89
  },
  {
    id: 'p3',
    name: 'Tata Sampann Toor / Arhar Dal',
    category: 'grains',
    price: 168,
    originalPrice: 190,
    unit: '1 kg',
    quantity: 35,
    description: 'Unpolished premium protein-rich yellow split pigeon peas (Arhar dal).',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.7,
    reviewsCount: 56
  },
  {
    id: 'p4',
    name: 'Organic Chana Dal',
    category: 'grains',
    price: 98,
    originalPrice: 115,
    unit: '1 kg',
    quantity: 28,
    description: 'High-fiber organic split Bengal gram, free from harmful pesticides.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.5,
    reviewsCount: 42
  },
  {
    id: 'p5',
    name: 'Amul Taaza Toned Milk (Pouch)',
    category: 'dairy',
    price: 27,
    originalPrice: 28,
    unit: '500 ml',
    quantity: 100,
    description: 'Fresh pasteurized toned milk enriched with Vitamin A & D.',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.9,
    reviewsCount: 310
  },
  {
    id: 'p6',
    name: 'Amul Pasteurised Butter',
    category: 'dairy',
    price: 56,
    originalPrice: 60,
    unit: '100 g',
    quantity: 40,
    description: 'Delicious creamy salted butter made from pure milk fat.',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.9,
    reviewsCount: 215
  },
  {
    id: 'p7',
    name: 'Mother Dairy Fresh Paneer',
    category: 'dairy',
    price: 92,
    originalPrice: 100,
    unit: '200 g',
    quantity: 25,
    description: 'Soft and un-aged cottage cheese rich in milk proteins.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.7,
    reviewsCount: 88
  },
  {
    id: 'p8',
    name: 'Fortune Kachi Ghani Mustard Oil',
    category: 'spices',
    price: 155,
    originalPrice: 175,
    unit: '1 L',
    quantity: 50,
    description: 'Cold-pressed authentic mustard oil with strong pungency and natural antioxidants.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.8,
    reviewsCount: 175
  },
  {
    id: 'p9',
    name: 'MDH Deggi Mirch Powder',
    category: 'spices',
    price: 82,
    originalPrice: 90,
    unit: '100 g',
    quantity: 30,
    description: 'Finely ground red chili blend offering vibrant red color and mild spiciness.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.6,
    reviewsCount: 64
  },
  {
    id: 'p10',
    name: 'Catch Turmeric / Haldi Powder',
    category: 'spices',
    price: 45,
    originalPrice: 50,
    unit: '100 g',
    quantity: 45,
    description: 'High curcumin content Indian turmeric powder for rich aroma and golden color.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.7,
    reviewsCount: 78
  },
  {
    id: 'p11',
    name: 'Haldiram\'s Nagpur Bhujia Sev',
    category: 'snacks',
    price: 105,
    originalPrice: 120,
    unit: '400 g',
    quantity: 35,
    description: 'Crispy moth pulse and gram flour crispy fried savory noodles snack.',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.8,
    reviewsCount: 190
  },
  {
    id: 'p12',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    category: 'snacks',
    price: 175,
    originalPrice: 185,
    unit: '150 g',
    quantity: 20,
    description: 'Rich, smooth and creamy classic milk chocolate bar.',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.9,
    reviewsCount: 340
  },
  {
    id: 'p13',
    name: 'Tata Tea Gold Premium Tea',
    category: 'beverages',
    price: 240,
    originalPrice: 265,
    unit: '500 g',
    quantity: 40,
    description: 'Exquisite blend of CTC tea leaves with long leaf tea for rich taste and irresistible aroma.',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    featured: true,
    rating: 4.8,
    reviewsCount: 155
  },
  {
    id: 'p14',
    name: 'Red Label Strong Black Tea',
    category: 'beverages',
    price: 140,
    originalPrice: 155,
    unit: '250 g',
    quantity: 30,
    description: 'High quality leaves processed with Brooke Bond taste expertise for strong flavor.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.6,
    reviewsCount: 82
  },
  {
    id: 'p15',
    name: 'Nescafe Classic Instant Coffee',
    category: 'beverages',
    price: 195,
    originalPrice: 210,
    unit: '100 g',
    quantity: 25,
    description: '100% pure instant coffee granules crafted from rich Robusta beans.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    featured: false,
    rating: 4.7,
    reviewsCount: 110
  }
];

// Clean initial customer, order, and review collections (Default mock customer names removed)
export const INITIAL_CUSTOMERS = [];
export const INITIAL_ORDERS = [];
export const INITIAL_REVIEWS = [];

export const DEFAULT_ADMIN = {
  id: 'admin-1',
  email: 'admin@kirana',
  passcode: 'admin@1234kirana',
  name: 'Kirana Store Admin',
  phone: '9898989898',
  location: 'Store Address: Shop #4, Main Market, Delhi 110001',
  role: 'Admin'
};

export const DEMO_USERS = {
  admin: DEFAULT_ADMIN,
  customer: null
};
