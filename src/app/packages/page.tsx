"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, Calendar, Users, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PackagesPage() {
  const [filters, setFilters] = useState({
    destination: "",
    duration: "",
    price: "",
  });

  // Sample packages data
  const packages = [
    {
      id: "economic-package",
      title: "Makkah Economy Package",
      description: "7 days of spiritual journey in the holy city of Makkah",
      price: 1299,
      duration: "7 days",
      rating: 4.5,
      reviewCount: 25,
      destination: "Makkah",
      featured: true
    },
    {
      id: "madinah-special",
      title: "Madinah Special Package",
      description: "5 days in Madinah with premium accommodations",
      price: 1499,
      duration: "5 days",
      rating: 4.3,
      reviewCount: 18,
      destination: "Madinah",
      featured: false
    },
    {
      id: "ramadan-special",
      title: "Ramadan Umrah Package",
      description: "10 days special Ramadan package with exclusive services",
      price: 2199,
      duration: "10 days",
      rating: 4.8,
      reviewCount: 32,
      destination: "Makkah & Madinah",
      featured: true
    },
    {
      id: "hajj-special",
      title: "Premium Hajj Package",
      description: "Complete Hajj experience with 5-star accommodations",
      price: 4999,
      duration: "14 days",
      rating: 4.9,
      reviewCount: 47,
      destination: "Makkah & Madinah",
      featured: true
    },
    {
      id: "family-package",
      title: "Family Umrah Package",
      description: "Ideal package for families with special amenities",
      price: 1899,
      duration: "8 days",
      rating: 4.6,
      reviewCount: 29,
      destination: "Makkah & Madinah",
      featured: false
    },
    {
      id: "executive-package",
      title: "Executive Umrah Package",
      description: "Luxury Umrah package with VIP services",
      price: 3299,
      duration: "9 days",
      rating: 4.7,
      reviewCount: 35,
      destination: "Makkah & Madinah",
      featured: true
    }
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredPackages = packages.filter((pkg) => {
    if (filters.destination && filters.destination !== pkg.destination) {
      return false;
    }
    if (filters.duration) {
      const days = parseInt(pkg.duration);
      if (filters.duration === "1-5" && (days < 1 || days > 5)) return false;
      if (filters.duration === "6-10" && (days < 6 || days > 10)) return false;
      if (filters.duration === "11+" && days < 11) return false;
    }
    if (filters.price) {
      if (filters.price === "budget" && pkg.price > 1500) return false;
      if (filters.price === "standard" && (pkg.price < 1500 || pkg.price > 3000)) return false;
      if (filters.price === "premium" && pkg.price < 3000) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-8">
        <h1 className="text-3xl font-bold">Umrah Packages</h1>
        <div className="flex-1"></div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search packages..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <Filter size={20} className="mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <select
                  id="destination"
                  name="destination"
                  value={filters.destination}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Destinations</option>
                  <option value="Makkah">Makkah Only</option>
                  <option value="Madinah">Madinah Only</option>
                  <option value="Makkah & Madinah">Makkah & Madinah</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">
                  Duration
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={filters.duration}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Any Duration</option>
                  <option value="1-5">1-5 Days</option>
                  <option value="6-10">6-10 Days</option>
                  <option value="11+">11+ Days</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price Range
                </label>
                <select
                  id="price"
                  name="price"
                  value={filters.price}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Any Price</option>
                  <option value="budget">Budget (Under $1,500)</option>
                  <option value="standard">Standard ($1,500-$3,000)</option>
                  <option value="premium">Premium (Over $3,000)</option>
                </select>
              </div>
              
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.length > 0 ? (
              filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-primary relative">
                    {pkg.featured && (
                      <div className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-md">
                        Featured
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">{pkg.duration}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1">{pkg.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({pkg.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{pkg.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{pkg.duration}</span>
                      <Users className="h-4 w-4 text-gray-400 ml-3 mr-1" />
                      <span className="text-sm text-gray-600">All group sizes</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-secondary">${pkg.price}</span>
                      <span className="text-sm text-gray-500">/person</span>
                    </div>
                    <Link href={`/packages/${pkg.id}`}>
                      <Button size="sm" variant="secondary">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-lg text-gray-500">No packages found matching your criteria. Please try different filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 