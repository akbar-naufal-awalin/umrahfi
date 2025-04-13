// src/app/company/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  DollarSign,
  Users,
  Package,
  Star,
  TrendingUp,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueChange: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalPackages: number;
  totalReviews: number;
  averageRating: number;
  recentOrders: any[];
  chartData: any[];
}

export default function CompanyDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (session && session.user.role !== "COMPANY_ADMIN") {
      redirect("/");
    }
  }, [session, status]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`/api/company/dashboard?timeRange=${timeRange}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchDashboardData();
    }
  }, [session, timeRange]);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!stats) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-3 py-1 rounded-md ${
              timeRange === "week"
                ? "bg-secondary text-white"
                : "bg-gray-100"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-3 py-1 rounded-md ${
              timeRange === "month"
                ? "bg-secondary text-white"
                : "bg-gray-100"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-3 py-1 rounded-md ${
              timeRange === "year"
                ? "bg-secondary text-white"
                : "bg-gray-100"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Revenue */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">SAR {stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex items-center">
            <span className={`flex items-center text-sm ${stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.revenueChange >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(stats.revenueChange)}%
            </span>
            <span className="text-gray-500 text-sm ml-2">vs last {timeRange}</span>
          </div>
        </Card>

        {/* Orders */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-500">{stats.completedOrders} Completed</span>
            <span className="text-amber-500">{stats.pendingOrders} Pending</span>
          </div>
        </Card>

        {/* Packages */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Active Packages</p>
              <h3 className="text-2xl font-bold">{stats.totalPackages}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <button className="text-secondary text-sm">Manage packages</button>
        </Card>

        {/* Reviews */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-500 text-sm">Rating & Reviews</p>
              <h3 className="text-2xl font-bold">{stats.averageRating.toFixed(1)} / 5</h3>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Based on {stats.totalReviews} reviews
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1B6B8C"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="orders" stroke="#B39164" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      #{order.orderNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {order.packageName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      SAR {order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          order.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/company/orders" className="text-secondary hover:underline">
              View all orders
            </a>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-secondary-light p-3 rounded-full mr-4">
                <Package className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-medium">Create New Package</h4>
                <p className="text-sm text-gray-500">
                  Add a new Umrah package
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-primary-light p-3 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">View Bookings</h4>
                <p className="text-sm text-gray-500">
                  Manage upcoming bookings
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium">Analytics</h4>
                <p className="text-sm text-gray-500">
                  View detailed reports
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}