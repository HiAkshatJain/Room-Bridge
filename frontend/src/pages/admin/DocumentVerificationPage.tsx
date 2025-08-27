import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import ApiService from '../../services/api';
import { 
  FileText, Eye, CheckCircle, XCircle, Clock, 
  Filter, Search, Download 
} from 'lucide-react';
import toast from 'react-hot-toast';

const DocumentVerificationPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, filter, searchTerm]);

  const fetchDocuments = async () => {
    try {
      // Note: This would be an admin endpoint to get all documents
      // For demo purposes, we'll use the user's documents endpoint
      const response = await ApiService.getMyDocuments();
      
      // Mock additional documents for demo
      const mockDocuments = [
        {
          id: 101,
          documentName: 'Aadhar_Card_John_Doe.pdf',
          documentPath: '/uploads/documents/aadhar-john.pdf',
          verificationStatus: 'PENDING' as const,
        },
        {
          id: 102,
          documentName: 'PAN_Card_Jane_Smith.pdf',
          documentPath: '/uploads/documents/pan-jane.pdf',
          verificationStatus: 'PENDING' as const,
        },
        {
          id: 103,
          documentName: 'Passport_Mike_Johnson.pdf',
          documentPath: '/uploads/documents/passport-mike.pdf',
          verificationStatus: 'APPROVED' as const,
        },
        {
          id: 104,
          documentName: 'License_Sarah_Wilson.pdf',
          documentPath: '/uploads/documents/license-sarah.pdf',
          verificationStatus: 'REJECTED' as const,
        },
      ];

      setDocuments([...response.data, ...mockDocuments]);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      // Use mock data if API fails
      const mockDocuments = [
        {
          id: 101,
          documentName: 'Aadhar_Card_John_Doe.pdf',
          documentPath: '/uploads/documents/aadhar-john.pdf',
          verificationStatus: 'PENDING' as const,
        },
        {
          id: 102,
          documentName: 'PAN_Card_Jane_Smith.pdf',
          documentPath: '/uploads/documents/pan-jane.pdf',
          verificationStatus: 'PENDING' as const,
        },
      ];
      setDocuments(mockDocuments);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (filter !== 'ALL') {
      filtered = filtered.filter(doc => doc.verificationStatus === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
  };

  const handleVerification = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await ApiService.verifyDocument(id, status);
      toast.success(`Document ${status.toLowerCase()} successfully`);
      
      // Update local state
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === id ? { ...doc, verificationStatus: status } : doc
        )
      );
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

  const getFilterCount = (filterType: typeof filter) => {
    if (filterType === 'ALL') return documents.length;
    return documents.filter(doc => doc.verificationStatus === filterType).length;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 mb-8"></div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Verification</h1>
        <p className="text-gray-600">Review and verify user-submitted documents</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType} ({getFilterCount(filterType)})
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Documents ({filteredDocuments.length})
          </h2>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents found</p>
            <p className="text-sm text-gray-500 mt-2">
              {filter === 'ALL' 
                ? 'No documents have been submitted yet'
                : `No ${filter.toLowerCase()} documents found`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted by User #{Math.floor(Math.random() * 1000) + 1}
                      </p>
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
                    
                    {/* <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `http://localhost:8081${document.documentPath}`;
                        link.download = document.documentName;
                        link.click();
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Download Document"
                    >
                      <Download className="h-5 w-5" />
                    </button> */}

                    {document.verificationStatus === 'PENDING' && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleVerification(document.id, 'APPROVED')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerification(document.id, 'REJECTED')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVerificationPage;