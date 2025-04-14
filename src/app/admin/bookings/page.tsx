"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Edit, 
  Eye,
  Check,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
  CreditCard,
  CheckCheck,
  Users,
  Calendar
} from "lucide-react";

// Mock data for bookings
const mockBookings = [
  {
    id: "BK-001",
    packageName: "Makkah Economy Package",
    customer: {
      name: "Ahmed Abdullah",
      email: "ahmed@example.com",
      phone: "+966 50 123 4567"
    },
    date: "2023-11-15",
    travelDate: "2023-12-10",
    persons: 2,
    amount: 2598,
    status: "confirmed",
    paymentStatus: "paid"
  },
  {
    id: "BK-002",
    packageName: "Madinah Special Package",
    customer: {
      name: "Fatima Rahman",
      email: "fatima@example.com",
      phone: "+966 55 987 6543"
    },
    date: "2023-11-18",
    travelDate: "2023-12-15",
    persons: 4,
    amount: 5996,
    status: "pending",
    paymentStatus: "partial"
  },
  {
    id: "BK-003",
    packageName: "Ramadan Umrah Package",
    customer: {
      name: "Omar Khan",
      email: "omar@example.com",
      phone: "+966 54 111 2222"
    },
    date: "2023-11-20",
    travelDate: "2024-03-05",
    persons: 2,
    amount: 4398,
    status: "confirmed",
    paymentStatus: "paid"
  },
  {
    id: "BK-004",
    packageName: "Economy Umrah Package",
    customer: {
      name: "Aisha Mohammad",
      email: "aisha@example.com",
      phone: "+966 56 333 4444"
    },
    date: "2023-11-25",
    travelDate: "2024-01-20",
    persons: 1,
    amount: 999,
    status: "canceled",
    paymentStatus: "refunded"
  },
  {
    id: "BK-005",
    packageName: "Deluxe Umrah Experience",
    customer: {
      name: "Khalid Al-Saud",
      email: "khalid@example.com",
      phone: "+966 50 777 8888"
    },
    date: "2023-11-28",
    travelDate: "2024-02-10",
    persons: 6,
    amount: 19794,
    status: "pending",
    paymentStatus: "unpaid"
  },
  {
    id: "BK-006",
    packageName: "Short Stay Package",
    customer: {
      name: "Nour Ali",
      email: "nour@example.com",
      phone: "+966 55 555 6666"
    },
    date: "2023-11-30",
    travelDate: "2024-01-05",
    persons: 3,
    amount: 2697,
    status: "confirmed",
    paymentStatus: "paid"
  },
  {
    id: "BK-007",
    packageName: "Basic Umrah Package",
    customer: {
      name: "Hassan Ibrahim",
      email: "hassan@example.com",
      phone: "+966 54 222 3333"
    },
    date: "2023-12-02",
    travelDate: "2024-01-15",
    persons: 2,
    amount: 2198,
    status: "pending",
    paymentStatus: "partial"
  },
  {
    id: "BK-008",
    packageName: "Winter Umrah Package",
    customer: {
      name: "Layla Mahmoud",
      email: "layla@example.com",
      phone: "+966 56 444 5555"
    },
    date: "2023-12-05",
    travelDate: "2024-02-01",
    persons: 5,
    amount: 6495,
    status: "confirmed",
    paymentStatus: "paid"
  },
];

