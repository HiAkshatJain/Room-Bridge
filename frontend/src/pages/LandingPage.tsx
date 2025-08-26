import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Search, Shield, MessageCircle, Star, MapPin } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Find Your Perfect Room with <span className="text-yellow-300">Room Bridge</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Connect with verified room owners and tenants. Safe, secure, and hassle-free room rental experience.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/rooms"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Rooms
              </Link>
              <Link
                to="/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Room Bridge?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive platform for room rentals with safety and convenience at the forefront.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Users</h3>
              <p className="text-gray-600">All users and documents are verified by our admin team for safety.</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600">Find rooms based on location, price, and preferences.</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Chat</h3>
              <p className="text-gray-600">Connect directly with room owners through our chat system.</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Reviews & Ratings</h3>
              <p className="text-gray-600">Make informed decisions with user reviews and ratings.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Rooms */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Rooms</h2>
            <p className="text-gray-600">Discover some of our most popular room listings</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">Delhi, India</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cozy Private Room</h3>
                  <p className="text-gray-600 mb-4">Fully furnished room with all amenities included.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">₹8,000/mo</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Room?</h2>
          <p className="text-xl mb-8">Join thousands of users who have found their ideal living space through Room Bridge.</p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;