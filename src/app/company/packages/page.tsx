// src/app/company/packages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Package, Edit, Trash2, Eye, Plus, Check, X, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";

interface PackageItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  durationDays: number;
  basePrice: number;
  discountPrice?: number;
  status: string;
  featured: boolean;
  bestSeller: boolean;
  startDate?: string;
  endDate?: string;
  availableSeats?: number;
  bookedSeats: number;
  createdAt: string;
  primaryImage?: string;
  rating?: number;
  reviewCount: number;
}

export default function CompanyPackages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session && session.user.role !== "COMPANY_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/company/packages");
        if (!response.ok) {
          throw new Error("Failed to fetch packages");
        }
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPackages();
    }
  }, [session, toast]);

  // Toggle package status
  const togglePackageStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "PUBLISHED" ? "INACTIVE" : "PUBLISHED";
      
      const response = await fetch(`/api/company/packages/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      
      // Update local state
      setPackages(
        packages.map((pkg) =>
          pkg.id === id ? { ...pkg, status: newStatus } : pkg
        )
      );
      
      toast.success(`Package ${newStatus === "PUBLISHED" ? "published" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating package status:", error);
      toast.error("Failed to update package status");
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/company/packages/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update featured status");
      }
      
      // Update local state
      setPackages(
        packages.map((pkg) =>
          pkg.id === id ? { ...pkg, featured: !currentFeatured } : pkg
        )
      );
      
      toast.success(`Package ${!currentFeatured ? "featured" : "unfeatured"} successfully`);
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  // Delete package
  const deletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package? This action cannot be undone.")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/company/packages/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete package");
      }
      
      // Update local state
      setPackages(packages.filter((pkg) => pkg.id !== id));
      
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  // Filter packages
  const filteredPackages = packages.filter((pkg) => {
    // Apply search filter
    const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = filterStatus === "all" || pkg.status === filterStatus;
    
    // Apply type filter
    const matchesType = filterType === "all" || pkg.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format package type for display
  const formatPackageType = (type: string) => {
    return type.replace("_", " ").replace("ONLY", "Only");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Packages</h1>
        <Link 
          href="/company/packages/create"
          className="bg-secondary text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Package
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Packages
            </label>
            <Input
              type="text"
              placeholder="Search by package name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
            >
              <option value="all">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="INACTIVE">Inactive</option>
              <option value="DRAFT">Draft</option>
              <option value="SOLD_OUT">Sold Out</option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full"
            >
              <option value="all">All Types</option>
              <option value="MAKKAH_ONLY">Makkah Only</option>
              <option value="MADINAH_ONLY">Madinah Only</option>
              <option value="COMBINED">Combined</option>
              <option value="SPECIAL">Special</option>
              <option value="RAMADAN">Ramadan</option>
              <option value="HAJJ">Hajj</option>
            </Select>
          </div>
        </div>
      </Card>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-10">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new package.
          </p>
          <div className="mt-6">
            <Link
              href="/company/packages/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Package
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {pkg.primaryImage ? (
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={pkg.primaryImage}
                            alt={pkg.title}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {pkg.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {new Date(pkg.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPackageType(pkg.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pkg.discountPrice ? (
                      <div>
                        <div className="text-sm text-gray-900 font-medium">
                          SAR {pkg.discountPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          SAR {pkg.basePrice.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        SAR {pkg.basePrice.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {pkg.durationDays} Days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        pkg.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : pkg.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-800"
                          : pkg.status === "DRAFT"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.bookedSeats}/{pkg.availableSeats || "∞"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(pkg.id, pkg.featured)}
                      className={`p-1 rounded-full ${
                        pkg.featured
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {pkg.rating ? pkg.rating.toFixed(1) : "N/A"}{" "}
                        {pkg.reviewCount > 0 && `(${pkg.reviewCount})`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/package/${pkg.slug}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/company/packages/edit/${pkg.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => togglePackageStatus(pkg.id, pkg.status)}
                        className={`${
                          pkg.status === "PUBLISHED"
                            ? "text-amber-600 hover:text-amber-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={pkg.status === "PUBLISHED" ? "Deactivate" : "Publish"}
                      >
                        {pkg.status === "PUBLISHED" ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => deletePackage(pkg.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}