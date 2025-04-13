// src/types/index.ts
export enum TravelerType {
    ADULT = "ADULT",
    CHILD = "CHILD",
    INFANT = "INFANT"
  }
  
  export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
  }
  
  export enum OrderStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
  }
  
  export interface Package {
    id: string;
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    type: string;
    durationDays: number;
    basePrice: number;
    discountPrice?: number;
    childPrice?: number;
    infantPrice?: number;
    status: string;
    featured: boolean;
    bestSeller: boolean;
    startDate?: Date;
    endDate?: Date;
    availableSeats?: number;
    bookedSeats: number;
    rating?: number;
    reviewCount: number;
    company: Company;
    images: PackageImage[];
    destinations: PackageDestination[];
    inclusions: PackageInclusion[];
    accommodations: Accommodation[];
    itinerary: ItineraryItem[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Company {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    verified: boolean;
    rating?: number;
    reviewCount: number;
  }
  
  export interface PackageImage {
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
    order: number;
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
  
  export interface PackageInclusion {
    id: string;
    name: string;
    icon?: string;
    included: boolean;
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
  
  export interface ItineraryItem {
    id: string;
    day: number;
    title: string;
    description?: string;
  }
  
  export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: number;
    adultCount: number;
    childCount: number;
    infantCount: number;
    departureDate: Date;
    specialRequests?: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    packageId: string;
    package: Package;
    travelers: Traveler[];
    payments: Payment[];
  }
  
  export interface Traveler {
    id: string;
    firstName: string;
    lastName: string;
    type: TravelerType;
    dateOfBirth?: Date;
    gender?: Gender;
    nationality?: string;
    passportNumber?: string;
    passportExpiry?: Date;
    passportScan?: string;
  }
  
  export interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    transactionId?: string;
    createdAt: Date;
  }