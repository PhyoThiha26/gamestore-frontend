export interface SystemRequirement {
  os: string;
  cpu: string;
  cpuTier: number; // 1 to 10 for performance evaluation
  ram: string;
  ramGb: number;
  gpu: string;
  gpuTier: number; // 1 to 10 for performance evaluation
  storage: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Game {
  id: string;
  title: string;
  tagline: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  rating: number;
  price: number;
  discount: number; // percent e.g. 20 for 20%
  coverImage: string;
  bannerImage: string;
  screenshots: string[];
  description: string;
  genres: string[];
  platforms: ("PC" | "PS5" | "Xbox" | "Switch")[];
  features: string[];
  reqMin: SystemRequirement;
  reqRec: SystemRequirement;
  reviews: Review[];
}

// Global list of CPUs and GPUs with tier ratings for compatibility check
export const CPU_LIST = [
  { name: "Intel Core i3-10100 / AMD Ryzen 3 3100", tier: 3 },
  { name: "Intel Core i5-10400 / AMD Ryzen 5 3600", tier: 5 },
  { name: "Intel Core i5-12400 / AMD Ryzen 5 5600X", tier: 6 },
  { name: "Intel Core i7-10700K / AMD Ryzen 7 3800X", tier: 7 },
  { name: "Intel Core i7-12700K / AMD Ryzen 7 5800X3D", tier: 8 },
  { name: "Intel Core i9-13900K / AMD Ryzen 9 7950X", tier: 10 },
];

export const GPU_LIST = [
  { name: "Nvidia GTX 1060 / AMD RX 580 (6GB VRAM)", tier: 3 },
  { name: "Nvidia GTX 1660 Super / AMD RX 5500 XT", tier: 4 },
  { name: "Nvidia RTX 2060 / AMD RX 5600 XT (8GB VRAM)", tier: 5 },
  { name: "Nvidia RTX 3060 / AMD RX 6600 XT", tier: 6 },
  { name: "Nvidia RTX 3070 Ti / AMD RX 6800 XT (12GB VRAM)", tier: 8 },
  { name: "Nvidia RTX 4080 / AMD RX 7900 XTX (16GB VRAM)", tier: 10 },
];

export const RAM_LIST = [
  { name: "8 GB RAM", size: 8 },
  { name: "12 GB RAM", size: 12 },
  { name: "16 GB RAM", size: 16 },
  { name: "32 GB RAM", size: 32 },
];

export const gamesData: Game[] = [
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty",
    tagline: "Enter the dark future and become a cyber-enhanced mercenary.",
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    releaseDate: "Sep 26, 2023",
    rating: 4.8,
    price: 59.99,
    discount: 33,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop", // Stylized gaming
    bannerImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop", // Sci-Fi city
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Phantom Liberty is a new spy-thriller expansion for Cyberpunk 2077. Return as cyber-enhanced mercenary V and embark on a high-stakes mission of espionage and intrigue to save the NUSA president. In the dangerous district of Dogtown, you must forge alliances within a web of shattered loyalties and sinister political machinations. Do you have what it takes to survive?",
    genres: ["RPG", "Action", "Sci-Fi"],
    platforms: ["PC", "PS5", "Xbox"],
    features: ["Single-player", "Ray Tracing", "DLSS 3.0 Support", "Controller Support"],
    reqMin: {
      os: "Windows 10 64-bit",
      cpu: "Intel Core i7-6700 or AMD Ryzen 5 1600",
      cpuTier: 4,
      ram: "12 GB RAM",
      ramGb: 12,
      gpu: "Nvidia GTX 1060 (6GB) or Radeon RX 580",
      gpuTier: 3,
      storage: "70 GB SSD",
    },
    reqRec: {
      os: "Windows 11 64-bit",
      cpu: "Intel Core i7-12700 or AMD Ryzen 7 7800X3D",
      cpuTier: 8,
      ram: "16 GB RAM",
      ramGb: 16,
      gpu: "Nvidia RTX 3070 or AMD RX 6800",
      gpuTier: 7,
      storage: "70 GB SSD NVMe",
    },
    reviews: [
      {
        id: "rev-1",
        userName: "NeoGamer",
        rating: 5,
        date: "May 10, 2026",
        comment: "Phantom Liberty completely fixes the initial issues. Incredible storytelling, gorgeous graphics, and Idris Elba is outstanding!",
      },
      {
        id: "rev-2",
        userName: "ChoohChooh",
        rating: 4.5,
        date: "May 02, 2026",
        comment: "Dogtown is so dense and atmospheric. Gameplay mechanics feel perfect now. A masterclass in cyberpunk atmosphere.",
      },
    ],
  },
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree",
    tagline: "Rise, Tarnished, and walk the Land of Shadow to uncover dark secrets.",
    developer: "FromSoftware Inc.",
    publisher: "Bandai Namco Entertainment",
    releaseDate: "Jun 21, 2024",
    rating: 4.9,
    price: 39.99,
    discount: 0,
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop", // Dark atmospheric
    bannerImage: "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=1200&auto=format&fit=crop", // Fantasy landscape
    screenshots: [
      "https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Guided by Empyrean Miquella, players are beckoned to the Land of Shadow, a place obscured by the Erdtree where the goddess Marika first set foot. In these strange new lands, players discover the dark secrets of the world, meeting others who follow in Miquella's footsteps with ulterior motives.",
    genres: ["RPG", "Action", "Fantasy"],
    platforms: ["PC", "PS5", "Xbox"],
    features: ["Co-op", "Multiplayer", "Controller Support", "Steam Achievements"],
    reqMin: {
      os: "Windows 10 64-bit",
      cpu: "Intel Core i5-8400 or AMD Ryzen 3 3300X",
      cpuTier: 3,
      ram: "12 GB RAM",
      ramGb: 12,
      gpu: "Nvidia GTX 1060 (3GB) or AMD RX 580",
      gpuTier: 3,
      storage: "80 GB available space",
    },
    reqRec: {
      os: "Windows 11 64-bit",
      cpu: "Intel Core i7-8700K or AMD Ryzen 5 3600X",
      cpuTier: 5,
      ram: "16 GB RAM",
      ramGb: 16,
      gpu: "Nvidia RTX 2060 or AMD RX 5700 XT",
      gpuTier: 5,
      storage: "80 GB SSD",
    },
    reviews: [
      {
        id: "er-1",
        userName: "SoulsFan99",
        rating: 5,
        date: "May 22, 2026",
        comment: "Hardest bosses FromSoft has ever designed. Phenomenal map layout and stunning weapon variety. Absolute masterpiece.",
      },
    ],
  },
  {
    id: "hades-2",
    title: "Hades II",
    tagline: "Battle beyond the Underworld using dark sorcery to take on the Titan of Time.",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "May 6, 2024",
    rating: 4.7,
    price: 29.99,
    discount: 10,
    coverImage: "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?q=80&w=600&auto=format&fit=crop", // Artistic vector
    bannerImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop", // Neon gaming setup
    screenshots: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop",
    ],
    description: "The first-ever sequel from Supergiant Games builds on the best aspects of the original god-like rogue-like dungeon crawler in an all-new, action-packed, endlessly replayable experience rooted in the Underworld of Greek myth and its deep connections to the dawn of witchcraft.",
    genres: ["Action", "Rogue-like", "Indie"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    features: ["Single-player", "Controller Support", "Early Access", "Highly Replayable"],
    reqMin: {
      os: "Windows 10 64-bit",
      cpu: "Dual Core 2.4 GHz",
      cpuTier: 1,
      ram: "8 GB RAM",
      ramGb: 8,
      gpu: "Nvidia GTX 950 or AMD Radeon RX 460",
      gpuTier: 2,
      storage: "10 GB available space",
    },
    reqRec: {
      os: "Windows 11 64-bit",
      cpu: "Quad Core 3.0 GHz+",
      cpuTier: 4,
      ram: "16 GB RAM",
      ramGb: 16,
      gpu: "Nvidia GTX 1060 or AMD Radeon RX 570",
      gpuTier: 3,
      storage: "10 GB SSD",
    },
    reviews: [
      {
        id: "h2-1",
        userName: "MelinoeSimp",
        rating: 5,
        date: "May 19, 2026",
        comment: "Supergiant does it again. Melinoë feels completely distinct from Zagreus. The music is an absolute banger too!",
      },
    ],
  },
  {
    id: "gta-6",
    title: "Grand Theft Auto VI",
    tagline: "Head to Leonida, home to the neon-soaked streets of Vice City and beyond.",
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseDate: "Fall 2025",
    rating: 4.9,
    price: 69.99,
    discount: 0,
    coverImage: "https://images.unsplash.com/photo-1580234810907-b40315b76418?q=80&w=600&auto=format&fit=crop", // Retro sports car
    bannerImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop", // Neon palm trees / sunset skyline
    screenshots: [
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet. Follow Lucia and Jason in a thrilling story of crime, love, and survival in modern-day Florida.",
    genres: ["Action", "Open World", "Adventure"],
    platforms: ["PS5", "Xbox", "PC"],
    features: ["Single-player", "Online Multiplayer", "Ray Tracing", "Ultra Realistic"],
    reqMin: {
      os: "Windows 10 64-bit",
      cpu: "Intel Core i5-10400 or AMD Ryzen 5 3600",
      cpuTier: 5,
      ram: "16 GB RAM",
      ramGb: 16,
      gpu: "Nvidia RTX 2060 or AMD RX 5700 XT",
      gpuTier: 5,
      storage: "150 GB SSD",
    },
    reqRec: {
      os: "Windows 11 64-bit",
      cpu: "Intel Core i7-12700K or AMD Ryzen 7 5800X3D",
      cpuTier: 8,
      ram: "32 GB RAM",
      ramGb: 32,
      gpu: "Nvidia RTX 4080 or AMD RX 7900 XT",
      gpuTier: 10,
      storage: "150 GB SSD NVMe",
    },
    reviews: [
      {
        id: "gta-rev-1",
        userName: "ViceCityBorn",
        rating: 5,
        date: "May 25, 2026",
        comment: "This is the most detailed game ever created. The NPCs are incredibly alive, and the graphics are next level. Worth every year of waiting!",
      },
    ],
  },
  {
    id: "hollow-knight-silksong",
    title: "Hollow Knight: Silksong",
    tagline: "Play as Hornet, princess-protector of Hallownest, in a whole new kingdom.",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    releaseDate: "TBA",
    rating: 4.8,
    price: 34.99,
    discount: 15,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop", // Fantasy forest / cave
    bannerImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop", // Atmospheric cave
    screenshots: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    ],
    description: "Capture the crown, solve the riddle, and ascend through a strange, beautiful kingdom of bugs! Play as Hornet, princess-protector of Hallownest, who has been captured and brought to this unfamiliar land. Explore vast areas, learn new silk-weaving powers, battle lethal enemies, and search for the truth.",
    genres: ["Metroidvania", "Action", "Indie"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    features: ["Single-player", "Controller Support", "Full Soundtrack", "Masterpiece"],
    reqMin: {
      os: "Windows 7 64-bit",
      cpu: "Intel Core i3-3240 or AMD Phenom II X4 965",
      cpuTier: 2,
      ram: "8 GB RAM",
      ramGb: 8,
      gpu: "Nvidia GTX 560 or AMD Radeon HD 7850",
      gpuTier: 2,
      storage: "20 GB available space",
    },
    reqRec: {
      os: "Windows 10 64-bit",
      cpu: "Intel Core i5-4570 or AMD FX-8350",
      cpuTier: 3,
      ram: "8 GB RAM",
      ramGb: 8,
      gpu: "Nvidia GTX 760 or AMD Radeon R9 280X",
      gpuTier: 3,
      storage: "20 GB SSD",
    },
    reviews: [
      {
        id: "hk-1",
        userName: "ShawShaw",
        rating: 5,
        date: "May 15, 2026",
        comment: "Is it real? Yes! It is incredibly fluid, the needle mechanics are amazing, and Hornet moves so beautifully. Masterpiece!",
      },
    ],
  },
];


