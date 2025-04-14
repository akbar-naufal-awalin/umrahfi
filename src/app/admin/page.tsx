"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Building, 
  Package, 
  Calendar,
  TrendingUp,
  LineChart,
  BarChart,
  PieChart
} from "lucide-react";

// Demo data for the dashboard
const demoData = {
  stats: {
    totalPackages: 24,
    totalCompanies: 8,
    totalUsers: 156,
    totalBookings: 87,
    pendingBookings: 12,
    revenue: 124750
  },
  recentBookings: [
    { id: 'BK-1001', user: 'Aisha Khan', package: 'Makkah Economy Package', date: '2023-11-25', amount: 1299, status: 'confirmed' },
    { id: 'BK-1002', user: 'Mohammed Ali', package: 'Ramadan Umrah Package', date: '2023-12-01', amount: 2199, status: 'pending' },
    { id: 'BK-1003', user: 'Sarah Ahmed', package: 'Madinah Special Package', date: '2023-11-28', amount: 1499, status: 'confirmed' },
    { id: 'BK-1004', user: 'Yusuf Ibrahim', package: 'Ramadan Umrah Package', date: '2023-12-05', amount: 2199, status: 'pending' },
    { id: 'BK-1005', user: 'Fatima Hassan', package: 'Makkah Economy Package', date: '2023-11-30', amount: 1299, status: 'confirmed' }
  ]
};

export default function AdminDashboard() {
  const [data, setData] = useState(demoData);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real application, we would fetch this data from an API
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition">
            Generate Report
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Packages</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalPackages}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Package className="text-primary" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalCompanies}</p>
            </div>
            <div className="p-3 bg-secondary/10 rounded-full">
              <Building className="text-secondary" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <Users className="text-accent" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{data.stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-success/10 rounded-full">
              <Calendar className="text-success" size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Revenue and Pending Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Total Revenue</h2>
            <div className="p-2 bg-success/10 rounded-full">
              <TrendingUp className="text-success" size={20} />
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">${data.stats.revenue.toLocaleString()}</span>
            <span className="text-sm text-success font-medium">+8.2%</span>
          </div>
          
          <div className="mt-6 h-32 flex items-end justify-between">
            {/* Simplified chart representation */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-primary/80 rounded-t w-6" 
                style={{ 
                  height: `${20 + Math.random() * 80}%`,
                  opacity: i === 5 ? 1 : 0.7 
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800">Pending Bookings</h2>
            <div className="p-2 bg-warning/10 rounded-full">
              <Calendar className="text-warning" size={20} />
            </div>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.stats.pendingBookings}</span>
            <span className="text-sm text-gray-500 font-medium">
              awaiting confirmation
            </span>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Economic</p>
                  <p className="text-lg font-semibold text-gray-900">4</p>
                </div>
                <div className="p-2 bg-info/10 rounded-full">
                  <PieChart className="text-info" size={20} />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Premium</p>
                  <p className="text-lg font-semibold text-gray-900">8</p>
                </div>
                <div className="p-2 bg-secondary/10 rounded-full">
                  <BarChart className="text-secondary" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-800">Recent Bookings</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.package}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/admin/bookings" className="text-primary hover:text-primary-600 font-medium">
              View All Bookings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 