import React, { useState, useEffect } from 'react';
import { Document } from '../../types';
import ApiService from '../../services/api';
import { FileText, Upload, Trash2, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await ApiService.getMyDocuments();
      console.log(response)
      setDocuments(response.data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    console.log(file)

    setIsUploading(true);
    try {
      const resp = await ApiService.uploadDocument(file);
      console.log(resp)
      toast.success('Document uploaded successfully');
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await ApiService.deleteDocument(id);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete document');
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
      <div className="max-w-4xl mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-8 w-64"></div>
          <div className="bg-white rounded-xl p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-16 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
        <p className="text-gray-600">
          Upload and manage your verification documents. All documents are reviewed by our admin team.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Document</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Choose a document to upload (PDF, JPG, PNG)
          </p>
          <label className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            {isUploading ? 'Uploading...' : 'Choose File'}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Uploaded Documents</h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents uploaded yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Upload your first document to get verified
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {documents.map((document) => (
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
                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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

export default DocumentsPage;