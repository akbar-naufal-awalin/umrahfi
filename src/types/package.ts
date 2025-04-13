export interface Package {
    id: string;
    title: string;
    slug: string;
    companyId: string;
    description?: string;
    shortDescription?: string;
    type: 'MAKKAH_ONLY' | 'MADINAH_ONLY' | 'COMBINED' | 'SPECIAL' | 'RAMADAN' | 'HAJJ';
    durationDays: number;
    basePrice: number;
    discountPrice?: number;
    childPrice?: number;
    infantPrice?: number;
    rating?: number;
    reviewCount: number;
    featured: boolean;
    bestSeller: boolean;
    status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE' | 'SOLD_OUT';
    startDate?: Date;
    endDate?: Date;
    availableSeats?: number;
    bookedSeats: number;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    images: PackageImage[];
    inclusions: PackageInclusion[];
    itinerary: ItineraryItem[];
    accommodations: Accommodation[];
    destinations: PackageDestination[];
  }
  
  export interface Company {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    rating?: number;
    reviewCount: number;
    verified: boolean;
  }
  
  export interface PackageImage {
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
    order: number;
  }
  
  export interface PackageInclusion {
    id: string;
    name: string;
    icon?: string;
    included: boolean;
  }
  
  export interface ItineraryItem {
    id: string;
    day: number;
    title: string;
    description?: string;
  }
  
  export interface Accommodation {
    id: string;
    name: string;
    location: string;
    stars?: number;
    description?: string;
    nights: number;
    roomType?: string;
    distanceToHaram?: string;
  }
  
  export interface PackageDestination {
    id: string;
    cityId: string;
    nights: number;
    city: {
      id: string;
      name: string;
      country: {
        id: string;
        name: string;
        code: string;
      };
    };
  }
  
  // Package search filters
  export interface PackageFilters {
    type?: string;
    travelDate?: Date;
    duration?: string;
    budget?: string;
    hotelRating?: string;
    travelers?: {
      adults: number;
      children: number;
      infants: number;
    };
    destination?: string;
  }