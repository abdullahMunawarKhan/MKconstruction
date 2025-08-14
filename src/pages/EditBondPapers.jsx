import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

function EditBondPapers() {
  const navigate = useNavigate();
  const [bondPapers, setBondPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }
      fetchBondPapers();
    };
    checkUser();
  }, [navigate]);

  const fetchBondPapers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bond_papers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBondPapers(data || []);
    } catch (error) {
      console.error('Error fetching bond papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadFileToStorage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `bond-papers/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    return fileName; // Return the file path instead of public URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.file) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    // Validate file type
    if (formData.file.type !== 'application/pdf') {
      alert('Please select a valid PDF file.');
      return;
    }

    // Validate file size (10MB limit)
    if (formData.file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    try {
      setUploading(true);
      const filePath = await uploadFileToStorage(formData.file);

      const { error } = await supabase.from('bond_papers').insert([{
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_path: filePath,
        file_name: formData.file.name,
        file_size: formData.file.size,
        file_type: formData.file.type
      }]);

      if (error) throw error;

      alert('Bond paper uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        file: null
      });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchBondPapers();
    } catch (error) {
      alert('Error uploading bond paper: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, filePath) => {
    if (!window.confirm('Are you sure you want to delete this bond paper?')) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from('bond_papers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete file from storage
      if (filePath) {
        await supabase.storage.from('documents').remove([filePath]);
      }

      alert('Bond paper deleted successfully!');
      fetchBondPapers();
    } catch (error) {
      alert('Error deleting bond paper: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-gray-900 font-extrabold text-lg shadow-lg">
                MK
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-['Nova_Round',cursive]">M K Construction</h1>
                <p className="text-sm text-yellow-600 font-medium">Edit Bond Papers</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin-dashboard')}
                className="btn-secondary text-sm px-4 py-2"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Nova_Round',cursive]">Manage Bond Papers</h2>
            <p className="text-gray-600 mb-8">Upload, edit, and manage construction bond documents</p>
          </div>

          {/* Upload Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upload New Bond Paper</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., Performance Bond Template"
                  />
                </div>

                <div>
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    <option value="performance">Performance Bond</option>
                    <option value="payment">Payment Bond</option>
                    <option value="bid">Bid Bond</option>
                    <option value="maintenance">Maintenance Bond</option>
                    <option value="subdivision">Subdivision Bond</option>
                    <option value="license">License Bond</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-input"
                  placeholder="Brief description of the bond paper..."
                ></textarea>
              </div>

              <div>
                <label className="form-label">File *</label>
                                 <input
                   type="file"
                   name="file"
                   onChange={handleInputChange}
                   ref={fileInputRef}
                   required
                   accept=".pdf"
                   className="form-input"
                 />
                 <p className="text-sm text-gray-500 mt-1">Only PDF files are accepted (Max 10MB)</p>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? 'Uploading...' : 'Upload Bond Paper'}
              </button>
            </form>
          </div>

          {/* Bond Papers List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Existing Bond Papers ({bondPapers.length})</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading bond papers...</p>
              </div>
            ) : bondPapers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No bond papers found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bondPapers.map((paper) => (
                  <div key={paper.id} className="construction-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className="badge-primary capitalize">{paper.category}</span>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">{paper.title}</h4>
                    {paper.description && (
                      <p className="text-gray-600 text-sm mb-3">{paper.description}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{paper.file_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatFileSize(paper.file_size)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                                         <div className="flex gap-2">
                       <a
                         href={supabase.storage.from('documents').getPublicUrl(paper.file_path).data.publicUrl}
                         download={paper.file_name}
                         className="flex-1 btn-outline text-sm py-2 text-center"
                       >
                         📥 Download
                       </a>
                       <button
                         onClick={() => handleDelete(paper.id, paper.file_path)}
                         className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                       >
                         Delete
                       </button>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBondPapers;
