"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

export default function ContactPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions or need assistance? We're here to help with your Umrah journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <Card className="bg-white shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Location</h3>
            <p className="text-gray-600">
              123 Business Center<br />
              King Fahd Road<br />
              Riyadh, Saudi Arabia
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-2">
              Customer Support:<br />
              <a href="tel:+966112345678" className="text-secondary hover:underline">
                +966 11 234 5678
              </a>
            </p>
            <p className="text-gray-600">
              Business Inquiries:<br />
              <a href="tel:+966112345679" className="text-secondary hover:underline">
                +966 11 234 5679
              </a>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-2">
              Customer Support:<br />
              <a href="mailto:support@umrahfi.com" className="text-secondary hover:underline">
                support@umrahfi.com
              </a>
            </p>
            <p className="text-gray-600">
              Business Inquiries:<br />
              <a href="mailto:info@umrahfi.com" className="text-secondary hover:underline">
                info@umrahfi.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
        
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Your Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What is your message about?"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
          
          <div className="text-center">
            <Button
              type="submit"
              className="px-8 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Find Us</h2>
        <div className="rounded-lg overflow-hidden h-96 bg-gray-200">
          {/* Placeholder for an actual map */}
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Interactive Map Would Be Displayed Here</p>
          </div>
        </div>
      </div>
    </div>
  );
} 