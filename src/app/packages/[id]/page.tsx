"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, Users, MapPin, Check, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

// Sample package data (in a real app, this would come from an API/database)
const packageData = {
  "economic-package": {
    id: "economic-package",
    title: "Makkah Economy Package",
    description: "Experience a spiritual journey in the holy city of Makkah with our economy package designed for budget-conscious pilgrims.",
    longDescription: "Our Makkah Economy Package offers an affordable yet comfortable Umrah experience. Stay in well-appointed accommodations within walking distance to Haram, enjoy daily meals, and benefit from expert guidance throughout your journey. This package is perfect for those seeking a meaningful pilgrimage without premium costs.",
    price: 1299,
    duration: "7 days",
    rating: 4.5,
    reviewCount: 25,
    destination: "Makkah",
    departureDate: "Multiple dates available",
    departureAirports: [
      { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
      { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
      { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
      { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
    ],
    inclusions: [
      "Hotel accommodation (3-star) near Haram",
      "Airport transfers",
      "Daily breakfast",
      "Guided Umrah rituals",
      "Visa processing assistance",
      "24/7 support during your stay"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jeddah", description: "Arrival at King Abdulaziz International Airport. Transfer to your hotel in Makkah." },
      { day: 2, title: "Umrah Day", description: "Perform Umrah rituals with guidance from our experienced guides." },
      { day: 3, title: "Prayers and Reflection", description: "Free day for prayers and reflection at Masjid al-Haram." },
      { day: 4, title: "Ziyarat in Makkah", description: "Visit historical sites in Makkah including Jabal al-Nour and Jabal Thawr." },
      { day: 5, title: "Free Day", description: "Free day for worship and personal activities." },
      { day: 6, title: "Shopping and Preparation", description: "Time for shopping and preparing for departure." },
      { day: 7, title: "Departure", description: "Check-out and transfer to Jeddah airport for your return flight." }
    ]
  },
  "madinah-special": {
    id: "madinah-special",
    title: "Madinah Special Package",
    description: "Explore the blessed city of Madinah with our special package featuring premium accommodations and services.",
    longDescription: "The Madinah Special Package allows you to experience the peace and serenity of the Prophet's city with excellent accommodations just steps away from Masjid al-Nabawi. This package includes premium services, comfortable transportation, and guided visits to significant sites in Madinah, creating a spiritually enriching experience.",
    price: 1499,
    duration: "5 days",
    rating: 4.3,
    reviewCount: 18,
    destination: "Madinah",
    departureDate: "Multiple dates available",
    departureAirports: [
      { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
      { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
      { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles", country: "USA" },
      { code: "CAI", name: "Cairo International Airport", city: "Cairo", country: "Egypt" },
    ],
    inclusions: [
      "Premium hotel accommodation near Masjid al-Nabawi",
      "Round-trip airport transfers",
      "Daily breakfast and dinner",
      "Guided tours of historical sites",
      "Visa processing",
      "Multilingual guides"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Madinah", description: "Arrival at Prince Mohammad Bin Abdulaziz International Airport and transfer to your hotel." },
      { day: 2, title: "Masjid al-Nabawi", description: "Visit and pray at the Prophet's Mosque (Masjid al-Nabawi)." },
      { day: 3, title: "Historical Sites Tour", description: "Guided tour of historical sites including Quba Mosque, Qiblatain Mosque, and Uhud Mountain." },
      { day: 4, title: "Reflection Day", description: "Free day for worship, reflection, and personal activities." },
      { day: 5, title: "Departure", description: "Check-out and transfer to airport for departure." }
    ]
  },
  "ramadan-special": {
    id: "ramadan-special",
    title: "Ramadan Umrah Package",
    description: "Experience the blessed month of Ramadan in the holy cities with our comprehensive package offering exclusive services.",
    longDescription: "Our special Ramadan Umrah Package allows you to experience the spiritual atmosphere of the holy month in Makkah and Madinah. With accommodations close to both Harams, special iftar and suhoor arrangements, and dedicated services for Ramadan worshippers, this package provides everything needed for a blessed Ramadan experience.",
    price: 2199,
    duration: "10 days",
    rating: 4.8,
    reviewCount: 32,
    destination: "Makkah & Madinah",
    departureDate: "Ramadan 2024",
    departureAirports: [
      { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "USA" },
      { code: "LHR", name: "Heathrow Airport", city: "London", country: "UK" },
      { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "UAE" },
      { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur", country: "Malaysia" },
      { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
      { code: "JKT", name: "Soekarno-Hatta International Airport", city: "Jakarta", country: "Indonesia" },
    ],
    inclusions: [
      "Premium hotel accommodations in both Makkah and Madinah",
      "All transfers between cities and airports",
      "Special iftar and suhoor meals daily",
      "Guided Umrah rituals",
      "Visa processing",
      "Special Ramadan prayer arrangements",
      "Dedicated 24/7 support"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Jeddah", description: "Arrival and transfer to your hotel in Makkah." },
      { day: 2, title: "Umrah Rituals", description: "Perform Umrah rituals with expert guidance." },
      { day: 3, title: "Prayers in Makkah", description: "Experience Taraweeh prayers at Masjid al-Haram." },
      { day: 4, title: "Makkah Ziyarat", description: "Visit historical sites in Makkah." },
      { day: 5, title: "Free Day in Makkah", description: "Day for personal worship and reflection." },
      { day: 6, title: "Transfer to Madinah", description: "Travel to Madinah and check-in to your hotel." },
      { day: 7, title: "Masjid al-Nabawi", description: "Prayers at the Prophet's Mosque." },
      { day: 8, title: "Madinah Ziyarat", description: "Visit historical sites in Madinah." },
      { day: 9, title: "Free Day in Madinah", description: "Day for personal worship and activities." },
      { day: 10, title: "Departure", description: "Check-out and transfer to airport for departure." }
    ]
  }
};

export default function PackageDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [quantity, setQuantity] = useState(1);
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAirport, setSelectedAirport] = useState("");
  
  const packageId = params.id;
  const packageInfo = packageData[packageId as keyof typeof packageData];
  
  useEffect(() => {
    // If package doesn't exist, redirect to packages page
    if (!packageInfo) {
      router.push("/packages");
    }
  }, [packageInfo, router]);
  
  if (!packageInfo) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }
  
  const handleAddToCart = () => {
    // In a real app, this would integrate with a cart system
    toast.success(`${packageInfo.title} added to cart!`);
  };
  
  const handleBookNow = () => {
    // In a real app, this would redirect to checkout with the selected package
    router.push("/cart");
    toast.success(`Proceeding to checkout for ${packageInfo.title}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      
      <div className="mb-8">
        <Link href="/packages" className="inline-flex items-center text-secondary hover:underline">
          <ChevronLeft size={16} className="mr-1" />
          Back to Packages
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Package Image */}
          <div className="bg-primary h-64 md:h-96 rounded-lg mb-6"></div>
          
          {/* Package Title and Information */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{packageInfo.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 my-4">
              <div className="flex items-center">
                <MapPin className="text-secondary mr-1" size={18} />
                <span>{packageInfo.destination}</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-secondary mr-1" size={18} />
                <span>{packageInfo.duration}</span>
              </div>
              <div className="flex items-center">
                <Star className="text-yellow-500 mr-1 fill-current" size={18} />
                <span>{packageInfo.rating} ({packageInfo.reviewCount} reviews)</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg mb-6">{packageInfo.longDescription}</p>
          </div>
          
          {/* Departure Airports */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Departure Airports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {packageInfo.departureAirports.map((airport, index) => (
                <div key={index} className="flex items-start p-3 border rounded-md">
                  <div>
                    <h3 className="font-semibold">{airport.name} ({airport.code})</h3>
                    <p className="text-gray-500 text-sm">{airport.city}, {airport.country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Itinerary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Itinerary</h2>
            <div className="space-y-4">
              {packageInfo.itinerary.map((day) => (
                <div key={day.day} className="border-l-4 border-primary pl-4 py-2">
                  <h3 className="font-semibold text-lg">Day {day.day}: {day.title}</h3>
                  <p className="text-gray-600">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Inclusions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {packageInfo.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-start">
                  <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                  <span>{inclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-3xl font-bold text-secondary">${packageInfo.price}</span>
                <span className="text-gray-500">per person</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Departure Airport</label>
                  <select 
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedAirport}
                    onChange={(e) => setSelectedAirport(e.target.value)}
                  >
                    <option value="">Select departure airport</option>
                    {packageInfo.departureAirports.map((airport) => (
                      <option key={airport.code} value={airport.code}>
                        {airport.name} ({airport.city}, {airport.country})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input 
                    type="date"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Travelers</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-10 h-10 flex items-center justify-center border rounded-l"
                    >-</button>
                    <div className="w-12 h-10 flex items-center justify-center border-t border-b">
                      {travelers}
                    </div>
                    <button 
                      onClick={() => setTravelers(travelers + 1)}
                      className="w-10 h-10 flex items-center justify-center border rounded-r"
                    >+</button>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span>Price per person</span>
                  <span>${packageInfo.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Travelers</span>
                  <span>x {travelers}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>${packageInfo.price * travelers}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleBookNow}
                  className="w-full"
                  disabled={!selectedDate || !selectedAirport}
                >
                  Book Now
                </Button>
                
                <Button 
                  onClick={handleAddToCart}
                  variant="outline"
                  className="w-full"
                  disabled={!selectedDate || !selectedAirport}
                >
                  <ShoppingBag className="mr-2" size={16} />
                  Add to Cart
                </Button>
              </div>
              
              {(!selectedDate || !selectedAirport) && (
                <p className="text-xs text-orange-600 mt-2 text-center">
                  Please select departure airport and date to proceed
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
