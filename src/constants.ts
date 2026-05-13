import { Destination, Experience, Hotel, Phrase, MapPoint, Translations } from './types';

export const UI_TRANSLATIONS: Translations = {
  hero_title: {
    en: "Discover the Heart of Africa",
    rw: "Vumbura Umutima wa Afurika",
    fr: "Découvrez le Cœur de l'Afrique"
  },
  hero_subtitle: {
    en: "Your intelligent companion for exploring Rwanda's breathtaking landscapes and vibrant culture.",
    rw: "Inshuti yawe mu rugendo rwo gusura ibyiza nyaburanga n'umuco w'u Rwanda.",
    fr: "Votre compagnon intelligent pour explorer les paysages à couper le souffle et la culture vibrante du Rwanda."
  },
  plan_ai: { en: "Plan with AI", rw: "Tegura na AI", fr: "Planifier avec l'IA" },
  explore_now: { en: "Explore Now", rw: "Sura ubu", fr: "Explorer" },
  home: { en: "Home", rw: "Ahabanza", fr: "Accueil" },
  my_bookings: { en: "My Bookings", rw: "Ingendo zanjye", fr: "Mes Réservations" },
  sign_in: { en: "Sign In", rw: "Winjira", fr: "Se Connecter" },
  destinations: { en: "Destinations", rw: "Ahantu ha nyaburanga", fr: "Destinations" },
  planner: { en: "AI Planner", rw: "AI Planner", fr: "IA Planificateur" },
  experiences: { en: "Experiences", rw: "Ibyishimo", fr: "Expériences" },
  hotels: { en: "Hotels", rw: "Amahoteli", fr: "Hôtels" },
  translate: { en: "Translate", rw: "Sema", fr: "Traduire" },
  no_bookings: { en: "No bookings found yet.", rw: "Nta ngendo urateganya kugeza ubu.", fr: "Aucune réservation trouvée." },
  cancel: { en: "Cancel", rw: "Recherer", fr: "Annuler" },
  manage: { en: "Manage", rw: "Genzura", fr: "Gérer" },
  confirm_cancel: { en: "Are you sure you want to cancel this booking?", rw: "Uremeza ko ushaka gusiba uru rugendo?", fr: "Êtes-vous sûr de vouloir annuler ?" },
  booking_id: { en: "Booking ID", rw: "Nimero y'urugendo", fr: "ID de Réservation" },
  about_us: { en: "About Us", rw: "Tuzi neza", fr: "À Propos" },
  our_mission: { en: "Our Mission", rw: "Intego yacu", fr: "Notre Mission" },
  core_values: { en: "Core Values", rw: "Indangagaciro", fr: "Valeurs Fondamentales" },
  terms_conditions: { en: "Terms & Conditions", rw: "Amategeko n'amabwiriza", fr: "Termes et Conditions" },
  privacy_policy: { en: "Privacy Policy", rw: "Ibijyanye n'ibanga", fr: "Politique de Confidentialité" },
  travel_guide: { en: "Travel Guide", rw: "Igitabo cy'ubukerarugendo", fr: "Guide de Voyage" },
  events: { en: "Events", rw: "Ibikorwa", fr: "Événements" },
  transport: { en: "Transport", rw: "Ubwikorezi", fr: "Transport" },
  deals: { en: "Deals", rw: "Poromosyo", fr: "Offres" },
  community: { en: "Community", rw: "Umuryango", fr: "Communauté" },
  contact_support: { en: "Support", rw: "Tuvugishe", fr: "Support" },
};

