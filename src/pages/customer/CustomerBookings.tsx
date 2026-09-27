import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  MapPin, Clock, Star, Phone, MessageSquare, ShieldCheck, 
  CheckCircle2, AlertTriangle, FileText, ChevronRight, 
  ArrowLeft, Download, CreditCard, QrCode, AlertCircle, Wrench
} from 'lucide-react';
import { formatDate, formatCurrency, cn } from '../../lib/utils';
import { InteractiveMap } from '../../components/common/InteractiveMap';
import { WorkerProfile, JobFeedback, JobPayment } from '../../types';

export function CustomerBookings() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { 
    currentUser, 
    jobs = [], 
    users = [], 
    respondExtraCharges, 
    payJob, 
    submitFeedback, 
    submitComplaint 
  } = useStore();

  const myJobs = (jobs || []).filter(j => j.customerId === currentUser?.id);
  const displayJobs = myJobs.length > 0 ? myJobs : (jobs || []);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(id || (displayJobs.length > 0 ? displayJobs[0].id : null));

  React.useEffect(() => {
    if (id) {
      setSelectedJobId(id);
    } else if (!selectedJobId && displayJobs.length > 0) {
      setSelectedJobId(displayJobs[0].id);
    }
  }, [id, displayJobs, selectedJobId]);

  // Modals & Panels
  const [showCallModal, setShowCallModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'worker'; text: string; time: string }[]>([
    { sender: 'worker', text: 'Namaste Priya ji! I am packing the plumbing toolkit and leaving shortly.', time: '10:15 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackQuality, setFeedbackQuality] = useState(5);
  const [feedbackBehaviour, setFeedbackBehaviour] = useState(5);
  const [feedbackPunctuality, setFeedbackPunctuality] = useState(5);
  const [feedbackCleanliness, setFeedbackCleanliness] = useState(5);
  const [feedbackCommunication, setFeedbackCommunication] = useState(5);
  const [feedbackWouldRequest, setFeedbackWouldRequest] = useState(true);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Issue / Complaint Modal
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  const selectedJob = (jobs || []).find(j => j.id === selectedJobId) || displayJobs[0];
  const foundWorker = (users || []).find(u => u.id === selectedJob?.workerId && u.role === 'worker') as WorkerProfile | undefined;
  const assignedWorker: WorkerProfile | undefined = foundWorker || (selectedJob?.workerId ? {
    id: selectedJob.workerId,
    name: 'Rajesh Kumar',
    email: 'rajesh@shramsetu.in',
    phone: '+91 98200 12345',
    role: 'worker',
    skills: [selectedJob.service || 'Plumbing Solutions'],
    experience: 6,
    rating: 4.9,
    completedJobs: 142,
    status: 'busy',
    cooperativeId: selectedJob.cooperativeId || 'coop-1',
    gender: 'male',
    earnings: 45000,
    serviceLocality: selectedJob.locality || 'Bandra West',
    location: selectedJob.locality || 'Bandra West, Mumbai',
    serviceRadius: 10,
    coordinates: { lat: 19.0596, lng: 72.8295 },
    isWomenWorker: false,
    workload: 1,
    languages: ['Hindi', 'Marathi', 'English'],
    certifications: [],
    earningsHistory: [],
    verifiedDocuments: [{ type: 'Aadhaar', idMasked: 'XXXX-XXXX-4589', verified: true }],
    reviews: []
  } : undefined);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'worker', text: 'Ji, noted! I will call you upon arrival at the gate.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  const handleProcessPayment = () => {
    if (!selectedJob) return;
    setIsPaying(true);
    setTimeout(() => {
      const finalAmt = selectedJob.price + (selectedJob.extraCharges?.approved ? selectedJob.extraCharges.amount : 0);
      const paymentRecord: JobPayment = {
        method: paymentMethod,
        transactionId: `PAY-${Date.now().toString().slice(-8)}`,
        paidAt: new Date().toISOString(),
        amount: finalAmt,
        invoiceNumber: `INV-SHRAM-2026-${selectedJob.id.slice(-4)}`
      };
      payJob(selectedJob.id, paymentRecord);
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const handleSubmitFeedbackForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    const feedback: JobFeedback = {
      rating: feedbackRating,
      serviceQuality: feedbackQuality,
      professionalBehaviour: feedbackBehaviour,
      punctuality: feedbackPunctuality,
      cleanliness: feedbackCleanliness,
      communication: feedbackCommunication,
      wouldRequestAgain: feedbackWouldRequest,
      writtenFeedback: feedbackComment,
      submittedAt: new Date().toISOString()
    };
    submitFeedback(selectedJob.id, feedback);
    setFeedbackSubmitted(true);
  };

  const handleRegisterComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !currentUser) return;
    submitComplaint({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: 'customer',
      bookingId: selectedJob.id,
      subject: complaintSubject || 'Service Issue',
      details: complaintDetails
    });
    setComplaintSuccess(true);
    setTimeout(() => {
      setShowComplaintModal(false);
      setComplaintSuccess(false);
      setComplaintSubject('');
      setComplaintDetails('');
    }, 2000);
  };

  const getStatusStepIndex = (status: string) => {
    const steps = ['requested', 'assigned', 'accepted', 'on_the_way', 'arrived', 'started', 'completed'];
    return steps.indexOf(status);
  };

  const statusList = [
    { key: 'requested', label: 'Requested' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'on_the_way', label: 'On The Way' },
    { key: 'arrived', label: 'Arrived' },
    { key: 'started', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  const currentStepIdx = getStatusStepIndex(selectedJob?.status || 'requested');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Bookings & Live Service Tracking</h1>
          <p className="text-slate-500 text-sm">Monitor active requests, verify worker credentials, inspect work proofs and process direct payments.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/customer/book')} className="bg-blue-900 text-white hover:bg-blue-800">
          Book New Service
        </Button>
      </div>

      {displayJobs.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No bookings yet</h3>
          <p className="text-sm mt-1 mb-4">You have not placed any service orders yet.</p>
          <Button onClick={() => navigate('/dashboard/customer/book')} className="bg-blue-900 text-white">
            Book a Verified Worker
          </Button>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column: Bookings Selector List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Recent Service Orders</h3>
            {(displayJobs || []).map(job => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setPaymentSuccess(false);
                    setFeedbackSubmitted(false);
                  }}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer bg-white text-left",
                    isSelected 
                      ? "border-blue-900 ring-2 ring-blue-900/20 shadow-sm" 
                      : "border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{job.service}</h4>
                    <Badge variant={job.status === 'completed' ? 'success' : job.priority === 'emergency' ? 'destructive' : 'default'}>
                      {job.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1.5">{job.description}</p>
                  
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(job.createdAt)}
                    </span>
                    <span className="font-bold text-slate-900">{formatCurrency(job.price)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Booking Detail & Live Tracking */}
          {selectedJob && (
            <div className="lg:col-span-8 space-y-6">
              {/* Status Stepper */}
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-blue-900 text-white flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Booking ID: #{selectedJob.id}</span>
                    <h2 className="text-lg font-bold">{selectedJob.service}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-800 text-blue-100 px-3 py-1 rounded-full font-medium">
                      Scheduled: {formatDate(selectedJob.scheduledDate)}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowComplaintModal(true)}
                      className="text-xs bg-red-800/80 hover:bg-red-700 text-white px-2.5 py-1 rounded-md font-medium flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" /> Report Issue
                    </button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Visual Tracker Bar */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Live Service Status</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {statusList.map((step, idx) => {
                        const stepIndex = getStatusStepIndex(step.key);
                        const isDone = currentStepIdx >= stepIndex;
                        const isCurrent = selectedJob.status === step.key;
                        return (
                          <div key={step.key} className="text-center space-y-1">
                            <div className={cn(
                              "h-2 rounded-full transition-all",
                              isDone ? "bg-emerald-600" : "bg-slate-200",
                              isCurrent && "ring-2 ring-emerald-400 ring-offset-1 animate-pulse"
                            )} />
                            <span className={cn(
                              "text-[10px] font-semibold block capitalize truncate",
                              isDone ? "text-emerald-800 font-bold" : "text-slate-400"
                            )}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Worker Information Card */}
                  {assignedWorker ? (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img 
                          src={assignedWorker.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'} 
                          alt={assignedWorker.name} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-blue-900"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{assignedWorker.name}</h3>
                            {assignedWorker.isWomenWorker && (
                              <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">
                                Verified Women Worker
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 font-medium">{assignedWorker.skills.join(', ')}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 font-semibold text-amber-700">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {assignedWorker.rating} ({assignedWorker.completedJobs} jobs)
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-700">
                              <ShieldCheck className="w-3.5 h-3.5" /> Police & Skill Verified
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowChatModal(true)}
                          className="flex-1 sm:flex-initial gap-1.5 border-slate-300"
                        >
                          <MessageSquare className="w-4 h-4 text-blue-700" /> Chat
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowCallModal(true)}
                          className="flex-1 sm:flex-initial gap-1.5 border-slate-300"
                        >
                          <Phone className="w-4 h-4 text-emerald-700" /> Call
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                      Cooperative dispatch is currently assigning the nearest available specialist in your locality.
                    </div>
                  )}

                  {/* Interactive Locality & Live Transit Map */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-700" />
                        Live Proximity & Travel Path
                      </h4>
                      <span className="text-xs text-slate-500">
                        Destination: {selectedJob.address}
                      </span>
                    </div>

                    <InteractiveMap 
                      customerLocality={selectedJob.locality}
                      customerAddress={selectedJob.address}
                      workerName={assignedWorker?.name || 'Assigned Worker'}
                      workerLocality={assignedWorker?.serviceLocality || 'Nearby'}
                      distanceKm={selectedJob.estimatedDistanceKm || 2.4}
                      estimatedTravelMins={selectedJob.estimatedTravelMins || 12}
                      status={selectedJob.status}
                      className="h-64"
                      showExactRoute={['on_the_way', 'arrived', 'started', 'completed'].includes(selectedJob.status)}
                    />
                  </div>

                  {/* Customer Uploaded Media & Worker Proofs */}
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    {/* Customer Reported Media */}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-700" />
                        Customer Problem Media
                      </h4>
                      {selectedJob?.media && selectedJob.media.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {(selectedJob.media || []).map((m, i) => (
                            <div key={i} className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                              <img src={m.url} alt={m.label} className="w-full h-24 object-cover" />
                              <p className="text-[10px] text-slate-600 p-1 truncate font-medium">{m.label}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No preliminary media attached.</p>
                      )}
                    </div>

                    {/* Worker Verification / Work Proof */}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-emerald-700" />
                        Technician Work Proof
                      </h4>
                      {selectedJob.workProof ? (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-2 gap-2">
                            {selectedJob.workProof.beforePhoto && (
                              <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                                <img src={selectedJob.workProof.beforePhoto} alt="Before" className="w-full h-20 object-cover" />
                                <span className="text-[10px] block p-1 font-bold text-slate-600">Before Repair</span>
                              </div>
                            )}
                            {selectedJob.workProof.afterPhoto && (
                              <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
                                <img src={selectedJob.workProof.afterPhoto} alt="After" className="w-full h-20 object-cover" />
                                <span className="text-[10px] block p-1 font-bold text-emerald-700">After Completed</span>
                              </div>
                            )}
                          </div>
                          {selectedJob.workProof.notes && (
                            <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                              "{selectedJob.workProof.notes}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Inspection / repair proof will appear once work begins.</p>
                      )}
                    </div>
                  </div>

                  {/* Extra Charges Approval Section */}
                  {selectedJob.extraCharges && (
                    <div className="p-4 border border-amber-200 bg-amber-50/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-700" />
                          <h4 className="text-sm font-bold text-amber-950">Additional Parts Charge Requested</h4>
                        </div>
                        <span className="text-sm font-bold text-amber-900">
                          {formatCurrency(selectedJob.extraCharges.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-amber-800">
                        Worker requested approval for: <strong>"{selectedJob.extraCharges.description}"</strong>
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-medium text-slate-600">
                          Status: {selectedJob.extraCharges.approved ? (
                            <span className="text-emerald-700 font-bold">✓ Approved by you</span>
                          ) : (
                            <span className="text-amber-800 font-bold">Pending Approval</span>
                          )}
                        </span>
                        {!selectedJob.extraCharges.approved && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => respondExtraCharges(selectedJob.id, false)}
                              className="text-xs border-amber-300 hover:bg-amber-100"
                            >
                              Decline
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => respondExtraCharges(selectedJob.id, true)}
                              className="text-xs bg-emerald-700 text-white hover:bg-emerald-800"
                            >
                              Approve ₹{selectedJob.extraCharges.amount}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment & Invoice Flow */}
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Direct Cooperative Settlement</h4>
                        <p className="text-xs text-slate-500">100% transparent fee. Zero platform commissions deducted.</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-950">
                          {formatCurrency(selectedJob.price + (selectedJob.extraCharges?.approved ? selectedJob.extraCharges.amount : 0))}
                        </div>
                        <span className="text-[11px] text-emerald-700 font-semibold">Zero Commission Architecture</span>
                      </div>
                    </div>

                    {selectedJob.payment ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span>Payment Settled ({selectedJob.payment.method.toUpperCase()})</span>
                          </div>
                          <span className="text-xs font-mono font-medium text-slate-600">
                            Txn: {selectedJob.payment.transactionId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                          <span>Invoice #{selectedJob.payment.invoiceNumber}</span>
                          <button 
                            type="button"
                            onClick={() => window.print()}
                            className="text-blue-900 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Digital Invoice
                          </button>
                        </div>
                      </div>
                    ) : selectedJob.status === 'completed' ? (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold text-slate-700">Select Instant Payment Method:</div>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={cn(
                              "p-3 rounded-lg border text-center font-medium text-xs transition-all flex flex-col items-center gap-1",
                              paymentMethod === 'upi' ? "bg-white border-blue-900 ring-2 ring-blue-900 text-blue-950" : "bg-white border-slate-200 text-slate-700"
                            )}
                          >
                            <QrCode className="w-5 h-5 text-blue-700" />
                            <span>UPI / QR Scan</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={cn(
                              "p-3 rounded-lg border text-center font-medium text-xs transition-all flex flex-col items-center gap-1",
                              paymentMethod === 'card' ? "bg-white border-blue-900 ring-2 ring-blue-900 text-blue-950" : "bg-white border-slate-200 text-slate-700"
                            )}
                          >
                            <CreditCard className="w-5 h-5 text-blue-700" />
                            <span>Debit / Credit Card</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('netbanking')}
                            className={cn(
                              "p-3 rounded-lg border text-center font-medium text-xs transition-all flex flex-col items-center gap-1",
                              paymentMethod === 'netbanking' ? "bg-white border-blue-900 ring-2 ring-blue-900 text-blue-950" : "bg-white border-slate-200 text-slate-700"
                            )}
                          >
                            <CheckCircle2 className="w-5 h-5 text-blue-700" />
                            <span>Net Banking</span>
                          </button>
                        </div>

                        <Button 
                          onClick={handleProcessPayment} 
                          disabled={isPaying}
                          className="w-full bg-emerald-700 text-white hover:bg-emerald-800 h-11 text-sm font-bold"
                        >
                          {isPaying ? 'Processing Instant Direct Settlement...' : `Pay ${formatCurrency(selectedJob.price + (selectedJob.extraCharges?.approved ? selectedJob.extraCharges.amount : 0))} & Generate Invoice`}
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Payment gateway unlocks once the technician completes work and submits completion proof.
                      </p>
                    )}
                  </div>

                  {/* Customer Feedback Flow (Point 3) */}
                  {selectedJob.status === 'completed' && (
                    <div className="p-5 border border-slate-200 rounded-xl bg-white space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-slate-900 text-sm">Customer Rating & Service Review</h4>
                        <p className="text-xs text-slate-500">Your feedback directly supports cooperative worker performance and welfare ratings.</p>
                      </div>

                      {selectedJob.feedback || feedbackSubmitted ? (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                              <Star className="w-4 h-4 fill-current" />
                              <span>{selectedJob.feedback?.rating || feedbackRating} / 5 Stars Awarded</span>
                            </div>
                            <span className="text-xs text-slate-500">Verified Review</span>
                          </div>
                          <p className="text-xs text-slate-700 italic">
                            "{selectedJob.feedback?.writtenFeedback || feedbackComment || 'Great service quality and courteous behaviour.'}"
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitFeedbackForm} className="space-y-4">
                          {/* Overall Star Rating */}
                          <div>
                            <label className="text-xs font-semibold text-slate-700 block mb-1">Overall Service Experience</label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setFeedbackRating(star)}
                                  className="p-1 hover:scale-110 transition-transform"
                                >
                                  <Star className={cn("w-6 h-6", star <= feedbackRating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                                </button>
                              ))}
                              <span className="text-xs font-bold text-slate-700 ml-2">{feedbackRating} of 5 Stars</span>
                            </div>
                          </div>

                          {/* Specific Aspect Ratings */}
                          <div className="grid sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <span className="text-slate-600">Service Quality:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                  <button type="button" key={r} onClick={() => setFeedbackQuality(r)} className={cn("px-2 py-0.5 rounded border text-[11px]", r <= feedbackQuality ? "bg-blue-900 text-white border-blue-900" : "border-slate-200")}>{r}★</button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-600">Professional Behaviour:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                  <button type="button" key={r} onClick={() => setFeedbackBehaviour(r)} className={cn("px-2 py-0.5 rounded border text-[11px]", r <= feedbackBehaviour ? "bg-blue-900 text-white border-blue-900" : "border-slate-200")}>{r}★</button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-600">Punctuality:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                  <button type="button" key={r} onClick={() => setFeedbackPunctuality(r)} className={cn("px-2 py-0.5 rounded border text-[11px]", r <= feedbackPunctuality ? "bg-blue-900 text-white border-blue-900" : "border-slate-200")}>{r}★</button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-slate-600">Cleanliness After Work:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(r => (
                                  <button type="button" key={r} onClick={() => setFeedbackCleanliness(r)} className={cn("px-2 py-0.5 rounded border text-[11px]", r <= feedbackCleanliness ? "bg-blue-900 text-white border-blue-900" : "border-slate-200")}>{r}★</button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Would request again toggle */}
                          <div className="flex items-center gap-3 text-xs">
                            <span className="font-medium text-slate-700">Would you request this technician again?</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setFeedbackWouldRequest(true)}
                                className={cn("px-3 py-1 rounded border text-xs font-semibold", feedbackWouldRequest ? "bg-emerald-700 text-white border-emerald-700" : "border-slate-300 text-slate-700")}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setFeedbackWouldRequest(false)}
                                className={cn("px-3 py-1 rounded border text-xs font-semibold", !feedbackWouldRequest ? "bg-red-700 text-white border-red-700" : "border-slate-300 text-slate-700")}
                              >
                                No
                              </button>
                            </div>
                          </div>

                          {/* Written Feedback */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700">Written Feedback (Optional)</label>
                            <textarea 
                              value={feedbackComment}
                              onChange={e => setFeedbackComment(e.target.value)}
                              placeholder="Share your experience to help the worker build their public portfolio..."
                              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900 min-h-[70px]"
                            />
                          </div>

                          <Button type="submit" className="bg-blue-900 text-white hover:bg-blue-800 text-xs">
                            Submit Official Rating & Review
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Call Worker Modal */}
      {showCallModal && assignedWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl border border-slate-200">
            <img 
              src={assignedWorker.avatar} 
              alt={assignedWorker.name} 
              className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-blue-900"
            />
            <div>
              <h3 className="font-bold text-lg text-slate-900">{assignedWorker.name}</h3>
              <p className="text-xs text-slate-500">Cooperative Number Masking Active</p>
              <p className="text-sm font-mono text-blue-900 font-bold mt-1">{assignedWorker.phone}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              Calls are connected securely through SHRAMSETU public bridge to protect your privacy.
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowCallModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800" onClick={() => setShowCallModal(false)}>
                Call Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Simulation Modal */}
      {showChatModal && assignedWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full h-[520px] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={assignedWorker.avatar} alt={assignedWorker.name} className="w-9 h-9 rounded-full object-cover border border-white" />
                <div>
                  <h4 className="font-bold text-sm leading-none">{assignedWorker.name}</h4>
                  <span className="text-[10px] text-blue-200">Active on assignment</span>
                </div>
              </div>
              <button onClick={() => setShowChatModal(false)} className="text-blue-200 hover:text-white text-sm font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user' ? 'bg-blue-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}>
                    <p>{msg.text}</p>
                    <span className="text-[9px] block text-right mt-1 opacity-70">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-900"
              />
              <Button type="submit" className="bg-blue-900 text-white text-xs px-4">Send</Button>
            </form>
          </div>
        </div>
      )}

      {/* Report Issue / Complaint Modal (Point 3) */}
      {showComplaintModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900">Report Issue / Grievance</h3>
              </div>
              <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {complaintSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Grievance Registered Successfully</h4>
                <p className="text-xs text-slate-600">Your complaint has been dispatched to the Cooperative Society Welfare Officer. You will receive an update within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterComplaint} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Issue Category</label>
                  <select 
                    value={complaintSubject} 
                    onChange={e => setComplaintSubject(e.target.value)}
                    required
                    className="w-full text-xs h-10 border border-slate-300 rounded-lg px-2 bg-white"
                  >
                    <option value="">Select grievance category...</option>
                    <option value="Billing & Overcharging Dispute">Billing & Overcharging Dispute</option>
                    <option value="Property Damage / Poor Workmanship">Property Damage / Poor Workmanship</option>
                    <option value="Technician Misbehaviour / Safety Concern">Technician Misbehaviour / Safety Concern</option>
                    <option value="Non-attendance / Punctuality Failure">Non-attendance / Punctuality Failure</option>
                    <option value="Other Service Issue">Other Service Issue</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Grievance Details</label>
                  <textarea 
                    value={complaintDetails}
                    onChange={e => setComplaintDetails(e.target.value)}
                    required
                    placeholder="Describe what went wrong in detail..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg min-h-[90px] outline-none focus:border-red-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowComplaintModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" className="text-xs">
                    Submit Formal Grievance
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
