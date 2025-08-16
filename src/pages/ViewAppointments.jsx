import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

function ViewAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [appointmentToUpdate, setAppointmentToUpdate] = useState(null);

  useEffect(() => {
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
    // ✅ Optimistically update local state first
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );

    // ✅ Update in Supabase
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;

    // ✅ Refetch to confirm latest from DB
    fetchAppointments();

  } catch (error) {
    alert('Error updating appointment status: ' + error.message);
  } finally {
    // ✅ Always close any open modal
    setShowStatusModal(false);
    setAppointmentToUpdate(null);
    setShowCancelModal(false);
    setAppointmentToCancel(null);
  }
};


const handleDelete = async (id) => {
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting:", error);
  } else {
    // remove from local state
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    
    // ✅ close modal after delete
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  }
};


  // Helper to label filters
  const filterLabel = (f) => {
    const labels = {
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[f] || f;
  };

  // Get counts for each filter
  const counts = {
    all: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  // Status options for update
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-gray-900 font-extrabold text-lg shadow-md">
              MK
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-['Nova_Round',cursive]">M K Construction</h1>
              <p className="text-sm text-yellow-600 font-medium">View Appointments</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="btn-secondary text-sm px-4 py-2"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-4">
            
            {/* Header Row with Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-lg font-bold text-gray-900">
                {filterLabel(filter)} Appointments ({filteredAppointments.length})
              </h3>

              {/* Filter Tags */}
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition flex items-center gap-2
                      ${filter === f 
                        ? 'bg-yellow-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {filterLabel(f)}
                    <span className="text-xs font-bold">({counts[f]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No {filterLabel(filter).toLowerCase()} appointments found.
                </p>
              </div>
            ) : (
              <div
                className="rounded-lg border overflow-y-auto"
                style={{ maxHeight: `${10 * 56}px` }} // expand till 10 rows
              >
                <ol className="divide-y">
                  {filteredAppointments.map((appointment, idx) => (
                    <li
                      key={appointment.id}
                      className={`grid grid-cols-[40px_minmax(300px,1fr)_140px_minmax(280px,auto)] 
                                  items-center gap-3 px-3 py-3 transition
                        ${
                          appointment.status === "pending"
                            ? "bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                            : appointment.status === "confirmed"
                            ? "bg-blue-50 hover:bg-blue-100 border-blue-200"
                            : appointment.status === "completed"
                            ? "bg-green-50 hover:bg-green-100 border-green-200"
                            : appointment.status === "cancelled"
                            ? "bg-red-50 hover:bg-red-100 border-red-200"
                            : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                        }`}
                    >
                      <span className="font-bold text-gray-500">{idx + 1}.</span>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">{appointment.name}</span>
                      <span className="text-xs text-gray-600 text-right">{new Date(appointment.created_at).toLocaleDateString()}</span>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end flex-nowrap">
                        <button
                          className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold whitespace-nowrap"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          View
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold whitespace-nowrap"
                          onClick={() => { setAppointmentToUpdate(appointment); setShowStatusModal(true); }}
                        >
                          Change Status
                        </button>
                        {appointment.status !== "cancelled" && (
                          <button
                            className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-semibold whitespace-nowrap"
                            onClick={() => { setAppointmentToCancel(appointment); setShowCancelModal(true); }}
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="text-xs px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-semibold whitespace-nowrap"
                          onClick={() => { setAppointmentToDelete(appointment); setShowDeleteModal(true); }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
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
                {/* <button
                  onClick={() => setSelectedAppointment(null)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && appointmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Appointment</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to <span className="font-semibold text-red-600">delete</span> the appointment for <span className="font-semibold">{appointmentToDelete.name}</span>?
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex-1"
                onClick={() => handleDelete(appointmentToDelete.id)}
              >
                Delete
              </button>
              <button
                className="btn-secondary flex-1"
                onClick={() => { setShowDeleteModal(false); setAppointmentToDelete(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Appointment</h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to <span className="font-semibold text-red-600">cancel</span> the appointment for <span className="font-semibold">{appointmentToCancel.name}</span>?
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex-1"
                onClick={() => {
                  handleStatusUpdate(appointmentToCancel.id, 'cancelled');
                  setShowCancelModal(false);
                  setAppointmentToCancel(null);
                }}
              >
                Cancel Appointment
              </button>
              {/* <button
                className="btn-secondary flex-1"
                onClick={() => { setShowCancelModal(false); setAppointmentToCancel(null); }}
              >
                Back
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
{showStatusModal && appointmentToUpdate && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
      
      {/* Circular Close Button */}
      <button
        onClick={() => {
          setShowStatusModal(false);
          setAppointmentToUpdate(null);
        }}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white font-bold 
                   hover:bg-red-700 hover:text-white transition-all duration-300 shadow-md"
      >
        ×
      </button>

      <h3 className="text-lg font-bold text-gray-900 mb-4">Change Status</h3>

      <p className="mb-6 text-gray-700">
        Change status for <span className="font-semibold">{appointmentToUpdate.name}</span>:
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            className={`w-full px-4 py-2 rounded-lg font-semibold border transition
              ${appointmentToUpdate.status === opt.value
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-yellow-50'}`}
            disabled={appointmentToUpdate.status === opt.value}
            onClick={() => {
              handleStatusUpdate(appointmentToUpdate.id, opt.value);
              setShowStatusModal(false);
              setAppointmentToUpdate(null);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default ViewAppointments;
