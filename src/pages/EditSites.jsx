import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

function EditSites() {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: null,
    address: '',
    start_date: '',
    final_date: '',
    cover_image_file: null,
    cover_image_url: '',
    additional_files: [],
    additional_image_urls: [],
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const additionalFilesRef = useRef(null);
  const navigate = useNavigate();

  // Ensure only authenticated admin can access
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/admin-login');
    };
    checkUser();
  }, [navigate]);

  // Fetch sites
  const fetchSites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('completed_sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching:', error);
    else setSites(data);
    setLoading(false);
  };

  useEffect(() => { fetchSites(); }, []);

  // Reset the form
  const resetForm = () => {
    setFormData({
      id: null,
      address: '',
      start_date: '',
      final_date: '',
      cover_image_file: null,
      cover_image_url: '',
      additional_files: [],
      additional_image_urls: [],
    });
    setFormMode('add');
    if (fileInputRef.current) fileInputRef.current.value = null;
    if (additionalFilesRef.current) additionalFilesRef.current.value = null;
  };

  // Handle form input changes
  const onFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cover_image') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        cover_image_file: file,
        cover_image_url: file ? URL.createObjectURL(file) : prev.cover_image_url,
      }));
    } else if (name === 'additional_images') {
      const filesArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        additional_files: filesArray,
        additional_image_urls: filesArray.map(f => URL.createObjectURL(f)),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Upload a file and get public URL
  const uploadImageToStorage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;
    const { error: uploadError } = await supabase.storage
      .from('site-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('site-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Add or Update site
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.start_date || !formData.final_date) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setUploading(true);
      let coverImageUrl = formData.cover_image_url;

      // Upload cover image if new file selected
      if (formData.cover_image_file) {
        coverImageUrl = await uploadImageToStorage(formData.cover_image_file);
      }

      let siteId = formData.id;

      if (formMode === 'add') {
        const { data, error } = await supabase.from('completed_sites').insert([{
          address: formData.address,
          start_date: formData.start_date,
          final_date: formData.final_date,
          cover_image_url: coverImageUrl,
        }]).select();

        if (error) throw error;
        siteId = data[0].id;
        alert('New site added!');
      } else if (formMode === 'edit' && formData.id) {
        const { error } = await supabase.from('completed_sites').update({
          address: formData.address,
          start_date: formData.start_date,
          final_date: formData.final_date,
          cover_image_url: coverImageUrl,
        }).eq('id', formData.id);
        if (error) throw error;
        alert('Site updated!');
      }

      // Upload additional images and save to site_images table
      for (const file of formData.additional_files) {
        const url = await uploadImageToStorage(file);
        const { error } = await supabase.from('site_images').insert([{
          site_id: siteId,
          image_url: url,
        }]);
        if (error) console.error('Error inserting additional image:', error);
      }

      resetForm();
      fetchSites();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Edit existing site
  const onEdit = async (site) => {
    setFormMode('edit');

    // Fetch additional images for site
    const { data: extraImages } = await supabase
      .from('site_images')
      .select('image_url')
      .eq('site_id', site.id);

    setFormData({
      id: site.id,
      address: site.address,
      start_date: site.start_date,
      final_date: site.final_date,
      cover_image_file: null,
      cover_image_url: site.cover_image_url,
      additional_files: [],
      additional_image_urls: extraImages?.map(img => img.image_url) || [],
    });

    if (fileInputRef.current) fileInputRef.current.value = null;
    if (additionalFilesRef.current) additionalFilesRef.current.value = null;
  };

  // Delete site
  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site? This will also remove its images.')) return;
    const { error } = await supabase.from('completed_sites').delete().eq('id', id);
    if (error) {
      alert(`Delete failed: ${error.message}`);
    } else {
      alert('Site deleted.');
      if (formData.id === id) resetForm();
      fetchSites();
    }
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
                <p className="text-sm text-yellow-600 font-medium">Edit Sites</p>
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 font-['Nova_Round',cursive]">Edit Sites - Manage Completed Sites</h1>

          {/* Add/Edit Form */}
          <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {formMode === 'add' ? 'Add New Site' : 'Edit Site'}
            </h2>

            <div className="mb-4">
              <label className="form-label">Address<span className="text-red-600">*</span></label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={onFormChange}
                required
                className="form-input"
                placeholder="Site address"
              />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="form-label">Start Date<span className="text-red-600">*</span></label>
                <input type="date" name="start_date" value={formData.start_date} onChange={onFormChange} required className="form-input" />
              </div>
              <div className="flex-1">
                <label className="form-label">Final Date<span className="text-red-600">*</span></label>
                <input type="date" name="final_date" value={formData.final_date} onChange={onFormChange} required className="form-input" />
              </div>
            </div>

            {/* Cover Image */}
            <div className="mb-4">
              <label className="form-label">
                Cover Image {formMode === 'add' ? <span className="text-red-600">*</span> : '(optional)'}
              </label>
              <input type="file" accept="image/*" name="cover_image" onChange={onFormChange} ref={fileInputRef} className="form-input" />
              {formData.cover_image_url && (
                <img src={formData.cover_image_url} alt="Cover Preview" className="mt-3 max-w-xs max-h-48 object-cover rounded border" />
              )}
            </div>

            {/* Additional Images */}
            <div className="mb-4">
              <label className="form-label">Additional Images</label>
              <input type="file" accept="image/*" multiple name="additional_images" onChange={onFormChange} ref={additionalFilesRef} className="form-input" />
              {formData.additional_image_urls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {formData.additional_image_urls.map((url, i) => (
                    <img key={i} src={url} alt={`Additional ${i}`} className="w-full h-24 object-cover rounded border" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={uploading} className="btn-primary">
                {formMode === 'add' ? 'Add Site' : (uploading ? 'Updating...' : 'Update Site')}
              </button>
              {formMode === 'edit' && (
                <button type="button" onClick={resetForm} className="btn-outline">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Sites List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sites...</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Existing Sites ({sites.length})</h2>
              {sites.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No sites found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {sites.map(site => (
                    <div key={site.id} className="construction-card overflow-hidden flex flex-col">
                      <img src={site.cover_image_url} alt={site.address} className="h-40 object-cover" />
                      <div className="p-4 flex flex-col flex-grow">
                        <p className="font-semibold text-lg mb-1 truncate">{site.address}</p>
                        <p className="text-sm text-gray-600">Start: {new Date(site.start_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Final: {new Date(site.final_date).toLocaleDateString()}</p>
                        <div className="mt-auto flex gap-2 pt-4">
                          <button onClick={() => onEdit(site)} className="flex-1 btn-primary text-sm py-2">Edit</button>
                          <button onClick={() => onDelete(site.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditSites;
