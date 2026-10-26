export type ScreenType = 'home' | 'plan-setup' | 'explore' | 'itinerary' | 'budget';

export type TravelPace = '여유' | '보통' | '알차게';

export interface Accommodation {
  name: string;
  latitude: number;
  longitude: number;
  subwayInfo?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  budgetKrw: number;
  currency: string;
  exchangeRate: number; // e.g. 9.0 (1 JPY = 9.0 KRW, i.e., 100 JPY = 900 KRW)
  exchangeRateDate: string;
  interests: string[];
  travelPace: TravelPace;
  accommodation: Accommodation;
  status: 'draft' | 'active' | 'completed';
  isSmartPassActive?: boolean;
  isSmartPassPaid?: boolean;
  paymentId?: string;
  smartPassPaidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlaceCategory = '관광지' | '맛집' | '쇼핑' | '자연' | '역사' | '야경' | '카페' | 'sightseeing' | 'food' | 'cafe' | 'shopping';

export interface Place {
  id: string;
  name: string;
  japaneseName?: string;
  originalName?: string;
  address?: string;
  category: PlaceCategory;
  categoryLabel: string;
  description: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  estimatedStayMinutes: number;
  entranceFeeJpy: number;
  estimatedMealCostJpy: number;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  closedDays: string[]; // e.g. ['월요일']
  lastEntryTime?: string;
  reservationRequired: boolean;
  officialSource: string;
  verifiedAt: string;
  photoUrl: string;
  subPhotoUrl?: string;
  area: string;
  transitDistanceNote?: string;
}

export type TransportMode = '도보' | '대중교통';

export interface ItineraryItem {
  id: string;
  tripId: string;
  placeId: string;
  place: Place;
  date: string; // e.g. '2026-10-12'
  dayIndex: number; // 1 to 5
  order: number;
  startTime: string; // e.g. '09:30'
  endTime: string; // e.g. '11:00'
  stayMinutes: number;
  transportMode: TransportMode;
  transitType?: 'transit' | 'walk';
  travelMinutes: number;
  distanceMeters: number;
  transportCostJpy: number;
  transitLineName?: string; // e.g. '긴자선 지하철 · 환승 0회'
  status: 'planned' | 'visited' | 'skipped';
  warning: string | null;
  warningType?: 'closure' | 'transit' | 'density';
}

export interface DaySchedule {
  dayIndex: number;
  date: string; // '2026-10-12'
  dayOfWeek: string; // '월'
  status: '여유' | '보통' | '과밀';
  totalActivityMinutes: number;
  totalExpenseJpy: number;
  items: ItineraryItem[];
  warnings: {
    id: string;
    type: 'closure' | 'transit' | 'density';
    title: string;
    description: string;
    actionLabel?: string;
  }[];
}

export interface BudgetBreakdown {
  tripId: string;
  accommodationKrw: number;
  accommodationJpy: number;
  flightKrw: number;
  flightJpy: number;
  foodKrw: number;
  foodJpy: number;
  transportKrw: number;
  transportJpy: number;
  entranceKrw: number;
  entranceJpy: number;
  otherKrw: number;
  otherJpy: number;
  totalKrw: number;
  totalJpy: number;
  remainingKrw: number;
  overBudgetKrw: number;
  budgetUsagePercent: number;
  exchangeRateDate: string;
  exchangeRate: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}
