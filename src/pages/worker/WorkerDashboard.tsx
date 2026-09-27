import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatDate, cn } from '../../lib/utils';
import { 
  MapPin, Phone, CheckCircle2, Clock, ShieldCheck, AlertTriangle, 
  Upload, Camera, Image as ImageIcon, Sparkles, Navigation, 
  FileText, MessageSquare, Mic, DollarSign, Wrench, Award, TrendingUp, ShieldAlert, ArrowRight
} from 'lucide-react';
import { WorkerProfile } from '../../types';
import { InteractiveMap } from '../../components/common/InteractiveMap';

export function WorkerDashboard() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    jobs = [], 
    users = [], 
    updateWorkerStatus, 
    acceptJob, 
    declineJob, 
    updateJobStatus,
    requestExtraCharges,
    submitIncident
  } = useStore();
  
  const worker = (currentUser?.role === 'worker' ? currentUser : users.find(u => u.role === 'worker')) as WorkerProfile;
  const safeJobs = jobs || [];

  // Modals & Panels
  const [showExtraChargeModal, setShowExtraChargeModal] = useState(false);
  const [extraDesc, setExtraDesc] = useState('Replacement PVC Ball Valve & Thread Tape');
  const [extraAmount, setExtraAmount] = useState(250);

  const [showWorkProofModal, setShowWorkProofModal] = useState(false);
  const [beforeUrl, setBeforeUrl] = useState('https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80');
  const [afterUrl, setAfterUrl] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&auto=format&fit=crop&q=80');
  const [workNotes, setWorkNotes] = useState('Leakage sealed with brass adapter and reinforced Teflon sealing. Tested under full water pressure.');

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<'Safety Threat' | 'Workplace Injury' | 'Customer Harassment' | 'Payment Dispute' | 'Damage Claim' | 'Other'>('Safety Threat');
  const [incidentLoc, setIncidentLoc] = useState('');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [incidentSent, setIncidentSent] = useState(false);

  // Active jobs for this worker
  const activeJobs = safeJobs.filter(j => j.workerId === worker?.id && ['accepted', 'on_the_way', 'arrived', 'started'].includes(j.status));
  const currentActiveJob = activeJobs[0];

  // Available opportunities for worker's skill or open requests
  const availableJobs = safeJobs.filter(j => 
    (j.status === 'requested' || (j.status === 'assigned' && j.workerId === worker?.id)) &&
    !activeJobs.some(aj => aj.id === j.id)
  );

  const handleExtraChargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentActiveJob) return;
    requestExtraCharges(currentActiveJob.id, extraDesc, extraAmount);
    setShowExtraChargeModal(false);
  };

  const handleSaveProofAndComplete = () => {
    if (!currentActiveJob) return;
    updateJobStatus(currentActiveJob.id, 'completed', {
      beforePhoto: beforeUrl,
      afterPhoto: afterUrl,
      notes: workNotes
    });
    setShowWorkProofModal(false);
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;
    submitIncident({
      userId: worker.id,
      userName: worker.name,
      userRole: 'worker',
      incidentType,
      location: currentActiveJob?.address || worker.serviceLocality,
      description: incidentDesc,
      bookingId: currentActiveJob?.id
    });
    setIncidentSent(true);
    setTimeout(() => {
      setIncidentSent(false);
      setShowIncidentModal(false);
      setIncidentDesc('');
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Worker Header Status & Profile Summary */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img 
            src={worker?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'} 
            alt={worker?.name} 
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-900"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{worker?.name}</h2>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {worker?.skills?.join(' • ')} | Locality: {worker?.serviceLocality} ({worker?.serviceRadius} km radius)
            </p>
          </div>
        </div>

        {/* Status Toggle Selector */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-semibold text-slate-500">My Status:</span>
          <select 
            className={cn(
              "text-xs font-bold rounded-full px-3.5 py-1.5 border-0 ring-1 ring-inset cursor-pointer outline-none transition-colors",
              worker?.status === 'available' ? "bg-emerald-50 text-emerald-800 ring-emerald-600/30" : 
              worker?.status === 'busy' ? "bg-amber-50 text-amber-900 ring-amber-600/30" : 
              "bg-slate-100 text-slate-700 ring-slate-400/30"
            )}
            value={worker?.status}
            onChange={(e) => updateWorkerStatus(e.target.value as any)}
          >
            <option value="available">🟢 Available for Jobs</option>
            <option value="busy">🟡 Busy / On Assignment</option>
            <option value="offline">⚪ Offline</option>
          </select>
        </div>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card 
          onClick={() => navigate('/dashboard/worker/earnings')} 
          className="bg-blue-900 text-white border-0 shadow-sm cursor-pointer hover:bg-blue-800 transition-all group"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider">Direct Earnings</p>
              <TrendingUp className="w-4 h-4 text-teal-300 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(worker?.earnings || 0)}</p>
            <span className="text-[10px] text-teal-300 font-medium">100% direct payout &rarr;</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Active Assignment</p>
            <p className="text-2xl font-bold text-slate-900">{activeJobs.length}</p>
            <span className="text-[10px] text-emerald-700 font-medium">Safe workload balance</span>
          </CardContent>
        </Card>

        <Card 
          onClick={() => navigate('/dashboard/worker/portfolio')} 
          className="bg-white border-slate-200 shadow-xs cursor-pointer hover:border-blue-900 transition-all group"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Customer Rating</p>
              <FileText className="w-4 h-4 text-blue-900 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-2xl font-bold text-slate-900 flex items-center gap-1">
              ⭐ {worker?.rating || 4.9}
            </p>
            <span className="text-[10px] text-blue-900 font-semibold">{worker?.completedJobs || 120} verified jobs &rarr;</span>
          </CardContent>
        </Card>
      </div>

      {/* Current Active Job Card with Interactive Flow & Transit Route */}
      {currentActiveJob && (
        <Card className="border-blue-300 shadow-md bg-white overflow-hidden">
          <div className="bg-blue-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-base">Active Assigned Job: #{currentActiveJob.id}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={currentActiveJob.priority === 'emergency' ? 'destructive' : 'warning'}>
                {currentActiveJob.priority.toUpperCase()}
              </Badge>
              <button 
                type="button"
                onClick={() => setShowIncidentModal(true)}
                className="text-xs bg-red-700/80 hover:bg-red-600 text-white px-2.5 py-1 rounded-md font-semibold flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Emergency SOS
              </button>
            </div>
          </div>

          <CardContent className="p-5 space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{currentActiveJob.service}</h4>
                <p className="text-sm text-slate-600 mt-0.5">{currentActiveJob.description}</p>
                <p className="text-xs font-semibold text-blue-900 flex items-center gap-1 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" /> {currentActiveJob.address} ({currentActiveJob.locality})
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-800">{formatCurrency(currentActiveJob.price)}</div>
                <span className="text-xs text-slate-500 font-medium">Cooperative Direct Payout</span>
              </div>
            </div>

            {/* Customer Attached Media Preview */}
            {(currentActiveJob?.media || []).length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-700" />
                  Customer Photo / Issue Attachment:
                </span>
                <div className="flex gap-2">
                  {(currentActiveJob?.media || []).map((m, i) => (
                    <div key={i} className="w-28 h-20 rounded-lg overflow-hidden border border-slate-300">
                      <img src={m.url} alt={m.label} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Transit Navigation Route */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-blue-700" />
                  Live Navigation Route to Customer Premises
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Est. Travel: {currentActiveJob.estimatedTravelMins || 12} mins ({currentActiveJob.estimatedDistanceKm || 2.4} km)
                </span>
              </div>
              
              <InteractiveMap 
                customerLocality={currentActiveJob.locality}
                customerAddress={currentActiveJob.address}
                workerName={worker?.name || 'Worker'}
                workerLocality={worker?.serviceLocality || 'Andheri West'}
                distanceKm={currentActiveJob.estimatedDistanceKm || 2.4}
                estimatedTravelMins={currentActiveJob.estimatedTravelMins || 12}
                status={currentActiveJob.status}
                className="h-56"
                showExactRoute={true}
              />
            </div>

            {/* Sequential Job Flow Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Current Job Progression</span>
                <span className="text-xs font-bold text-blue-900 capitalize">
                  Status: {currentActiveJob.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {currentActiveJob.status === 'accepted' && (
                  <Button 
                    className="flex-1 bg-blue-900 text-white hover:bg-blue-800 h-11 text-sm font-bold gap-2"
                    onClick={() => updateJobStatus(currentActiveJob.id, 'on_the_way')}
                  >
                    <Navigation className="w-4 h-4" /> Start Travel (On the Way)
                  </Button>
                )}

                {currentActiveJob.status === 'on_the_way' && (
                  <Button 
                    className="flex-1 bg-teal-700 text-white hover:bg-teal-800 h-11 text-sm font-bold gap-2"
                    onClick={() => updateJobStatus(currentActiveJob.id, 'arrived')}
                  >
                    <MapPin className="w-4 h-4" /> Reached Customer Address
                  </Button>
                )}

                {currentActiveJob.status === 'arrived' && (
                  <Button 
                    className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800 h-11 text-sm font-bold gap-2"
                    onClick={() => updateJobStatus(currentActiveJob.id, 'started')}
                  >
                    <Wrench className="w-4 h-4" /> Start Work (Inspection & Repair)
                  </Button>
                )}

                {currentActiveJob.status === 'started' && (
                  <>
                    <Button 
                      variant="outline"
                      className="border-amber-400 text-amber-900 hover:bg-amber-50 h-11 text-xs font-bold gap-1.5"
                      onClick={() => setShowExtraChargeModal(true)}
                    >
                      <DollarSign className="w-4 h-4 text-amber-700" /> Request Extra Parts Charge
                    </Button>
                    <Button 
                      className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800 h-11 text-sm font-bold gap-2"
                      onClick={() => setShowWorkProofModal(true)}
                    >
                      <Camera className="w-4 h-4" /> Submit Proof & Mark Finished
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available / New Opportunities Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" /> Nearby Job Opportunities ({availableJobs.length})
          </h3>
          <span className="text-xs text-slate-500">Matched to your verified skills & locality</span>
        </div>

        {(availableJobs || []).length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <p className="text-slate-600 text-sm font-medium">No pending job requests in your queue right now.</p>
            <p className="text-xs text-slate-400">Keep your status set to "Available" to receive automated cooperative dispatches.</p>
          </div>
        ) : (
          (availableJobs || []).map(job => (
            <Card key={job.id} className="border-slate-200 hover:border-blue-300 transition-all shadow-xs">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{job.service}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{job.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-950">{formatCurrency(job.price)}</span>
                    {job.priority === 'emergency' && (
                      <span className="block text-[10px] font-bold text-red-700 uppercase">Emergency</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.locality} ({job.estimatedDistanceKm || 2.1} km)
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Scheduled: {formatDate(job.scheduledDate)}
                  </span>
                </div>

                {job.matchReasons && (
                  <div className="bg-blue-50/70 border border-blue-100 text-blue-900 text-[11px] p-2.5 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>{job.matchReasons.join(' • ')}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs" 
                    onClick={() => acceptJob(job.id)}
                  >
                    Accept Service Request
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-slate-700 border-slate-300 hover:bg-slate-50 text-xs"
                    onClick={() => declineJob(job.id)}
                  >
                    Decline / Pass
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Mass Hiring & Bulk Project Recruitment Card */}
      <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <TrendingUp className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h4 className="font-bold text-base">Mass Hiring & Bulk Drives (बल्क भर्ती अभियान)</h4>
            <p className="text-xs text-blue-100 mt-0.5">
              Apply for government infrastructure AMC contracts, commercial site crews, and enterprise bulk jobs with union-guaranteed daily wage security.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/worker/mass-hiring')}
          className="bg-teal-400 text-slate-950 font-bold hover:bg-teal-300 whitespace-nowrap text-xs px-5 shadow-xs"
        >
          View Mass Hiring Drives
        </Button>
      </div>

      {/* Extra Charge Request Modal */}
      {showExtraChargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Request Spare Parts Charge</h3>
              <button onClick={() => setShowExtraChargeModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleExtraChargeSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Parts / Materials Description</label>
                <input 
                  type="text" 
                  value={extraDesc} 
                  onChange={e => setExtraDesc(e.target.value)} 
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Additional Amount (₹)</label>
                <input 
                  type="number" 
                  value={extraAmount} 
                  onChange={e => setExtraAmount(Number(e.target.value))} 
                  required
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-900"
                />
              </div>
              <div className="text-[11px] text-slate-500">
                Customer will receive an instant push notification on their dashboard to approve this addition before billing.
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => setShowExtraChargeModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-900 text-white text-xs">
                  Send to Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Proof & Completion Modal */}
      {showWorkProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Upload Before & After Work Proof</h3>
              <button onClick={() => setShowWorkProofModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700">Before Photo:</span>
                  <div className="h-28 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 relative">
                    <img src={beforeUrl} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-800">After Work Photo:</span>
                  <div className="h-28 rounded-lg overflow-hidden border border-emerald-300 bg-emerald-50 relative">
                    <img src={afterUrl} alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Work Notes / Summary</label>
                <textarea 
                  value={workNotes}
                  onChange={e => setWorkNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg min-h-[70px] outline-none focus:border-blue-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowWorkProofModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-bold" onClick={handleSaveProofAndComplete}>
                  Complete & Trigger Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Incident / SOS Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-red-200">
            <div className="flex items-center justify-between border-b border-red-100 pb-2 text-red-700">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm">Log Emergency Workplace Incident</h3>
              </div>
              <button onClick={() => setShowIncidentModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {incidentSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 text-xs text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Incident Logged with Cooperative Control Room</p>
                <p>Support officer is monitoring your live location.</p>
              </div>
            ) : (
              <form onSubmit={handleReportIncident} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Incident Classification</label>
                  <select 
                    value={incidentType}
                    onChange={e => setIncidentType(e.target.value as any)}
                    className="w-full text-xs h-10 border border-slate-300 rounded-lg px-2 bg-white"
                  >
                    <option value="Safety Threat">Safety Threat / Aggressive Host</option>
                    <option value="Workplace Injury">Workplace Injury / Medical</option>
                    <option value="Customer Harassment">Customer Harassment</option>
                    <option value="Payment Dispute">Payment Dispute / Fraud</option>
                    <option value="Damage Claim">Accidental Damage Claim</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Incident Premises / Locality</label>
                  <input 
                    type="text" 
                    value={incidentLoc} 
                    onChange={e => setIncidentLoc(e.target.value)} 
                    required
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Incident Description</label>
                  <textarea 
                    value={incidentDesc}
                    onChange={e => setIncidentDesc(e.target.value)}
                    required
                    placeholder="Briefly state what happened..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg min-h-[70px] outline-none focus:border-red-700"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => setShowIncidentModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" className="flex-1 text-xs font-bold">
                    Send SOS Alert
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
