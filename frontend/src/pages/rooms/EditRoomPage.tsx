import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import ApiService from '../../services/api';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EditRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const [formData, setFormData] = useState<Partial<Room>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    furnished: false,
    roomType: 'PRIVATE',
    availableFrom: '',
    genderPreference: 'ANY',
    maxOccupancy: 1,
  });

  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await ApiService.getRoomById(parseInt(id!));
      const room = response.data;
      setFormData({
        title: room.title,
        description: room.description,
        price: room.price,
        location: room.location,
        furnished: room.furnished,
        roomType: room.roomType,
        availableFrom: room.availableFrom,
        genderPreference: room.genderPreference,
        maxOccupancy: room.maxOccupancy,
      });
    } catch (error) {
      console.error('Failed to fetch room:', error);
      toast.error('Failed to load room details');
      navigate('/my-rooms');
    } finally {
      setIsLoadingRoom(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await ApiService.updateRoom(parseInt(id!), formData);
      toast.success('Room updated successfully!');
      navigate(`/rooms/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update room');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingRoom) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-6"></div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="bg-gray-200 h-4 w-24"></div>
                  <div className="bg-gray-200 h-10 w-full rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Room</h1>
        <p className="text-gray-600 mt-2">Update your room details</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Cozy Private Room in Downtown"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="8000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Sector 62, Noida, UP"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your room, amenities, nearby facilities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type *
              </label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PRIVATE">Private Room</option>
                <option value="SHARED">Shared Room</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Occupancy *
              </label>
              <input
                type="number"
                name="maxOccupancy"
                required
                min="1"
                max="10"
                value={formData.maxOccupancy}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available From *
              </label>
              <input
                type="date"
                name="availableFrom"
                required
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender Preference
              </label>
              <select
                name="genderPreference"
                value={formData.genderPreference}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ANY">Any Gender</option>
                <option value="MALE">Male Only</option>
                <option value="FEMALE">Female Only</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="furnished"
                  id="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                  Room is furnished
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomPage;