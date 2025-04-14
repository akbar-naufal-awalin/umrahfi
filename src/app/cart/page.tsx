"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, Calendar, Users, CreditCard, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  departureDate: string;
  returnDate: string;
  travelers: number;
}

export default function CartPage() {
  const toast = useToast();
  
  // Sample cart items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "eco-umrah-1",
      title: "Makkah Economy Package",
      price: 1299,
      image: "/images/makkah-package.jpg",
      quantity: 1,
      departureDate: "2023-11-15",
      returnDate: "2023-11-22",
      travelers: 2
    },
    {
      id: "madinah-special-1",
      title: "Madinah Special Package",
      price: 1499,
      image: "/images/madinah-package.jpg",
      quantity: 1,
      departureDate: "2023-12-05",
      returnDate: "2023-12-10",
      travelers: 1
    }
  ]);
  
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const updateTravelers = (id: string, newTravelers: number) => {
    if (newTravelers < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, travelers: newTravelers } : item
    ));
  };
  
  const applyPromoCode = () => {
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === "umrah10") {
        toast.success("Promo code applied successfully!");
      } else {
        toast.error("Invalid promo code");
      }
      setIsApplyingPromo(false);
    }, 1000);
  };
  
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity * item.travelers, 
    0
  );
  
  const discount = promoCode.toLowerCase() === "umrah10" ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-4 p-4">
                  <div className="md:col-span-1">
                    <div className="h-32 bg-primary rounded"></div>
                  </div>
                  
                  <div className="md:col-span-3 pl-0 md:pl-6 mt-4 md:mt-0">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(item.departureDate).toLocaleDateString()} - {new Date(item.returnDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users size={16} className="text-gray-500" />
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateTravelers(item.id, item.travelers - 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center">{item.travelers}</span>
                          <button 
                            onClick={() => updateTravelers(item.id, item.travelers + 1)}
                            className="w-6 h-6 flex items-center justify-center border rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-secondary">
                          ${item.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">/person</span>
                      </div>
                      
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center border-t border-b">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right mt-2">
                      <span className="text-gray-600">
                        Subtotal: ${(item.price * item.quantity * item.travelers).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-${discount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-secondary">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button 
                      onClick={applyPromoCode} 
                      disabled={isApplyingPromo || !promoCode}
                      variant="outline"
                    >
                      {isApplyingPromo ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {promoCode.toLowerCase() === "umrah10" && (
                    <p className="text-green-600 text-xs mt-1">10% discount applied!</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="px-6 pb-6 pt-0">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full">
                    <span className="flex items-center">
                      Proceed to Checkout
                      <ChevronRight size={16} className="ml-2" />
                    </span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <div className="mt-6 bg-primary/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <CreditCard className="mr-2 h-4 w-4" />
                Accepted Payment Methods
              </h4>
              <p className="text-sm text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers. All transactions are secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any packages to your cart yet.
          </p>
          <Link href="/packages">
            <Button>Browse Packages</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 