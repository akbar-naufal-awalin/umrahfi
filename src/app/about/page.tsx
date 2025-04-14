import { CheckCircle, Users, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About UmrahFi</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connecting pilgrims with trusted Umrah service providers for seamless spiritual journeys.
        </p>
      </div>

      {/* Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At UmrahFi, our mission is to make Umrah accessible, affordable, and spiritually enriching for Muslims around the world. We believe that every pilgrim deserves a seamless journey to the holy cities, supported by reliable services and transparent information.
          </p>
          <p className="text-gray-600">
            By connecting pilgrims with verified Umrah service providers, we aim to eliminate the uncertainty and challenges often associated with planning a holy journey, allowing pilgrims to focus on their spiritual experience rather than logistical concerns.
          </p>
        </div>
        <div className="bg-primary/10 p-12 rounded-lg">
          <blockquote className="italic text-xl text-gray-700">
            "Our goal is to transform how Muslims plan and experience their Umrah pilgrimage through technology, transparency, and trusted partnerships."
          </blockquote>
          <p className="text-right mt-4 font-semibold">- UmrahFi Founding Team</p>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Trust & Transparency</h3>
            <p className="text-gray-600">
              We verify all service providers on our platform and ensure transparent pricing with no hidden fees.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customer-Centric</h3>
            <p className="text-gray-600">
              Every decision we make is guided by what's best for the pilgrims who trust us with their journey.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Respect for Tradition</h3>
            <p className="text-gray-600">
              We honor the sacred nature of Umrah while embracing innovation to enhance the experience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Community</h3>
            <p className="text-gray-600">
              We bring together Muslims from around the world, united in their spiritual journey.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">
            UmrahFi was founded in 2023 by a group of tech entrepreneurs who experienced firsthand the challenges of planning an Umrah journey. After facing issues with unreliable services, hidden costs, and limited information, they decided to create a solution that would benefit millions of Muslims worldwide.
          </p>
          <p className="text-gray-600 mb-4">
            The team combined their expertise in technology, travel, and Islamic practices to build a platform that connects pilgrims with verified service providers, offers transparent pricing, and provides comprehensive information about the Umrah journey.
          </p>
          <p className="text-gray-600">
            Today, UmrahFi is growing rapidly, serving pilgrims from over 30 countries and partnering with dozens of trusted Umrah service providers. Our vision is to become the world's leading platform for Umrah planning and booking, making the sacred journey accessible to Muslims everywhere.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Ahmad Ibrahim</h3>
            <p className="text-secondary mb-2">Co-Founder & CEO</p>
            <p className="text-gray-600 text-sm">
              Former travel industry executive with 10+ years of experience in the Middle East tourism sector.
            </p>
          </div>
          
          {/* Team Member 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Fatima Al-Rahman</h3>
            <p className="text-secondary mb-2">Co-Founder & COO</p>
            <p className="text-gray-600 text-sm">
              Tech entrepreneur with multiple successful startups and deep knowledge of Islamic practices.
            </p>
          </div>
          
          {/* Team Member 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold">Mohammed Saleh</h3>
            <p className="text-secondary mb-2">CTO</p>
            <p className="text-gray-600 text-sm">
              Software engineer with 15+ years of experience building scalable platforms and marketplaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 