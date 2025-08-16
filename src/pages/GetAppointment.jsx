import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

function GetAppointment() {
  const [copyStatus, setCopyStatus] = useState({ phone: false, email: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    projectSize: '',
    timeline: '',
    budget: '',
    description: ''
  });

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handlePhoneClick = () => {
    // Copy to clipboard
    copyToClipboard('+91 9922526531', 'phone');
    
    // Open phone app (works on mobile)
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
      window.location.href = 'tel:+919922526531';
    }
  };

  const handleEmailClick = () => {
    // Copy to clipboard
    copyToClipboard('mkconstruction@gmail.com', 'email');
    
    // Open email app
    window.location.href = 'mailto:mkconstruction@gmail.com';
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
    
    try {
      const { error } = await supabase.from('appointments').insert([{
        name: formData.name,
        
        phone: formData.phone,
        project_type: formData.projectType,
        project_size: formData.projectSize,
        timeline: formData.timeline,
        
        description: formData.description,
        status: 'pending'
      }]);

      if (error) throw error;

      alert('Thank you! We will contact you within 24 hours to schedule your appointment.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        projectSize: '',
        timeline: '',
        budget: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting appointment:', error);
      alert('There was an error submitting your appointment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 font-['Nova_Round',cursive]">Schedule an Appointment</h1>
          <p className="text-gray-600 mb-4 text-base sm:text-lg">Let's discuss your construction project and get started</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-5">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <button 
                    onClick={handlePhoneClick}
                    className="text-gray-600 hover:text-yellow-600 transition-colors cursor-pointer text-left break-all"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="break-all">+91 9922526531</span>
                      {copyStatus.phone && (
                        <span className="text-green-600 text-xs font-medium">✓ Copied!</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">(Mr. Munawar Khan)</div>
                  </button>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <button 
                    onClick={handleEmailClick}
                    className="text-gray-600 hover:text-yellow-600 transition-colors cursor-pointer text-left break-all"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="break-all text-sm">mkconstruction@gmail.com</span>
                      {copyStatus.email && (
                        <span className="text-green-600 text-xs font-medium">✓ Copied!</span>
                      )}
                    </div>
                  </button>
                </div>
              </div>
              {/* Response Time */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Response Time</h3>
                  <p className="text-gray-600 text-sm">Within 24 hours</p>
                </div>
              </div>
            </div>
            {/* What to Expect */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-2">What to Expect</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Initial consultation to understand your project</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Site visit and assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Detailed project proposal and timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Transparent pricing and contract review</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Appointment Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="form-label">Project Type *</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="form-input w-full"
                >
                  <option value="">Select project type</option>
                  <option value="residential">Residential Construction</option>
                  <option value="commercial">Commercial Construction</option>
                  <option value="renovation">Renovation/Remodeling</option>
                  <option value="addition">Home Addition</option>
                  <option value="repair">Repair/Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Project Size</label>
                <select
                  name="projectSize"
                  value={formData.projectSize}
                  onChange={handleInputChange}
                  className="form-input w-full"
                >
                  <option value="">Select project size</option>
                  <option value="300 sq ft">300 sq ft</option>
                  <option value="600 sq ft">600 sq ft</option>
                  <option value="900 sq ft">900 sq ft</option>
                  <option value="above 1000 sq ft">above 1000 sq ft</option>
                </select>
              </div>
              <div>
                <label className="form-label">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="form-input w-full"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (Within 1 month)</option>
                  <option value="soon">Soon (1-3 months)</option>
                  <option value="planning">Planning Phase (3-6 months)</option>
                  <option value="future">Future (6+ months)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Project Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="form-input w-full"
                  placeholder="Describe your project requirements, goals, and any specific details..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Schedule Appointment
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary"
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetAppointment;
