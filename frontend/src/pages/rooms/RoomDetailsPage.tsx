import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Room, Review } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { 
  MapPin, Users, Calendar, Star, MessageCircle, 
  Wifi, Car, Shield, ArrowLeft, Plus 
} from 'lucide-react';
import toast from 'react-hot-toast';

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
      fetchReviews();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await ApiService.getRoomById(parseInt(id!));
      setRoom(response.data);
    } catch (error) {
      console.error('Failed to fetch room details:', error);
      toast.error('Failed to load room details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await ApiService.getRoomReviews(parseInt(id!));
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-32 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-xl"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4"></div>
              <div className="bg-gray-200 h-4 w-1/2"></div>
              <div className="bg-gray-200 h-20 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h1>
        <Link to="/rooms" className="text-blue-600 hover:text-blue-500">
          ← Back to all rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <Link
          to="/rooms"
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to all rooms
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden">
            {room.imageUrls && room.imageUrls.length > 0 ? (
              <img
                src={room.imageUrls[currentImageIndex].startsWith('http') 
                  ? room.imageUrls[currentImageIndex] 
                  : `http://localhost:8081${room.imageUrls[currentImageIndex]}`}
                alt={room.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">🏠</div>
                  <p className="text-lg opacity-80">No Images Available</p>
                </div>
              </div>
            )}
            
            {room.imageUrls && room.imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {room.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {room.imageUrls && room.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {room.imageUrls.slice(0, 4).map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8081${imageUrl}`}
                    alt={`${room.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Room Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                room.status === 'RENTED' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {room.status || 'Available'}
              </span>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{room.location}</span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{room.description}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">Max {room.maxOccupancy} people</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">Available from {room.availableFrom}</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-700">{room.genderPreference === 'ANY' ? 'Any Gender' : room.genderPreference}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700">{room.furnished ? '✅ Furnished' : '❌ Unfurnished'}</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-green-600">
                    ₹{room.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">per month</span>
                </div>
                {user && user.id !== room.userId && (
                  <Link
                    to={`/chat?userId=${room.userId}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Contact Owner
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Reviews ({reviews.length})
            </h2>
            {user && user.id !== room.userId && (
              <Link
                to={`/rooms/${room.id}/review`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </Link>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet</p>
            <p className="text-sm text-gray-500 mt-2">Be the first to review this room</p>
          </div>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{review.userName}</h4>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt!).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.reviewComment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;