export default function BookingsManagement() {
  const [bookings, setBookings] = useState(mockBookings);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "descending"
  });
  
  const bookingsPerPage = 5;
  
  // Filter options
  const statusOptions = ["all", "confirmed", "pending", "canceled"];
  const paymentOptions = ["all", "paid", "partial", "unpaid", "refunded"];
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtered and sorted bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesPayment = filterPayment === "all" || booking.paymentStatus === filterPayment;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortConfig.key === "date" || sortConfig.key === "travelDate") {
      return sortConfig.direction === "ascending" 
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    }
    
    if (sortConfig.key === "amount") {
      return sortConfig.direction === "ascending" 
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    
    if (sortConfig.key === "customer") {
      return sortConfig.direction === "ascending" 
        ? a.customer.name.localeCompare(b.customer.name)
        : b.customer.name.localeCompare(a.customer.name);
    }
    
    // Default string comparison
    return sortConfig.direction === "ascending" 
      ? a[sortConfig.key].localeCompare(b[sortConfig.key])
      : b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });
  
  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(sortedBookings.length / bookingsPerPage);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  
  // Open modal to view booking details
  const openBookingModal = (booking = null) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };
  
  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    if (confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) {
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
        <div className="flex gap-2">
          <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md flex items-center gap-2 text-sm font-medium">
            <CheckCheck size={16} />
            <span>Confirmed: {bookings.filter(b => b.status === "confirmed").length}</span>
          </div>
          <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-2 text-sm font-medium">
            <Clock size={16} />
            <span>Pending: {bookings.filter(b => b.status === "pending").length}</span>
          </div>
          <div className="px-3 py-2 bg-red-100 text-red-800 rounded-md flex items-center gap-2 text-sm font-medium">
            <X size={16} />
            <span>Canceled: {bookings.filter(b => b.status === "canceled").length}</span>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstBooking + 1}-{Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("id")}
                >
                  <div className="flex items-center gap-1">
                    Booking ID
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("packageName")}
                >
                  <div className="flex items-center gap-1">
                    Package
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("customer")}
                >
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("travelDate")}
                >
                  <div className="flex items-center gap-1">
                    Travel Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Persons
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("amount")}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment
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
              {currentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {booking.packageName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                    <div className="text-xs text-gray-500">{booking.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(booking.travelDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-gray-500" />
                      {booking.persons}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${booking.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.paymentStatus === 'partial' 
                        ? 'bg-blue-100 text-blue-800' 
                        : booking.paymentStatus === 'refunded'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openBookingModal(booking)} 
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {booking.status === "pending" && (
                        <button 
                          onClick={() => handleStatusChange(booking.id, "confirmed")} 
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Confirm booking"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      {booking.status !== "canceled" && (
                        <button 
                          onClick={() => handleStatusChange(booking.id, "canceled")} 
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Cancel booking"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
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
      
      {/* Booking Details Modal */}
      {showModal && currentBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Booking Details
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currentBooking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : currentBooking.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentBooking.status.charAt(0).toUpperCase() + currentBooking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-6">
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentBooking.id}</dd>
                      </div>
                      
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Package</dt>
                        <dd className="mt-1 text-sm text-gray-900">{currentBooking.packageName}</dd>
                      </div>
                      
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Customer Information</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div>{currentBooking.customer.name}</div>
                          <div className="text-gray-600">{currentBooking.customer.email}</div>
                          <div className="text-gray-600">{currentBooking.customer.phone}</div>
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Booking Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(currentBooking.date)}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Travel Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                          <CalendarDays size={14} />
                          {formatDate(currentBooking.travelDate)}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Number of Persons</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                          <Users size={14} />
                          {currentBooking.persons}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                        <dd className="mt-1 text-sm font-medium text-gray-900">${currentBooking.amount.toLocaleString()}</dd>
                      </div>
                      
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                        <dd className="mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            currentBooking.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : currentBooking.paymentStatus === 'partial' 
                              ? 'bg-blue-100 text-blue-800' 
                              : currentBooking.paymentStatus === 'refunded'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {currentBooking.paymentStatus.charAt(0).toUpperCase() + currentBooking.paymentStatus.slice(1)}
                          </span>
                        </dd>
                      </div>
                      
                      <div className="col-span-2 border-t border-gray-200 pt-4">
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Change Status</dt>
                          <div className="flex gap-2">
                            {currentBooking.status !== "confirmed" && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(currentBooking.id, "confirmed");
                                  setShowModal(false);
                                }} 
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Confirm
                              </button>
                            )}
                            
                            {currentBooking.status !== "canceled" && (
                              <button 
                                onClick={() => {
                                  handleStatusChange(currentBooking.id, "canceled");
                                  setShowModal(false);
                                }} 
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 