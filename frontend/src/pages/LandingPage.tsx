import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import { Building, Search, Shield, MessageCircle, Star, MapPin } from 'lucide-react';
import { Room } from '../types';
import Footer from './footer';

const LandingPage: React.FC = () => {

  const [rooms, setRooms] = useState<Room[]>([]);
   
    useEffect(() => {
      fetchRooms();
    }, []);
  
    const fetchRooms = async () => {
      try {
        const response = await ApiService.getRandomRooms();
        setRooms(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } 
    };












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
            {rooms.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Room Image */}
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={`http://localhost:8081${item.imageUrls?.[0] || "/placeholder.png"}`}
                    alt={item.title || "Room image"}
                    className="h-full w-full object-cover"
                  />
                </div>


                <div className="p-6">
                  {/* Location */}
                  <div className="flex items-center text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{item.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{item.description}</p>

                  {/* Price + Max Occupancy */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ₹ {item.price}/mo
                    </span>
                    <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">
                      Max Occupancy: {item.maxOccupancy}
                    </span>
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
     
          <Footer className="mt-20" />
        
      

      
    </div>
  );
};

export default LandingPage;