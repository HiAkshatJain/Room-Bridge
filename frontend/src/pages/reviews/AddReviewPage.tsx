import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { ArrowLeft, Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const AddReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await ApiService.getRoomById(parseInt(id!));
      setRoom(response.data);
    } catch (error) {
      console.error('Failed to fetch room:', error);
      toast.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await ApiService.addReview({
        roomId: parseInt(id!),
        userId: user!.id,
        rating,
        reviewComment: comment.trim(),
      });
      toast.success('Review added successfully!');
      navigate(`/rooms/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-6"></div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-4">
              <div className="bg-gray-200 h-6 w-3/4"></div>
              <div className="bg-gray-200 h-20 w-full"></div>
              <div className="bg-gray-200 h-10 w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h1>
        <button onClick={() => navigate('/rooms')} className="text-blue-600 hover:text-blue-500">
          ← Back to rooms
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/rooms/${id}`)}
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to room
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add Review</h1>
        <p className="text-gray-600 mt-2">Share your experience with {room.title}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        {/* Room Info */}
        <div className="p-6 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center overflow-hidden">
              {room.imageUrls && room.imageUrls.length > 0 ? (
                <img
                  src={room.imageUrls[0].startsWith('http') ? room.imageUrls[0] : `http://localhost:8081${room.imageUrls[0]}`}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl">🏠</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{room.title}</h3>
              <p className="text-gray-600 text-sm">{room.location}</p>
              <p className="text-green-600 font-medium">₹{room.price.toLocaleString()}/month</p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating} star{rating !== 1 ? 's' : ''} - {
                      rating === 1 ? 'Poor' :
                      rating === 2 ? 'Fair' :
                      rating === 3 ? 'Good' :
                      rating === 4 ? 'Very Good' :
                      'Excellent'
                    }
                  </>
                )}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your experience with this room. What did you like? What could be improved? Your honest feedback helps other users make informed decisions."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on your personal experience with the room</li>
              <li>• Mention specific details about cleanliness, amenities, location</li>
              <li>• Keep your review respectful and professional</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate(`/rooms/${id}`)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewPage;