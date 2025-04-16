
export interface Municipality {
  id: number;
  name: string;
  wilayaId: number;
}

export const municipalities: Municipality[] = [
  // Wilaya 1: Adrar
  { id: 1001, name: "أدرار", wilayaId: 1 },
  { id: 1002, name: "تمنطيط", wilayaId: 1 },
  { id: 1003, name: "رقان", wilayaId: 1 },
  { id: 1004, name: "تيميمون", wilayaId: 1 },
  { id: 1005, name: "أولاد أحمد تيمي", wilayaId: 1 },
  
  // Wilaya 2: Chlef
  { id: 2001, name: "الشلف", wilayaId: 2 },
  { id: 2002, name: "تنس", wilayaId: 2 },
  { id: 2003, name: "أولاد فارس", wilayaId: 2 },
  { id: 2004, name: "بني حواء", wilayaId: 2 },
  { id: 2005, name: "وادي الفضة", wilayaId: 2 },
  
  // Wilaya 3: Laghouat
  { id: 3001, name: "الأغواط", wilayaId: 3 },
  { id: 3002, name: "أفلو", wilayaId: 3 },
  { id: 3003, name: "قصر الحيران", wilayaId: 3 },
  { id: 3004, name: "حاسي الرمل", wilayaId: 3 },
  { id: 3005, name: "عين ماضي", wilayaId: 3 },
  
  // Wilaya 4: Oum El Bouaghi
  { id: 4001, name: "أم البواقي", wilayaId: 4 },
  { id: 4002, name: "عين البيضاء", wilayaId: 4 },
  { id: 4003, name: "عين مليلة", wilayaId: 4 },
  { id: 4004, name: "عين كرشة", wilayaId: 4 },
  { id: 4005, name: "مسكيانة", wilayaId: 4 },
  
  // Wilaya 5: Batna
  { id: 5001, name: "باتنة", wilayaId: 5 },
  { id: 5002, name: "بريكة", wilayaId: 5 },
  { id: 5003, name: "عين التوتة", wilayaId: 5 },
  { id: 5004, name: "أريس", wilayaId: 5 },
  { id: 5005, name: "مروانة", wilayaId: 5 },
  
  // Wilaya 6: Bejaia
  { id: 6001, name: "بجاية", wilayaId: 6 },
  { id: 6002, name: "أقبو", wilayaId: 6 },
  { id: 6003, name: "أوقاس", wilayaId: 6 },
  { id: 6004, name: "سيدي عيش", wilayaId: 6 },
  { id: 6005, name: "تيمزريت", wilayaId: 6 },
  
  // Wilaya 7: Biskra
  { id: 7001, name: "بسكرة", wilayaId: 7 },
  { id: 7002, name: "طولقة", wilayaId: 7 },
  { id: 7003, name: "أولاد جلال", wilayaId: 7 },
  { id: 7004, name: "سيدي عقبة", wilayaId: 7 },
  { id: 7005, name: "زريبة الوادي", wilayaId: 7 },
  
  // Wilaya 8: Bechar
  { id: 8001, name: "بشار", wilayaId: 8 },
  { id: 8002, name: "عبادلة", wilayaId: 8 },
  { id: 8003, name: "بني ونيف", wilayaId: 8 },
  { id: 8004, name: "القنادسة", wilayaId: 8 },
  { id: 8005, name: "تاغيت", wilayaId: 8 },
  
  // Wilaya 9: Blida
  { id: 9001, name: "البليدة", wilayaId: 9 },
  { id: 9002, name: "بوفاريك", wilayaId: 9 },
  { id: 9003, name: "الأربعاء", wilayaId: 9 },
  { id: 9004, name: "موزاية", wilayaId: 9 },
  { id: 9005, name: "مفتاح", wilayaId: 9 },
  
  // Wilaya 10: Bouira
  { id: 10001, name: "البويرة", wilayaId: 10 },
  { id: 10002, name: "سور الغزلان", wilayaId: 10 },
  { id: 10003, name: "الاخضرية", wilayaId: 10 },
  { id: 10004, name: "عين بسام", wilayaId: 10 },
  { id: 10005, name: "برج أوخريص", wilayaId: 10 },
  
  // Wilaya 28: M'Sila
  { id: 28001, name: "المسيلة", wilayaId: 28 },
  { id: 28002, name: "برهوم", wilayaId: 28 },
  { id: 28003, name: "بوسعادة", wilayaId: 28 },
  { id: 28004, name: "سيدي عيسى", wilayaId: 28 },
  { id: 28005, name: "عين الملح", wilayaId: 28 },
  { id: 28006, name: "حمام الضلعة", wilayaId: 28 },
  { id: 28007, name: "مقرة", wilayaId: 28 },
  { id: 28008, name: "خبانة", wilayaId: 28 },
  { id: 28009, name: "أولاد سيدي ابراهيم", wilayaId: 28 },
  { id: 28010, name: "بن سرور", wilayaId: 28 },
  
  // Add more municipalities for other wilayas as needed
  // This is a sample. In a real application, you would include all municipalities
];

// Function to get municipalities by wilaya ID
export const getMunicipalitiesByWilayaId = (wilayaId: number): Municipality[] => {
  return municipalities.filter(municipality => municipality.wilayaId === wilayaId);
};

// Function to get a municipality by ID
export const getMunicipalityById = (id: number): Municipality | undefined => {
  return municipalities.find(municipality => municipality.id === id);
};

// Function to get a wilaya ID from a wilaya name
export const getWilayaIdByName = (wilayaName: string): number | undefined => {
  const wilaya = wilayas.find(w => w.name === wilayaName);
  return wilaya?.id;
};

// Import wilayas to use in the getWilayaIdByName function
import { wilayas } from './wilayas';
