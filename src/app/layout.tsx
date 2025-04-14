import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag, Menu, X } from "lucide-react";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UmrahFi - Book Your Umrah Packages",
  description: "Find and book the best Umrah packages from verified travel companies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-secondary">UmrahFi</span>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/packages" className="text-gray-700 hover:text-secondary">Packages</Link>
                <Link href="/companies" className="text-gray-700 hover:text-secondary">Companies</Link>
                <Link href="/about" className="text-gray-700 hover:text-secondary">About Us</Link>
                <Link href="/contact" className="text-gray-700 hover:text-secondary">Contact</Link>
              </nav>
              
              {/* User Actions */}
              <div className="flex items-center space-x-4">
                {session ? (
                  <div className="relative group">
                    <button className="flex items-center text-gray-700 hover:text-secondary">
                      <User className="mr-1 h-5 w-5" />
                      <span className="hidden sm:inline">{session.user.name?.split(' ')[0] || 'Account'}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                      {session.user.role === "COMPANY_ADMIN" ? (
                        <Link href="/company/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Company Dashboard
                        </Link>
                      ) : (
                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          My Account
                        </Link>
                      )}
                      <Link href="/account/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Bookings
                      </Link>
                      <Link href="/api/auth/signout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign Out
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-secondary flex items-center"
                  >
                    <User className="mr-1 h-5 w-5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
                
                <Link href="/cart" className="text-gray-700 hover:text-secondary">
                  <ShoppingBag className="h-5 w-5" />
                </Link>
                
                {/* Mobile Menu Button */}
                <button className="md:hidden text-gray-700">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main>{children}</main>
        
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">UmrahFi</h3>
                <p className="text-gray-400 mb-4">
                  Your trusted platform for booking Umrah packages from verified travel providers.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53a8.348 8.348 0 002.048-2.124 8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477 4.073 4.073 0 01-1.86-.513v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/packages" className="text-gray-400 hover:text-white">Umrah Packages</Link></li>
                  <li><Link href="/companies" className="text-gray-400 hover:text-white">Travel Companies</Link></li>
                  <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog & Resources</Link></li>
                  <li><Link href="/faqs" className="text-gray-400 hover:text-white">FAQs</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                  <li><Link href="/help" className="text-gray-400 hover:text-white">Help Center</Link></li>
                  <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4">Contact</h3>
                <p className="text-gray-400 mb-2">123 Main Street</p>
                <p className="text-gray-400 mb-2">Makkah, Saudi Arabia</p>
                <p className="text-gray-400 mb-2">Email: info@umrahfi.com</p>
                <p className="text-gray-400">Phone: +966 123 456 7890</p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} UmrahFi. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
