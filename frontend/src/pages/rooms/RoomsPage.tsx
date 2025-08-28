import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import ApiService from '../../services/api';
import { MapPin, Users, Wifi, Car, Star, Filter, Search } from 'lucide-react';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    roomType: '',
    furnished: '',
    genderPreference: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, filters]);

  const fetchRooms = async () => {
    function shuffleArray(array:any) {
      return array
        .map((value:any) => ({ value, sort: Math.random() })) // assign random sort key
        .sort((a:any, b:any) => a.sort - b.sort)                  // sort by random key
        //@ts-ignore
        .map(({ value }) => value);                       // extract values back
    }
    try {
      const response = await ApiService.getAllRooms();
      const shuffled = shuffleArray(response.data);
      setRooms(shuffled);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = rooms.filter(room => 
      room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.roomType) {
      filtered = filtered.filter(room => room.roomType === filters.roomType);
    }

    if (filters.furnished !== '') {
      filtered = filtered.filter(room => room.furnished === (filters.furnished === 'true'));
    }

    if (filters.genderPreference) {
      filtered = filtered.filter(room => room.genderPreference === filters.genderPreference);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(room => room.price <= parseInt(filters.maxPrice));
    }

    setFilteredRooms(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm">
                <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                <div className="p-6 space-y-3">
                  <div className="bg-gray-200 h-4 w-3/4"></div>
                  <div className="bg-gray-200 h-4 w-1/2"></div>
                  <div className="bg-gray-200 h-6 w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Rooms</h1>
        <p className="text-gray-600">Find your perfect room from our verified listings</p>
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

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredRooms.length} of {rooms.length} rooms
        </p>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Link
              key={room.id}
              to={`/rooms/${room.id}`}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-xl overflow-hidden">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                  <img
                    src={room.imageUrls[0].startsWith('http') ? room.imageUrls[0] : `http://localhost:8081${room.imageUrls[0]}`}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">🏠</div>
                      <p className="text-sm opacity-80">No Image</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                    room.status === 'RENTED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.status || 'Available'}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                    {room.roomType}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{room.location}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {room.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{room.maxOccupancy}</span>
                    </div>
                    {room.furnished && (
                      <div className="flex items-center">
                        <Wifi className="h-4 w-4 mr-1" />
                        <span>Furnished</span>
                      </div>
                    )}
                  </div>
                  {/* <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.5</span>
                  </div> */}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{room.price.toLocaleString()}/mo
                  </span>
                  <span className="text-sm text-gray-500">
                    {room.genderPreference === 'ANY' ? 'Any Gender' : room.genderPreference}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsPage;