"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  Shield, 
  Heart,
  Plane 
} from "lucide-react";

// List of countries with their major airports
const countries = [
  {
    name: "USA",
    airports: [
      { code: "JFK", name: "John F. Kennedy International Airport", city: "New York" },
      { code: "LAX", name: "Los Angeles International Airport", city: "Los Angeles" },
      { code: "ORD", name: "O'Hare International Airport", city: "Chicago" },
    ]
  },
  {
    name: "UK",
    airports: [
      { code: "LHR", name: "Heathrow Airport", city: "London" },
      { code: "MAN", name: "Manchester Airport", city: "Manchester" },
      { code: "BHX", name: "Birmingham Airport", city: "Birmingham" },
    ]
  },
  {
    name: "UAE",
    airports: [
      { code: "DXB", name: "Dubai International Airport", city: "Dubai" },
      { code: "AUH", name: "Abu Dhabi International Airport", city: "Abu Dhabi" },
      { code: "SHJ", name: "Sharjah International Airport", city: "Sharjah" },
    ]
  },
  {
    name: "Malaysia",
    airports: [
      { code: "KUL", name: "Kuala Lumpur International Airport", city: "Kuala Lumpur" },
      { code: "PEN", name: "Penang International Airport", city: "Penang" },
      { code: "BKI", name: "Kota Kinabalu International Airport", city: "Kota Kinabalu" },
    ]
  },
  {
    name: "Indonesia",
    airports: [
      { code: "CGK", name: "Soekarno-Hatta International Airport", city: "Jakarta" },
      { code: "DPS", name: "Ngurah Rai International Airport", city: "Bali" },
      { code: "SUB", name: "Juanda International Airport", city: "Surabaya" },
    ]
  },
  {
    name: "Turkey",
    airports: [
      { code: "IST", name: "Istanbul Airport", city: "Istanbul" },
      { code: "AYT", name: "Antalya Airport", city: "Antalya" },
      { code: "ESB", name: "Ankara Esenboğa Airport", city: "Ankara" },
    ]
  },
];

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [airport, setAirport] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (country) params.append("country", country);
    if (airport) params.append("airport", airport);
    if (departureDate) params.append("date", departureDate);
    
    // Navigate to packages page with search params
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-gray-900 to-primary-900 opacity-90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Your Journey to the Sacred Lands
            </h1>
            <p className="text-xl mb-8 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Find and book the best Umrah packages from verified travel companies
            </p>
            
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <MapPin className="text-gray-400 mr-2" size={18} />
                    <select 
                      className="w-full bg-transparent focus:outline-none text-gray-800"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      <option value="">Select Destination</option>
                      <option value="makkah">Makkah</option>
                      <option value="madinah">Madinah</option>
                      <option value="both">Makkah & Madinah</option>
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <Plane className="text-gray-400 mr-2" size={18} />
                    <select 
                      className="w-full bg-transparent focus:outline-none text-gray-800" 
                      id="country-select"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.name} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <Plane className="text-gray-400 mr-2 rotate-45" size={18} />
                    <select 
                      className="w-full bg-transparent focus:outline-none text-gray-800" 
                      id="airport-select"
                      value={airport}
                      onChange={(e) => setAirport(e.target.value)}
                    >
                      <option value="">Select Departure Airport</option>
                      {countries.flatMap(country => 
                        country.airports.map(airport => (
                          <option key={airport.code} value={airport.code} data-country={country.name}>
                            {airport.city} - {airport.code}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <Calendar className="text-gray-400 mr-2" size={18} />
                    <input 
                      type="date" 
                      className="w-full bg-transparent focus:outline-none text-gray-800"
                      min={new Date().toISOString().split('T')[0]}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="bg-secondary text-white md:col-span-4 py-3 px-6 rounded-md hover:bg-secondary/80 transition font-semibold shadow-md text-lg"
                >
                  <Search className="inline mr-2" size={20} />
                  Search Packages
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Packages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Popular Umrah Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Package 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Makkah Economy Package</h3>
                <p className="text-gray-600 mb-4">7 days of spiritual journey in the holy city of Makkah</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-secondary">$1,299</span>
                  <span className="text-sm text-gray-500">per person</span>
                </div>
                <Link href="/packages/economic-package" className="block text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Package 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Madinah Special Package</h3>
                <p className="text-gray-600 mb-4">5 days in Madinah with premium accommodations</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-secondary">$1,499</span>
                  <span className="text-sm text-gray-500">per person</span>
                </div>
                <Link href="/packages/madinah-special" className="block text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
                  View Details
                </Link>
              </div>
            </div>
            
            {/* Package 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-primary"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Ramadan Umrah Package</h3>
                <p className="text-gray-600 mb-4">10 days special Ramadan package with exclusive services</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-secondary">$2,199</span>
                  <span className="text-sm text-gray-500">per person</span>
                </div>
                <Link href="/packages/ramadan-special" className="block text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition">
                  View Details
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/packages" className="inline-block bg-white text-secondary border border-secondary py-2 px-6 rounded-md hover:bg-secondary hover:text-white transition">
              View All Packages
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Why Choose UmrahFi</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We make your spiritual journey seamless with verified travel partners and exceptional service
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Verified Companies</h3>
              <p className="text-gray-600">
                All travel companies on our platform are verified and trusted
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is available around the clock
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Booking</h3>
              <p className="text-gray-600">
                Your payments and personal information are always secure
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Tailored Packages</h3>
              <p className="text-gray-600">
                Find the perfect package that meets your needs and preferences
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
