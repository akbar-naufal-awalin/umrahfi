"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: "USR-001",
    name: "Abdullah Mohammed",
    email: "abdullah@example.com",
    phone: "+966 50 123 4567",
    role: "customer",
    status: "active",
    joinedDate: "2023-05-15",
    lastLogin: "2023-11-28",
    location: "Riyadh, Saudi Arabia",
    bookings: 3
  },
  {
    id: "USR-002",
    name: "Aisha Rahman",
    email: "aisha@example.com",
    phone: "+966 55 987 6543",
    role: "customer",
    status: "active",
    joinedDate: "2023-06-20",
    lastLogin: "2023-11-30",
    location: "Jeddah, Saudi Arabia",
    bookings: 1
  },
  {
    id: "USR-003",
    name: "Mohammed Khan",
    email: "mohammed@example.com",
    phone: "+966 54 555 7777",
    role: "admin",
    status: "active",
    joinedDate: "2023-03-10",
    lastLogin: "2023-12-05",
    location: "Makkah, Saudi Arabia",
    bookings: 0
  },
  {
    id: "USR-004",
    name: "Fatima Ali",
    email: "fatima@example.com",
    phone: "+966 56 222 3333",
    role: "customer",
    status: "inactive",
    joinedDate: "2023-07-05",
    lastLogin: "2023-10-15",
    location: "Madinah, Saudi Arabia",
    bookings: 2
  },
  {
    id: "USR-005",
    name: "Omar Abdullah",
    email: "omar@example.com",
    phone: "+966 50 888 9999",
    role: "guide",
    status: "active",
    joinedDate: "2023-04-22",
    lastLogin: "2023-12-01",
    location: "Riyadh, Saudi Arabia",
    bookings: 0
  },
  {
    id: "USR-006",
    name: "Noor Ibrahim",
    email: "noor@example.com",
    phone: "+966 55 444 5555",
    role: "customer",
    status: "active",
    joinedDate: "2023-08-17",
    lastLogin: "2023-11-25",
    location: "Dammam, Saudi Arabia",
    bookings: 1
  },
  {
    id: "USR-007",
    name: "Khalid Hassan",
    email: "khalid@example.com",
    phone: "+966 54 777 8888",
    role: "customer",
    status: "blocked",
    joinedDate: "2023-09-30",
    lastLogin: "2023-10-05",
    location: "Jeddah, Saudi Arabia",
    bookings: 0
  },
  {
    id: "USR-008",
    name: "Layla Mahmoud",
    email: "layla@example.com",
    phone: "+966 56 111 2222",
    role: "customer",
    status: "active",
    joinedDate: "2023-10-12",
    lastLogin: "2023-12-03",
    location: "Taif, Saudi Arabia",
    bookings: 2
  },
  {
    id: "USR-009",
    name: "Hassan Ahmed",
    email: "hassan@example.com",
    phone: "+966 50 333 4444",
    role: "admin",
    status: "active",
    joinedDate: "2023-01-05",
    lastLogin: "2023-12-05",
    location: "Riyadh, Saudi Arabia",
    bookings: 0
  },
  {
    id: "USR-010",
    name: "Zainab Ali",
    email: "zainab@example.com",
    phone: "+966 55 666 7777",
    role: "customer",
    status: "active",
    joinedDate: "2023-11-01",
    lastLogin: "2023-11-29",
    location: "Makkah, Saudi Arabia",
    bookings: 1
  }
];

export default function UsersManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "joinedDate",
    direction: "descending"
  });
  
  const usersPerPage = 5;
  
  // Filter options
  const roleOptions = ["all", "customer", "admin", "guide"];
  const statusOptions = ["all", "active", "inactive", "blocked"];
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtered and sorted users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === "joinedDate" || sortConfig.key === "lastLogin") {
      return sortConfig.direction === "ascending" 
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    }
    
    if (sortConfig.key === "bookings") {
      return sortConfig.direction === "ascending" 
        ? a.bookings - b.bookings
        : b.bookings - a.bookings;
    }
    
    // Default string comparison
    return sortConfig.direction === "ascending" 
      ? a[sortConfig.key].localeCompare(b[sortConfig.key])
      : b[sortConfig.key].localeCompare(a[sortConfig.key]);
  });
  
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Open user modal
  const openUserModal = (user = null, editMode = false) => {
    setCurrentUser(user || {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active",
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: "",
      location: "",
      bookings: 0
    });
    setIsEditMode(editMode);
    setShowModal(true);
  };
  
  // Handle user status change
  const handleStatusChange = (id, newStatus) => {
    if (confirm(`Are you sure you want to ${newStatus === 'blocked' ? 'block' : newStatus === 'active' ? 'activate' : 'deactivate'} this user?`)) {
      setUsers(users.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      ));
    }
  };
  
  // Handle user form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      setUsers([...users, currentUser]);
    }
    
    setShowModal(false);
  };
  
  // Handle user deletion
  const handleDeleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };
  
  // Handle input change in the modal form
  const handleInputChange = (field, value) => {
    setCurrentUser({
      ...currentUser,
      [field]: value
    });
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
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => openUserModal(null, false)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-2xl font-bold text-gray-800">
              {users.filter(u => u.status === 'active').length}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Admins</h3>
            <p className="text-2xl font-bold text-gray-800">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Blocked Users</h3>
            <p className="text-2xl font-bold text-gray-800">
              {users.filter(u => u.status === 'blocked').length}
            </p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <XCircle className="h-6 w-6 text-red-600" />
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
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
              <option value="guide">Guides</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>
      </div>
      
      {/* Users Table */}
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
                    User
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("role")}
                >
                  <div className="flex items-center gap-1">
                    Role
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("joinedDate")}
                >
                  <div className="flex items-center gap-1">
                    Joined Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("bookings")}
                >
                  <div className="flex items-center gap-1">
                    Bookings
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
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
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'guide' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'inactive' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(user.joinedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="dropdown relative inline-block text-left">
                      <button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                      <div className="dropdown-menu origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden z-10">
                        <div className="py-1">
                          <button 
                            onClick={() => openUserModal(user, true)}
                            className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 inline mr-2" />
                            Edit
                          </button>
                          
                          {user.status !== "active" && (
                            <button 
                              onClick={() => handleStatusChange(user.id, "active")}
                              className="text-green-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <Unlock className="h-4 w-4 inline mr-2" />
                              Activate
                            </button>
                          )}
                          
                          {user.status !== "blocked" && (
                            <button 
                              onClick={() => handleStatusChange(user.id, "blocked")}
                              className="text-red-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <Lock className="h-4 w-4 inline mr-2" />
                              Block
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <Trash className="h-4 w-4 inline mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
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
      
      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {isEditMode ? 'Edit User' : 'Add New User'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={currentUser.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={currentUser.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={currentUser.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={currentUser.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                          </label>
                          <select
                            id="role"
                            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentUser.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                            <option value="guide">Guide</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            id="status"
                            className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={currentUser.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditMode ? 'Save Changes' : 'Add User'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
      
      {/* JavaScript to handle dropdown menu */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('click', function(event) {
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
              if (!dropdown.contains(event.target)) {
                dropdown.querySelector('.dropdown-menu').classList.add('hidden');
              }
            });
            
            if (event.target.closest('.dropdown')) {
              const menu = event.target.closest('.dropdown').querySelector('.dropdown-menu');
              menu.classList.toggle('hidden');
            }
          });
        `
      }} />
    </div>
  );
} 