export const TRANSPORT_OPTIONS = [
  { id: 1001, name: "Economy Sedan Transfer", emoji: "🚗", location: "Kigali / Nationwide", price: "$20", rating: 4.8 },
  { id: 1002, name: "VIP SUV Transfer/Rental", emoji: "🚙", location: "Kigali / Nationwide", price: "$60", rating: 4.9 },
  { id: 1003, name: "Kigali-Rubavu Express Bus", emoji: "🚌", location: "Kigali-Rubavu", price: "$5", rating: 4.5 },
  { id: 1004, name: "Private Moto Chauffeur", emoji: "🏍️", location: "Kigali City", price: "$15/day", rating: 4.9 },
  { id: 1005, name: "Domestic Flight: KGL-KME", emoji: "✈️", location: "Kigali Airport", price: "$125", rating: 4.7 },
  { id: 1006, name: "Shared Yego Cab", emoji: "🚕", location: "Kigali City", price: "$2/trip", rating: 4.9 },
  { id: 1007, name: "Kigali-Musanze Express Bus", emoji: "🚌", location: "Kigali-Musanze", price: "$3", rating: 4.6 },
  { id: 1008, name: "Kigali-Butare Express Bus", emoji: "🚌", location: "Kigali-Butare", price: "$4", rating: 4.6 },
  { id: 1009, name: "Mercedes S-Class (Chauffeur)", emoji: "🚘", location: "Kigali City", price: "$150/day", rating: 5.0 },
];

export const EVENTS = [
  { id: 300, name: "Kwita Izina (Gorilla Naming)", emoji: "🦍", location: "Kinigi", price: "Free", rating: 5.0, date: "September Annually" },
  { id: 301, name: "Hobe Rwanda Festival", emoji: "💃", location: "Kigali", price: "$20", rating: 4.8, date: "August" },
  { id: 302, name: "Kigali UP Music Festival", emoji: "🎸", location: "Kigali", price: "$25", rating: 4.7, date: "July" },
  { id: 900, name: "Tour du Rwanda (Cycling)", emoji: "🚴", location: "Nationwide", price: "Free", rating: 4.9, date: "February" },
  { id: 901, name: "Kigali International Peace Marathon", emoji: "🏃", location: "Kigali", price: "$15", rating: 4.6, date: "May" },
  { id: 902, name: "Liberation Day Celebrations", emoji: "🇷🇼", location: "Nationwide", price: "Free", rating: 5.0, date: "July 4th" },
  { id: 903, name: "Kigali Fashion Week", emoji: "👗", location: "Kigali", price: "$30", rating: 4.6, date: "October" },
  { id: 2001, name: "Kigali Jazz Junction", emoji: "🎷", location: "Kigali", price: "$30", rating: 4.8, date: "Every Last Friday" },
  { id: 2003, name: "Rwandan Cultural Festival", emoji: "🎭", location: "Huye", price: "$10", rating: 4.7, date: "Varies" },
];

