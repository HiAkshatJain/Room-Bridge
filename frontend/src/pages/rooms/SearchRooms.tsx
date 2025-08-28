import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import ApiService from '../../services/api';
import { MapPin, Users, Wifi, Star, Search } from 'lucide-react';

const SearchRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    roomType: '',
    furnished: '',
    genderPreference: '',
    maxPrice: '',
  });

  // Debounced API fetch when search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchRooms();
        console.log(searchTerm)
      } else {
        setRooms([]); // clear results if no search
      }
    }, 500); // debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm, filters]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      // const response = await ApiService.searchRooms({
      //   search: searchTerm,
      //   ...filters,
      // });
      // setRooms(response.data || []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Rooms</h1>
        <p className="text-gray-600">Find rooms by title or location</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={filters.roomType}
            onChange={(e) => handleFilterChange('roomType', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="PRIVATE">Private</option>
            <option value="SHARED">Shared</option>
          </select>

          <select
            value={filters.furnished}
            onChange={(e) => handleFilterChange('furnished', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Furnished</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <select
            value={filters.genderPreference}
            onChange={(e) => handleFilterChange('genderPreference', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : rooms.length === 0 && searchTerm.trim() !== '' ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Start typing to search rooms</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 rounded-t-xl overflow-hidden">
                {room.imageUrls?.[0] ? (
                  <img
                    src={room.imageUrls[0].startsWith('http') ? room.imageUrls[0] : `http://localhost:8081${room.imageUrls[0]}`}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{room.location}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{room.price.toLocaleString()}/mo
                  </span>
                  <span className="text-sm text-gray-500">{room.genderPreference}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchRooms;
