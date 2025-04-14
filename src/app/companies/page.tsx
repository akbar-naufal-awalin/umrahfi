"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Star, MapPin, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample companies data
  const companies = [
    {
      id: "al-madina-travel",
      name: "Al Madina Travel",
      description: "Specialized in premium Umrah packages with over 15 years of experience.",
      location: "Riyadh, Saudi Arabia",
      rating: 4.8,
      reviewCount: 124,
      packageCount: 8,
      phone: "+966 11 234 5678",
      email: "info@almadinatravel.com",
      verified: true
    },
    {
      id: "noor-expeditions",
      name: "Noor Expeditions",
      description: "Family-owned Umrah and Hajj service provider with personalized care.",
      location: "Jeddah, Saudi Arabia",
      rating: 4.7,
      reviewCount: 98,
      packageCount: 6,
      phone: "+966 12 345 6789",
      email: "contact@noorexpeditions.com",
      verified: true
    },
    {
      id: "blessed-journeys",
      name: "Blessed Journeys",
      description: "Modern travel agency focusing on comfortable and affordable Umrah experiences.",
      location: "Dubai, UAE",
      rating: 4.5,
      reviewCount: 76,
      packageCount: 5,
      phone: "+971 4 234 5678",
      email: "info@blessedjourneys.com",
      verified: true
    },
    {
      id: "al-barakat-tours",
      name: "Al Barakat Tours",
      description: "Luxury Umrah and Hajj tours with VIP accommodations and services.",
      location: "Makkah, Saudi Arabia",
      rating: 4.9,
      reviewCount: 152,
      packageCount: 10,
      phone: "+966 11 987 6543",
      email: "vip@albarakattours.com",
      verified: true
    },
    {
      id: "faith-travels",
      name: "Faith Travels",
      description: "Budget-friendly Umrah packages with excellent customer service.",
      location: "Kuala Lumpur, Malaysia",
      rating: 4.3,
      reviewCount: 68,
      packageCount: 4,
      phone: "+60 3 234 5678",
      email: "booking@faithtravels.com",
      verified: true
    },
    {
      id: "zam-zam-travel",
      name: "Zam Zam Travel",
      description: "Full service Umrah agency with multilingual guides and support.",
      location: "Istanbul, Turkey",
      rating: 4.6,
      reviewCount: 87,
      packageCount: 7,
      phone: "+90 212 345 6789",
      email: "info@zamzamtravel.com",
      verified: false
    }
  ];

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold">Umrah Travel Companies</h1>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search companies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl">{company.name}</h3>
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                    <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                    <span>{company.rating}</span>
                    <span className="text-gray-500 ml-1">({company.reviewCount})</span>
                  </div>
                </div>
                
                {company.verified && (
                  <div className="mb-3">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified Company
                    </span>
                  </div>
                )}
                
                <p className="text-gray-600 mb-4">{company.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{company.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{company.email}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{company.packageCount} Packages Available</span>
                  <Link href={`/companies/${company.id}`}>
                    <Button size="sm" variant="secondary">View Company</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-500 mb-4">No companies found matching "{searchTerm}"</p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}
      </div>
    </div>
  );
} 