export const DESTINATIONS: Destination[] = [
  { 
    id: 1, 
    name: "Volcanoes National Park", 
    cat: "parks", 
    emoji: "🦍", 
    location: "Musanze", 
    rating: 4.9, 
    price: "$750", 
    desc: "Home to endangered mountain gorillas. Trek through misty bamboo forests.", 
    best: "Jun-Sep", 
    fee: "$1,500 gorilla permit",
    gallery: [
      "https://images.unsplash.com/photo-1588661665492-938b813b185b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564349683146-5b74127606fe?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549463973-199f7956b6c0?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 2, 
    name: "Lake Kivu", 
    cat: "lakes", 
    emoji: "🌊", 
    location: "Rubavu/Karongi", 
    rating: 4.7, 
    price: "Free", 
    desc: "One of Africa's Great Lakes with stunning sunsets and island getaways.", 
    best: "Year-round", 
    fee: "Free access",
    gallery: [
      "https://images.unsplash.com/photo-1540959733332-e94e270b6598?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 3, 
    name: "Nyungwe Forest", 
    cat: "parks", 
    emoji: "🌿", 
    location: "Rusizi", 
    rating: 4.8, 
    price: "$50", 
    desc: "Ancient montane rainforest with canopy walkway and chimpanzee tracking.", 
    best: "Jul-Oct", 
    fee: "$50-$90",
    gallery: [
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 4, 
    name: "Akagera National Park", 
    cat: "parks", 
    emoji: "🦁", 
    location: "Eastern Province", 
    rating: 4.6, 
    price: "$50", 
    desc: "Rwanda's savanna park — Big Five safari with lions, elephants, and rhinos.", 
    best: "Jun-Sep", 
    fee: "$50",
    gallery: [
      "https://images.unsplash.com/photo-1547721064-3ba3b1237bc6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1534188753412-3ee2f77d731a?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 5, 
    name: "King's Palace Museum", 
    cat: "culture", 
    emoji: "👑", 
    location: "Nyanza", 
    rating: 4.5, 
    price: "$6", 
    desc: "Traditional royal residence showcasing Rwandan monarchy and culture.", 
    best: "Year-round", 
    fee: "$6",
    gallery: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 6, 
    name: "Mt. Bisoke Hike", 
    cat: "adventure", 
    emoji: "⛰️", 
    location: "Musanze", 
    rating: 4.7, 
    price: "$75", 
    desc: "Hike to the stunning crater lake at 3,711m above sea level.", 
    best: "Jun-Sep", 
    fee: "$75",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 7, 
    name: "Inema Arts Center", 
    cat: "culture", 
    emoji: "🎨", 
    location: "Kigali", 
    rating: 4.6, 
    price: "Free", 
    desc: "Vibrant art gallery and cultural space showcasing contemporary Rwandan art.", 
    best: "Year-round", 
    fee: "Free",
    gallery: [
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1453733190371-0a9bedd82893?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492691527719-9d1e07e5349e?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 8, 
    name: "Congo Nile Trail", 
    cat: "adventure", 
    emoji: "🚴", 
    location: "Lake Kivu shore", 
    rating: 4.5, 
    price: "Varies", 
    desc: "A 227km trail along Lake Kivu — hike, bike, or kayak through villages.", 
    best: "May-Oct", 
    fee: "Free trail",
    gallery: [
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1441974202521-724e5261ab7b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1542137722061-efd1cbdf156c?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 9, 
    name: "Musanze Caves", 
    cat: "hidden", 
    emoji: "🕳️", 
    location: "Musanze", 
    rating: 4.3, 
    price: "$30", 
    desc: "Mysterious 2km lava tube cave formed by ancient volcanic activity.", 
    best: "Year-round", 
    fee: "$30",
    gallery: [
      "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1493246507139-91e8bef99c17?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800"
    ]
  },
  { 
    id: 10, 
    name: "Rusumo Falls", 
    cat: "hidden", 
    emoji: "💧", 
    location: "Kirehe", 
    rating: 4.2, 
    price: "Free", 
    desc: "Powerful waterfall on the Kagera River at the Tanzania border.", 
    best: "Mar-May", 
    fee: "Free",
    gallery: [
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1444703686981-a3abb99d4fe3?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  { id: 1, name: "Gorilla Trekking", emoji: "🦍", price: 1500, duration: "4-6 hours", group: "Max 8", rating: 5.0, reviews: 2840, badge: "Iconic", badgeColor: "bg-amber-400/20 text-amber-300" },
  { id: 2, name: "Coffee Farm Tour", emoji: "☕", price: 25, duration: "3 hours", group: "2-15", rating: 4.8, reviews: 1200, badge: "Popular", badgeColor: "bg-green-400/20 text-green-300" },
  { id: 3, name: "Intore Dance Show", emoji: "💃", price: 15, duration: "2 hours", group: "Any", rating: 4.7, reviews: 890, badge: "Cultural", badgeColor: "bg-purple-400/20 text-purple-300" },
  { id: 4, name: "Kigali Night Tour", emoji: "🌃", price: 45, duration: "4 hours", group: "2-10", rating: 4.6, reviews: 560, badge: "New", badgeColor: "bg-blue-400/20 text-blue-300" },
  { id: 5, name: "Canopy Walk", emoji: "🌳", price: 60, duration: "2 hours", group: "Max 20", rating: 4.8, reviews: 1100, badge: "Adventure", badgeColor: "bg-orange-400/20 text-orange-300" },
  { id: 6, name: "Boat Ride Kivu", emoji: "Sailboat", price: 35, duration: "3 hours", group: "2-8", rating: 4.7, reviews: 740, badge: "Scenic", badgeColor: "bg-cyan-400/20 text-cyan-300" },
  { id: 7, name: "Village Homestay", emoji: "🏘️", price: 40, duration: "Full day", group: "1-4", rating: 4.9, reviews: 320, badge: "Authentic", badgeColor: "bg-rose-400/20 text-rose-300" },
  { id: 8, name: "Photo Safari", emoji: "📸", price: 120, duration: "Full day", group: "2-6", rating: 4.8, reviews: 450, badge: "Premium", badgeColor: "bg-amber-400/20 text-amber-300" }
];

export const HOTELS: Hotel[] = [
  { id: 1, name: "One&Only Gorilla's Nest", cat: "luxury", emoji: "🏔️", location: "Musanze", price: 850, rating: 4.9, rooms: 21, amenities: ["Spa", "Pool", "Restaurant", "Fireplace"] },
  { id: 2, name: "Bisate Lodge", cat: "luxury", emoji: "🌿", location: "Volcanoes NP", price: 1200, rating: 5.0, rooms: 6, amenities: ["Butler", "Nature", "Fine Dining", "Heated Pool"] },
  { id: 3, name: "Lake Kivu Serena", cat: "luxury", emoji: "🌅", location: "Rubavu", price: 220, rating: 4.7, rooms: 66, amenities: ["Beach", "Pool", "Spa", "Tennis"] },
  { id: 4, name: "Nyungwe Forest Lodge", cat: "eco", emoji: "🌳", location: "Nyungwe", price: 350, rating: 4.6, rooms: 24, amenities: ["Hiking", "Tea Plantation", "Restaurant"] },
  { id: 5, name: "Retreat Kigali", cat: "eco", emoji: "🌱", location: "Kigali", price: 95, rating: 4.4, rooms: 18, amenities: ["Yoga", "Garden", "Organic Café"] },
  { id: 6, name: "Discover Rwanda Youth Hostel", cat: "budget", emoji: "🎒", location: "Kigali", price: 28, rating: 4.2, rooms: 40, amenities: ["WiFi", "Kitchen", "Tours Desk"] }
];

export const PHRASEBOOK: Phrase[] = [
  { en: "Hello", rw: "Muraho", fr: "Bonjour", sw: "Habari" },
  { en: "Thank you", rw: "Murakoze", fr: "Merci", sw: "Asante" },
  { en: "How much?", rw: "Ni angahe?", fr: "C'est combien?", sw: "Bei gani?" },
  { en: "Where is...?", rw: "...iri hehe?", fr: "Où est...?", sw: "...iko wapi?" },
  { en: "Help me", rw: "Mfashe", fr: "Aidez-moi", sw: "Nisaidie" },
  { en: "Delicious!", rw: "Biryoshye!", fr: "Délicieux!", sw: "Tamu sana!" }
];

export const MAP_POINTS: MapPoint[] = [
  { id: 'kigali', title: "Kigali", emoji: "🏙️", category: 'city', desc: "Rwanda's capital — clean, vibrant, and innovative. Home to the Genocide Memorial and amazing nightlife.", pop: "1.2M", altitude: "1,567m", coordinates: { cx: 265, cy: 190 } },
  { id: 'volcanoes', title: "Volcanoes National Park", emoji: "🦍", category: 'park', desc: "Trek with mountain gorillas in misty bamboo forests. One of the most extraordinary wildlife experiences.", pop: "Musanze", altitude: "2,400-4,507m", coordinates: { cx: 160, cy: 95 } },
  { id: 'kivu', title: "Lake Kivu", emoji: "🌊", category: 'lake', desc: "Spectacular Great Lake with islands and resorts. Perfect for kayaking and stunning sunsets.", pop: "Rubavu/Karongi", altitude: "1,460m", coordinates: { cx: 110, cy: 220 } },
  { id: 'akagera', title: "Akagera National Park", emoji: "🦁", category: 'park', desc: "Rwanda's Big Five savanna — spot lions, elephants, and rhinos in a scenic landscape.", pop: "Eastern Province", altitude: "1,300-1,825m", coordinates: { cx: 370, cy: 200 } },
  { id: 'nyungwe', title: "Nyungwe Forest", emoji: "🌿", category: 'park', desc: "One of Africa's oldest rainforests. Walk the canopy bridge and track chimpanzees.", pop: "Rusizi", altitude: "1,600-2,950m", coordinates: { cx: 180, cy: 330 } }
];
