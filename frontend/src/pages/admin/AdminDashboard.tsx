import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Document } from '../../types';
import ApiService from '../../services/api';
import { 
  Users, FileText, Building, Shield, 
  CheckCircle, Clock, XCircle, Eye 
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDocuments: 0,
    totalRooms: 0,
    verifiedUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const Users = await ApiService.getAllUsers();
      const totalUsers = Users.data.length || 0;

      const PendingDocuments = await ApiService.getPendingDocuments();

      let pendingCount = 0;
      for (let i = 0; i < PendingDocuments.data?.length; i++) {
        if (PendingDocuments.data[i].verificationStatus === "PENDING") {
          pendingCount++;
        }
      }

      for (let i = 0; i < Users.data?.length; i++) {
        if (Users.data[i].verificationStatus === "PENDING") {
          pendingCount++;
        }
      }

      const Rooms = await ApiService.getAllRooms();
      const totalRooms = Rooms.data.length || 0;

      let adminCount = 0;

      for (const user of Users.data) {
        if (user.roles.includes('ADMIN')) {
          adminCount++;
        }
      }

      setStats({
        totalUsers: totalUsers || 0,
        pendingDocuments: pendingCount || 0,
        totalRooms: totalRooms || 0,
        verifiedUsers: adminCount || 0,
      });

      // This would be an admin endpoint to get all pending documents
      // For now, we'll use the user's documents endpoint as a placeholder
      try {
        const response = await ApiService.getMyDocuments();
        
        //@ts-ignore
        const pendingDocuments = response.data.filter(doc => doc.verificationStatus === "PENDING");

        console.log(pendingDocuments)
        setDocuments(pendingDocuments);
      } catch (error) {
        // If user doesn't have documents, that's fine for demo
        setDocuments([]);
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentVerification = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await ApiService.verifyDocument(id, status);
      toast.success(`Document ${status.toLowerCase()} successfully`);
      fetchAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update document status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="bg-gray-200 h-12 w-12 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 w-20 mb-2"></div>
                <div className="bg-gray-200 h-6 w-16"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users, documents, and platform oversight</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingDocuments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pending Documents */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Pending Document Verifications</h2>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending documents</p>
                <p className="text-sm text-gray-500 mt-2">All documents have been reviewed</p>
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                {documents.map((document) => (
                  <div key={document.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{document.documentName}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusIcon(document.verificationStatus)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.verificationStatus)}`}>
                              {document.verificationStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`http://localhost:8081${document.documentPath}`, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Document"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {document.verificationStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleDocumentVerification(document.id, 'APPROVED')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDocumentVerification(document.id, 'REJECTED')}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/admin/users"
                className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-600">View and manage user accounts</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/documents"
                className="block p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Document Verification</h3>
                    <p className="text-sm text-gray-600">Review pending documents</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/rooms"
                className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Room Management</h3>
                    <p className="text-sm text-gray-600">Oversee room listings</p>
                  </div>
                </div>
              </Link>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Platform Security</h3>
                    <p className="text-sm text-gray-600">Monitor platform safety</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Document approved</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">Document submitted</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;