import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import ApiService from '../../services/api';
import { ArrowLeft, Upload, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomImagesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
      navigate('/my-rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      await ApiService.uploadRoomImages(parseInt(id!), fileArray);
      toast.success('Images uploaded successfully!');
      fetchRoom();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-6"></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h1>
        <button onClick={() => navigate('/my-rooms')} className="text-blue-600 hover:text-blue-500">
          ← Back to my rooms
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Manage Room Images</h1>
        <p className="text-gray-600 mt-2">{room.title}</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Images</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Choose images to upload (JPG, PNG, WebP)
          </p>
          <p className="text-sm text-gray-500 mb-4">
            You can select multiple images at once
          </p>
          <label className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            {isUploading ? 'Uploading...' : 'Choose Images'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleImageUpload(e.target.files);
              }}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Current Images */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Current Images ({room.imageUrls?.length || 0})
          </h2>
        </div>

        {!room.imageUrls || room.imageUrls.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600">No images uploaded yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Upload your first image to showcase your room
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {room.imageUrls.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:8081${imageUrl}`}
                      alt={`${room.title} ${index + 1}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        // Note: This would require a delete image API endpoint
                        toast.info('Delete image functionality would be implemented with a delete API endpoint');
                      }}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          High-quality images help attract more potential tenants. 
          We recommend uploading at least 3-5 images showing different angles of your room.
        </p>
      </div>
    </div>
  );
};

export default RoomImagesPage;