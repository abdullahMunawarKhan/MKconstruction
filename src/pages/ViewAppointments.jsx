import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

function ViewAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }
      fetchAppointments();
    };
    checkUser();
  }, [navigate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'pending') // Only fetch pending by default
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      alert('Appointment status updated successfully!');
      fetchAppointments();
    } catch (error) {
      alert('Error updating appointment status: ' + error.message);
    }
  };

  // Only show pending appointments by default
  const filteredAppointments = appointments;

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
                <p className="text-sm text-yellow-600 font-medium">View Appointments</p>
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-['Nova_Round',cursive]">Pending Appointment Requests</h2>
            <p className="text-gray-600 mb-8">Click a card to view full appointment details</p>
          </div>

          {/* Appointments List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Pending Appointments ({filteredAppointments.length})
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No pending appointments found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="cursor-pointer bg-yellow-50 hover:bg-yellow-100 rounded-xl shadow p-6 flex flex-col items-center transition"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{appointment.name}</h4>
                    <span className="text-sm text-gray-600">{appointment.email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="text-gray-900">{selectedAppointment.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-900">{selectedAppointment.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <p className="text-gray-900 capitalize">{selectedAppointment.status}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Project Type:</span>
                    <p className="text-gray-900 capitalize">{selectedAppointment.project_type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Project Size:</span>
                    <p className="text-gray-900">{selectedAppointment.project_size || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Timeline:</span>
                    <p className="text-gray-900">{selectedAppointment.timeline || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Budget:</span>
                    <p className="text-gray-900">{selectedAppointment.budget || 'Not specified'}</p>
                  </div>
                </div>
                {selectedAppointment.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Project Description:</span>
                    <p className="text-gray-900 mt-1">{selectedAppointment.description}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Submitted:</span>
                  <p className="text-gray-900">{new Date(selectedAppointment.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
                      className="btn-primary flex-1"
                    >
                      Confirm Appointment
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex-1"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAppointments;
