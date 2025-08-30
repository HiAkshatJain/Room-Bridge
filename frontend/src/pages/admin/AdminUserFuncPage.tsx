import React, { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import ApiService from '../../services/api';
import toast from 'react-hot-toast';

type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
};

const AdminUserFuncPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getAllUsers(); // Replace with actual API method
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: number) => {
    const resp = await ApiService.deleteUsers(userId);
    console.log(resp);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-8"></div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 h-16 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">View, search, and manage user accounts</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Users ({filteredUsers.length})
          </h2>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No users found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try refining your search term.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredUsers.map(user => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex space-x-2 mt-1">
                    {user.roles.map(role => (
                      <span
                        key={role}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete User"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserFuncPage;
