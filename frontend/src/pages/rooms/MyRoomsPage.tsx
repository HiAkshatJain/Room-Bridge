import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import ApiService from '../../services/api';
import { Plus, MapPin, Users, Edit, Trash2, Eye, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const MyRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      const response = await ApiService.getMyRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Failed to load your rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      await ApiService.deleteRoom(id);
      toast.success('Room deleted successfully');
      fetchMyRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await ApiService.updateRoomStatus(id, status);
      toast.success('Room status updated successfully');
      fetchMyRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="bg-gray-200 h-32 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 w-3/4"></div>
                  <div className="bg-gray-200 h-4 w-1/2"></div>
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rooms</h1>
          <p className="text-gray-600">Manage your room listings</p>
        </div>
        <Link
          to="/rooms/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms yet</h3>
          <p className="text-gray-600 mb-6">Create your first room listing to get started</p>
          <Link
            to="/rooms/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Room
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow-sm border">
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-xl overflow-hidden">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                  <img
                    src={room.imageUrls[0].startsWith('http') ? room.imageUrls[0] : `http://localhost:8081${room.imageUrls[0]}`}
                    alt={room.title}
                    className="w-full h-full object-cover"
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
                  <select
                    value={room.status || 'AVAILABLE'}
                    onChange={(e) => handleStatusChange(room.id!, e.target.value)}
                    className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RENTED">Rented</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{room.location}</span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{room.maxOccupancy}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {room.roomType}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    ₹{room.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="flex space-x-2">
                    <Link
                      to={`/rooms/${room.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Room"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/rooms/${room.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit Room"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/rooms/${room.id}/images`}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Manage Images"
                    >
                      <Camera className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(room.id!)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Room"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoomsPage;