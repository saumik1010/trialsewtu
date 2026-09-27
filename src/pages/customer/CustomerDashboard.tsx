import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../lib/utils';
import { AlertCircle, Clock, CheckCircle2, Wrench, ShieldAlert, Calendar, MessageSquare, Send, X } from 'lucide-react';

export function CustomerDashboard() {
  const { currentUser, jobs = [], users = [], complaints = [], submitComplaint } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Complaint modal state
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Service Quality Issue');
  const [complaintBookingId, setComplaintBookingId] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Auto-open complaint modal if query param has ?action=complaint
  useEffect(() => {
    if (searchParams.get('action') === 'complaint') {
      setShowComplaintModal(true);
    }
  }, [searchParams]);

  const myJobs = (jobs || []).filter(j => j.customerId === currentUser?.id);
  const displayJobs = myJobs.length > 0 ? myJobs : (jobs || []);
  const sortedJobs = [...displayJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const activeJobs = sortedJobs.filter(j => !['completed', 'cancelled'].includes(j.status));
  const pastJobs = sortedJobs.filter(j => ['completed', 'cancelled'].includes(j.status));
  const myComplaints = (complaints || []).filter(c => c.userId === currentUser?.id || c.userName === currentUser?.name);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'requested': return <Badge variant="secondary">Looking for worker</Badge>;
      case 'assigned': return <Badge variant="warning">Worker Assigned</Badge>;
      case 'accepted': return <Badge variant="warning">Worker Accepted</Badge>;
      case 'on_the_way': return <Badge variant="default">On the way</Badge>;
      case 'arrived': return <Badge variant="default">Arrived</Badge>;
      case 'started': return <Badge variant="default">Work in progress</Badge>;
      case 'completed': return <Badge variant="success">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getWorkerName = (workerId?: string) => {
    if (!workerId) return 'Pending Match';
    return (users || []).find(u => u.id === workerId)?.name || 'Verified Cooperative Technician';
  };

  const handleLodgeComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDetails.trim()) return;

    submitComplaint({
      userId: currentUser?.id || 'cust-1',
      userName: currentUser?.name || 'Citizen Customer',
      userRole: 'customer',
      bookingId: complaintBookingId || undefined,
      subject: `[${complaintCategory}] ${complaintSubject}`,
      details: complaintDetails
    });

    const ticketId = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
    setComplaintSubject('');
    setComplaintDetails('');
    setComplaintBookingId('');

    // Clear query param if open
    if (searchParams.get('action') === 'complaint') {
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  };

  const closeModal = () => {
    setShowComplaintModal(false);
    setSubmittedTicket(null);
    if (searchParams.get('action') === 'complaint') {
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Customer'}</h1>
          <p className="text-slate-500">Manage your services, track bookings, and lodge complaints here.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button 
            variant="outline" 
            className="gap-2 border-red-300 text-red-700 hover:bg-red-50 font-bold"
            onClick={() => setShowComplaintModal(true)}
          >
            <AlertCircle className="w-4 h-4 text-red-600" /> Register Complaint
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold" 
            onClick={() => navigate('/dashboard/customer/bookings')}
          >
            <Calendar className="w-4 h-4" /> My Bookings
          </Button>
          <Button variant="destructive" className="gap-2" onClick={() => navigate('/dashboard/customer/book?type=emergency')}>
            <ShieldAlert className="w-4 h-4" /> Emergency
          </Button>
          <Button onClick={() => navigate('/dashboard/customer/book')} className="bg-blue-900 hover:bg-blue-800 text-white font-bold">
            Book Service
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Section (2 Cols): Active Bookings, Register Complaint Banner, and Recent Services */}
        <div className="md:col-span-2 space-y-6">
          {/* Prominent Register Complaint Action in Left Section */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Have a concern or service dispute?</h3>
                <p className="text-xs text-slate-600">Lodge an official grievance directly to the Cooperative Oversight Council for 24hr resolution.</p>
              </div>
            </div>
            <Button 
              size="sm"
              onClick={() => setShowComplaintModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" /> Register Complaint
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Active Bookings</CardTitle>
                <CardDescription>Your current and upcoming service requests</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-bold text-blue-900 hover:underline"
                onClick={() => navigate('/dashboard/customer/bookings')}
              >
                Track In Detail &rarr;
              </Button>
            </CardHeader>
            <CardContent>
              {(activeJobs || []).length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <p>No active bookings found.</p>
                  <Button variant="ghost" className="text-blue-900 underline mt-2" onClick={() => navigate('/dashboard/customer/book')}>Book a service now</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeJobs || []).map(job => (
                    <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-lg bg-slate-50 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{job.service}</span>
                          {job.priority === 'emergency' && <Badge variant="destructive">Emergency</Badge>}
                          {getStatusBadge(job.status)}
                        </div>
                        <p className="text-sm text-slate-600">{job.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(job.scheduledDate)}</span>
                          <span className="flex items-center gap-1"><Wrench className="w-3 h-3" /> {getWorkerName(job.workerId)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/customer/bookings/${job.id}`)} className="font-bold border-blue-900 text-blue-900 hover:bg-blue-50">
                        Track & Pay
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Services</CardTitle>
                <CardDescription>Completed and past service history</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs font-bold text-blue-900 hover:underline"
                onClick={() => navigate('/dashboard/customer/bookings')}
              >
                View Invoices &rarr;
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(pastJobs || []).slice(0, 3).map(job => (
                  <div key={job.id} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900">{job.service}</p>
                      <p className="text-sm text-slate-500">{formatDate(job.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(job.price)}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1 justify-end"><CheckCircle2 className="w-3 h-3" /> Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registered Grievance History if any exist */}
          {myComplaints.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  My Registered Complaints & Grievances ({myComplaints.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myComplaints.map(c => (
                  <div key={c.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{c.subject}</span>
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">{c.status}</span>
                    </div>
                    <p className="text-slate-600">{c.details}</p>
                    {c.resolutionNotes && (
                      <p className="text-emerald-700 font-medium bg-emerald-50 p-1.5 rounded mt-1">Resolution: {c.resolutionNotes}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Section: Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="default" 
                className="w-full justify-start bg-blue-900 text-white hover:bg-blue-800 font-bold text-xs" 
                onClick={() => navigate('/dashboard/customer/bookings')}
              >
                <Calendar className="w-4 h-4 mr-2" /> View & Track All My Bookings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-xs font-semibold text-red-700 border-red-200 hover:bg-red-50"
                onClick={() => setShowComplaintModal(true)}
              >
                <AlertCircle className="w-4 h-4 mr-2 text-red-600" /> Register Complaint
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs font-semibold" onClick={() => navigate('/dashboard/customer/book?service=Plumbing')}>
                Need a Plumber?
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs font-semibold" onClick={() => navigate('/dashboard/customer/book?service=Electrical')}>
                Electrical Repair
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs font-semibold" onClick={() => navigate('/dashboard/customer/book?service=Cleaning')}>
                Deep Cleaning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Register Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-slate-900 text-base">Register Service Complaint</h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedTicket ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-lg">Complaint Registered Successfully</h4>
                  <p className="text-xs text-slate-600">Ticket Reference: <strong className="text-blue-900 font-mono">{submittedTicket}</strong></p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto pt-2">
                    Your complaint has been dispatched to the Cooperative Dispute Mediation Cell. An ombudsman will contact you and review the technician logs within 24 hours.
                  </p>
                </div>
                <Button onClick={closeModal} className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleLodgeComplaint} className="space-y-3.5">
                <p className="text-xs text-slate-500">
                  SHRAMSETU guarantees neutral cooperative dispute resolution. Zero risk of automated account bans.
                </p>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Complaint Category</label>
                  <select
                    value={complaintCategory}
                    onChange={e => setComplaintCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 bg-white"
                  >
                    <option value="Service Quality Issue">Poor Workmanship / Incomplete Service</option>
                    <option value="Pricing or Overcharging">Unreasonable / Extra Tariff Charges</option>
                    <option value="Delay or No Show">Worker Late or Did Not Arrive</option>
                    <option value="Behavior or Safety">Worker Conduct / Safety Concern</option>
                    <option value="Damage Claim">Property Damage During Service</option>
                    <option value="Other">Other General Grievance</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Related Booking (Optional)</label>
                  <select
                    value={complaintBookingId}
                    onChange={e => setComplaintBookingId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 bg-white"
                  >
                    <option value="">-- General / Not Linked to Specific Booking --</option>
                    {(displayJobs || []).map(j => (
                      <option key={j.id} value={j.id}>
                        #{j.id} - {j.service} ({formatDate(j.createdAt)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subject / Issue Summary</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Tap still leaking after repair completion"
                    value={complaintSubject}
                    onChange={e => setComplaintSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Detailed Description</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Describe what occurred, technician details, and what resolution you request..."
                    value={complaintDetails}
                    onChange={e => setComplaintDetails(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <Button type="button" variant="outline" className="flex-1 text-xs" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Submit Complaint
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
