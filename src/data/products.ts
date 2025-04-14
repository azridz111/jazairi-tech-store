
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  specs: {
    processor: string;
    ram: string;
    storage: string;
    gpu: string;
    display: string;
  };
  inStock: boolean;
  description: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "ROG STRIX G15",
    category: "laptops",
    price: 189000,
    oldPrice: 210000,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    specs: {
      processor: "Intel Core i7-12700H",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      gpu: "NVIDIA RTX 3060 6GB",
      display: "15.6\" FHD 144Hz"
    },
    inStock: true,
    description: "كمبيوتر محمول احترافي للألعاب بأداء مذهل وتصميم أنيق",
    featured: true
  },
  {
    id: 2,
    name: "iMac 24",
    category: "desktops",
    price: 252000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
    specs: {
      processor: "Apple M1",
      ram: "8GB",
      storage: "256GB SSD",
      gpu: "M1 7-core",
      display: "24\" 4.5K Retina"
    },
    inStock: true,
    description: "كمبيوتر مكتبي أنيق بشاشة رائعة وأداء سلس",
    featured: true
  },
  {
    id: 3,
    name: "Legion 5 Pro",
    category: "laptops",
    price: 175000,
    oldPrice: 190000,
    image: "https://images.unsplash.com/photo-1543652437-c91ccd2b7f21",
    specs: {
      processor: "AMD Ryzen 7 5800H",
      ram: "16GB DDR4",
      storage: "1TB SSD",
      gpu: "NVIDIA RTX 3070 8GB",
      display: "16\" WQXGA 165Hz"
    },
    inStock: true,
    description: "أداء استثنائي مع شاشة عالية الدقة للألعاب والأعمال",
    featured: true
  },
  {
    id: 4,
    name: "HP Pavilion",
    category: "laptops",
    price: 92000,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6",
    specs: {
      processor: "Intel Core i5-11300H",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe Graphics",
      display: "15.6\" FHD IPS"
    },
    inStock: true,
    description: "كمبيوتر محمول اقتصادي مناسب للاستخدام اليومي والدراسة"
  },
  {
    id: 5,
    name: "Dell XPS 13",
    category: "laptops",
    price: 195000,
    image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5",
    specs: {
      processor: "Intel Core i7-1185G7",
      ram: "16GB LPDDR4x",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe Graphics",
      display: "13.4\" UHD+ Touch"
    },
    inStock: true,
    description: "كمبيوتر محمول فائق النحافة بشاشة رائعة ومعالج قوي",
    featured: true
  },
  {
    id: 6,
    name: "AORUS Gaming PC",
    category: "desktops",
    price: 320000,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
    specs: {
      processor: "Intel Core i9-12900K",
      ram: "32GB DDR5",
      storage: "2TB NVMe SSD",
      gpu: "NVIDIA RTX 3080 Ti 12GB",
      display: "N/A"
    },
    inStock: false,
    description: "وحدة ألعاب متطورة بمكونات عالية الأداء للألعاب والتصميم"
  },
  {
    id: 7,
    name: "MacBook Air M2",
    category: "laptops",
    price: 175000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    specs: {
      processor: "Apple M2",
      ram: "8GB",
      storage: "256GB SSD",
      gpu: "M2 8-core",
      display: "13.6\" Liquid Retina"
    },
    inStock: true,
    description: "خفيف الوزن وقوي الأداء مع عمر بطارية طويل"
  },
  {
    id: 8,
    name: "MSI Katana GF66",
    category: "laptops",
    price: 150000,
    oldPrice: 170000,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761",
    specs: {
      processor: "Intel Core i7-11800H",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      gpu: "NVIDIA RTX 3050 Ti 4GB",
      display: "15.6\" FHD 144Hz"
    },
    inStock: true,
    description: "كمبيوتر محمول مخصص للألعاب بسعر معقول وأداء ممتاز"
  }
];
