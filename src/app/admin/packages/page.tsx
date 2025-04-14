"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown
} from "lucide-react";

// Mock data for packages
const mockPackages = [
  {
    id: "pkg-001",
    name: "Makkah Economy Package",
    type: "Economy",
    duration: "7 days",
    price: 1299,
    availability: 25,
    featured: true,
    status: "active"
  },
  {
    id: "pkg-002",
    name: "Madinah Special Package",
    type: "Premium",
    duration: "10 days",
    price: 1499,
    availability: 15,
    featured: true,
    status: "active"
  },
  {
    id: "pkg-003",
    name: "Ramadan Umrah Package",
    type: "Premium",
    duration: "14 days",
    price: 2199,
    availability: 30,
    featured: true,
    status: "active"
  },
  {
    id: "pkg-004",
    name: "Economy Umrah Package",
    type: "Economy",
    duration: "5 days",
    price: 999,
    availability: 40,
    featured: false,
    status: "active"
  },
  {
    id: "pkg-005",
    name: "Short Stay Package",
    type: "Economy",
    duration: "4 days",
    price: 899,
    availability: 50,
    featured: false,
    status: "active"
  },
  {
    id: "pkg-006",
    name: "Deluxe Umrah Experience",
    type: "Luxury",
    duration: "12 days",
    price: 3299,
    availability: 10,
    featured: true,
    status: "active"
  },
  {
    id: "pkg-007",
    name: "Basic Umrah Package",
    type: "Economy",
    duration: "7 days",
    price: 1099,
    availability: 0,
    featured: false,
    status: "sold out"
  },
  {
    id: "pkg-008",
    name: "Winter Umrah Package",
    type: "Standard",
    duration: "10 days",
    price: 1299,
    availability: 5,
    featured: false,
    status: "draft"
  },
];

export default function PackagesManagement() {
  const [packages, setPackages] = useState(mockPackages);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending"
  });
  
  const packagesPerPage = 5;
  
  // Filter options
  const typeOptions = ["All", "Economy", "Standard", "Premium", "Luxury"];
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtered and sorted packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pkg.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || pkg.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  
  // Pagination
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = sortedPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(sortedPackages.length / packagesPerPage);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  
  // Open modal for add/edit
  const openPackageModal = (pkg = null) => {
    setCurrentPackage(pkg);
    setShowModal(true);
  };
  
  // Handle delete package
  const handleDeletePackage = (id) => {
    if (confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
  };
  
  // Handle form submission (add/edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send data to an API
    // For now, we'll just update the local state
    
    // Form data gathering would go here
    // const formData = new FormData(e.target);
    // const packageData = Object.fromEntries(formData);
    
    setShowModal(false);
    // In a real app, you would update the packages state here
  };
  
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
        <h1 className="text-2xl font-bold text-gray-800">Package Management</h1>
        <button 
          onClick={() => openPackageModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition"
        >
          <Plus size={18} />
          Add Package
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search packages..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstPackage + 1}-{Math.min(indexOfLastPackage, filteredPackages.length)} of {filteredPackages.length} packages
        </div>
      </div>
      
      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Package Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("type")}
                >
                  <div className="flex items-center gap-1">
                    Type
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("price")}
                >
                  <div className="flex items-center gap-1">
                    Price
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Availability
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                        <div className="text-sm text-gray-500">{pkg.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pkg.type === 'Luxury' 
                        ? 'bg-purple-100 text-purple-800' 
                        : pkg.type === 'Premium' 
                        ? 'bg-blue-100 text-blue-800'
                        : pkg.type === 'Standard'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {pkg.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${pkg.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pkg.availability} spots</div>
                    {pkg.availability < 10 && pkg.availability > 0 && (
                      <div className="text-xs text-amber-600">Low availability</div>
                    )}
                    {pkg.availability === 0 && (
                      <div className="text-xs text-red-600">Sold out</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pkg.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : pkg.status === 'draft' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pkg.status}
                    </span>
                    {pkg.featured && (
                      <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openPackageModal(pkg)} 
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeletePackage(pkg.id)} 
                        className="text-red-600 hover:text-red-900 p-1"
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <div className="hidden md:flex">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <span className="md:hidden text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add/Edit Package Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {currentPackage ? 'Edit Package' : 'Add New Package'}
                      </h3>
                      <div className="mt-6 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Package Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={currentPackage?.name || ''}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Type
                            </label>
                            <select
                              id="type"
                              name="type"
                              defaultValue={currentPackage?.type || 'Economy'}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                              {typeOptions.filter(type => type !== 'All').map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                              Duration
                            </label>
                            <input
                              type="text"
                              name="duration"
                              id="duration"
                              defaultValue={currentPackage?.duration || '7 days'}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              defaultValue={currentPackage?.price || 999}
                              min="0"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                              Availability
                            </label>
                            <input
                              type="number"
                              name="availability"
                              id="availability"
                              defaultValue={currentPackage?.availability || 20}
                              min="0"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              defaultValue={currentPackage?.status || 'active'}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="draft">Draft</option>
                              <option value="sold out">Sold Out</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center h-full pt-6">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              defaultChecked={currentPackage?.featured || false}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                              Featured Package
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            defaultValue={currentPackage?.description || ''}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {currentPackage ? 'Update Package' : 'Add Package'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 