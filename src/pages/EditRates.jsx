import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

function EditRates() {
  const navigate = useNavigate();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    service: '',
    price_range: '',
    unit: '',
    description: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }
      fetchRates();
    };
    checkUser();
  }, [navigate]);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('construction_rates')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.service || !formData.price_range) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (editingRate) {
        // Update existing rate
        const { error } = await supabase
          .from('construction_rates')
          .update({
            category: formData.category,
            service: formData.service,
            price_range: formData.price_range,
            unit: formData.unit,
            description: formData.description
          })
          .eq('id', editingRate.id);

        if (error) throw error;
        alert('Rate updated successfully!');
      } else {
        // Add new rate
        const { error } = await supabase
          .from('construction_rates')
          .insert([{
            category: formData.category,
            service: formData.service,
            price_range: formData.price_range,
            unit: formData.unit,
            description: formData.description
          }]);

        if (error) throw error;
        alert('Rate added successfully!');
      }

      resetForm();
      fetchRates();
    } catch (error) {
      alert('Error saving rate: ' + error.message);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      category: rate.category,
      service: rate.service,
      price_range: rate.price_range,
      unit: rate.unit || '',
      description: rate.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rate?')) return;

    try {
      const { error } = await supabase
        .from('construction_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Rate deleted successfully!');
      fetchRates();
    } catch (error) {
      alert('Error deleting rate: ' + error.message);
    }
  };

  const resetForm = () => {
    setEditingRate(null);
    setFormData({
      category: '',
      service: '',
      price_range: '',
      unit: '',
      description: ''
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      residential: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      commercial: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      specialized: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    };
    return icons[category] || icons.residential;
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
                <p className="text-sm text-yellow-600 font-medium">Edit Rates</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Nova_Round',cursive]">Manage Construction Rates</h2>
            <p className="text-gray-600 mb-8">Update and manage your construction service rates and pricing</p>
          </div>

          {/* Add/Edit Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingRate ? 'Edit Rate' : 'Add New Rate'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="residential">Residential Construction</option>
                    <option value="commercial">Commercial Construction</option>
                    <option value="specialized">Specialized Services</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Service *</label>
                  <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., New Home Construction"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Price Range *</label>
                  <input
                    type="text"
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., $150-250"
                  />
                </div>

                <div>
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., per sq ft, per hour"
                  />
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
                  placeholder="Additional details about this service..."
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingRate ? 'Update Rate' : 'Add Rate'}
                </button>
                {editingRate && (
                  <button type="button" onClick={resetForm} className="btn-outline">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Rates List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Current Rates ({rates.length})</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading rates...</p>
              </div>
            ) : rates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No rates found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {['residential', 'commercial', 'specialized'].map(category => {
                  const categoryRates = rates.filter(rate => rate.category === category);
                  if (categoryRates.length === 0) return null;

                  return (
                    <div key={category} className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 capitalize flex items-center gap-2">
                        {getCategoryIcon(category)}
                        {category} Construction
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryRates.map((rate) => (
                          <div key={rate.id} className="construction-card p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h5 className="font-semibold text-gray-900">{rate.service}</h5>
                              <span className="badge-primary capitalize text-xs">{rate.category}</span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Price:</span>
                                <span className="font-semibold text-gray-900">{rate.price_range}</span>
                              </div>
                              {rate.unit && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Unit:</span>
                                  <span className="text-sm text-gray-900">{rate.unit}</span>
                                </div>
                              )}
                              {rate.description && (
                                <p className="text-sm text-gray-600">{rate.description}</p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(rate)}
                                className="flex-1 btn-outline text-sm py-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(rate.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditRates;
