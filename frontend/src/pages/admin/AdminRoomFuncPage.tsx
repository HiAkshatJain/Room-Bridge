import React, { useEffect, useState } from 'react';
import { Eye, Trash2, Search } from 'lucide-react';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';

type Room = {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrls: string[];
  price: number;
  furnished: boolean;
  genderPreference: string;
  roomType: string;
  maxOccupancy: number;
  availableFrom: string;
  userId: number;
  userName: string;
};

const AdminRoomFuncPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageIndexMap, setImageIndexMap] = useState<{ [roomId: number]: number }>({});

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [searchTerm, rooms]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexMap((prev) => {
        const updated: { [roomId: number]: number } = {};
        rooms.forEach((room) => {
          const currentIndex = prev[room.id] || 0;
          updated[room.id] = (currentIndex + 1) % (room.imageUrls.length || 1);
        });
        return updated;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [rooms]);

  const fetchRooms = async () => {
    try {
      const response = await ApiService.getAllRooms(); // Adjust to match your backend
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRooms = () => {
    const term = searchTerm.toLowerCase();
    const filtered = rooms.filter((room) =>
      room.title.toLowerCase().includes(term) ||
      room.location.toLowerCase().includes(term) ||
      room.userName.toLowerCase().includes(term)
    );
    setFilteredRooms(filtered);
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      await ApiService.deleteRoomById(roomId);
      toast.success(`Room ${roomId} deleted successfully`);
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleViewRoom = (roomId: number) => {
    window.open(`/rooms/${roomId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-64 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Management</h1>
        <p className="text-gray-600">Manage all listed rooms from hosts</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const currentImageIndex =  imageIndexMap[room.id] || 0;
          const imageUrl =
            room.imageUrls.length > 0
              ? `http://localhost:8081${room.imageUrls[currentImageIndex]}`
              : 'data:image/jpeg;base64,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';

          return (
            <div key={room.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="h-56 bg-gray-100">
                <img
                  src={imageUrl}
                  alt={room.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 flex flex-col justify-between h-[250px]">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{room.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{room.location}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {room.description.length > 150
                      ? `${room.description.slice(0, 150)}...`
                      : room.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      ₹{room.price} / month
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {room.roomType}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Max {room.maxOccupancy}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {room.furnished ? 'Furnished' : 'Unfurnished'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Host: <span className="font-medium">{room.userName}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Available from: {room.availableFrom}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewRoom(room.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="View Room"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminRoomFuncPage;
