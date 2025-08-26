import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Profile } from '../types';
import ApiService from '../services/api';
import {
  Building,
  User,
  FileText,
  MessageCircle,
  Plus,
  Home,
  Star,
  TrendingUp,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    activeRooms: 0,
    totalReviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await ApiService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const roomsResponse = await ApiService.getMyRooms();
      const totalRooms = roomsResponse.data.length;
      const activeRooms = roomsResponse.data.filter((room: any) => room.status === 'AVAILABLE').length;
      
      setStats({
        totalRooms,
        activeRooms,
        totalReviews: 0, // Would need separate API
        avgRating: 4.2, // Mock data
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Create Room',
      description: 'List a new room for rent',
      icon: Plus,
      link: '/rooms/create',
      color: 'bg-blue-500',
    },
    {
      title: 'My Rooms',
      description: 'Manage your room listings',
      icon: Home,
      link: '/my-rooms',
      color: 'bg-green-500',
    },
    {
      title: 'Messages',
      description: 'Check your conversations',
      icon: MessageCircle,
      link: '/chat',
      color: 'bg-purple-500',
    },
    {
      title: 'Documents',
      description: 'Upload verification documents',
      icon: FileText,
      link: '/documents',
      color: 'bg-orange-500',
    },
  ];

  const statCards = [
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Listings',
      value: stats.activeRooms,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Reviews',
      value: stats.totalReviews,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Average Rating',
      value: stats.avgRating.toFixed(1),
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{profile?.fullName ? `, ${profile.fullName}` : ''}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your Room Bridge account today.
        </p>
      </div>

      {/* Profile Completion Alert */}
      {!profile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <User className="h-5 w-5 text-amber-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Complete your profile</h3>
              <p className="text-sm text-amber-700 mt-1">
                Add your personal information to get started with Room Bridge.
              </p>
            </div>
            <Link
              to="/profile"
              className="ml-auto bg-amber-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">New room inquiry</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Star className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Received new review</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">New message received</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;