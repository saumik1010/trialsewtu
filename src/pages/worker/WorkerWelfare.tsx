import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { WorkerProfile, IncidentReport } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ShieldAlert, Phone, AlertTriangle, CheckCircle2, 
  MapPin, Clock, HeartHandshake, ShieldCheck, Scale 
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function WorkerWelfare() {
  const { currentUser, incidents = [], submitIncident, users = [] } = useStore();
  const worker = (currentUser?.role === 'worker' ? currentUser : users.find(u => u.role === 'worker')) as WorkerProfile;

  const [incidentType, setIncidentType] = useState<'Safety Threat' | 'Workplace Injury' | 'Customer Harassment' | 'Payment Dispute' | 'Damage Claim' | 'Other'>('Safety Threat');
  const [locationText, setLocationText] = useState(worker?.serviceLocality || 'Bandra West, Mumbai');
  const [description, setDescription] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [sosSent, setSosSent] = useState(false);

  const handleSosSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worker) return;
    submitIncident({
      userId: worker.id,
      userName: worker.name,
      userRole: 'worker',
      incidentType,
      location: locationText,
      description,
      bookingId: bookingId || undefined
    });
    setSosSent(true);
    setTimeout(() => {
      setSosSent(false);
      setDescription('');
      setBookingId('');
    }, 3000);
  };

  const myIncidents = (incidents || []).filter(inc => inc.userId === worker?.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Worker Welfare, Legal Shield & SOS</h1>
        <p className="text-slate-500 text-sm">24x7 emergency protection, cooperative legal dispute resolution, and on-job safety protocols.</p>
      </div>

      {/* Emergency Hotline Alert Banner */}
      <div className="p-5 bg-red-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Phone className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold">24x7 Cooperative SOS Dispatch Hotline</h3>
            <p className="text-xs text-red-100 mt-0.5">
              Direct emergency escalation to police PCR and cooperative field welfare officer.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:18005557472"
            className="px-5 py-2.5 bg-white text-red-950 font-bold rounded-xl text-xs hover:bg-red-50 flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" /> Call Toll-Free 1800-555-SHRAM
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Immediate SOS / Grievance Logger */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-red-200 shadow-sm bg-white">
            <CardHeader className="bg-red-50/50 border-b border-red-100">
              <CardTitle className="text-base text-red-950 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-700" />
                <span>Log Workplace Incident / Urgent Protection Request</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">
                Instantly alerts the Cooperative Welfare Committee and records an unalterable incident log.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {sosSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 text-emerald-900">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base">Urgent Incident Logged with Control Room</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Your location ({locationText}) and details have been transmitted. A cooperative welfare officer will contact you immediately.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSosSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Incident Category</label>
                    <select
                      value={incidentType}
                      onChange={e => setIncidentType(e.target.value as any)}
                      className="w-full h-10 border border-slate-300 rounded-lg px-3 bg-white outline-none focus:border-red-700"
                    >
                      <option value="Safety Threat">Physical Safety Threat / Aggressive Host</option>
                      <option value="Workplace Injury">Workplace Injury / Slip / Electric Shock</option>
                      <option value="Customer Harassment">Verbal / Casteist / Gender Harassment</option>
                      <option value="Payment Dispute">Refusal to Pay / Extortion / Deductions</option>
                      <option value="Damage Claim">False Accusation of Property Damage</option>
                      <option value="Other">Other Emergency</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Exact Incident Location / Customer Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={locationText}
                        onChange={e => setLocationText(e.target.value)}
                        required
                        className="w-full h-10 pl-9 pr-3 border border-slate-300 rounded-lg outline-none focus:border-red-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Associated Booking ID (Optional)</label>
                    <input
                      type="text"
                      value={bookingId}
                      onChange={e => setBookingId(e.target.value)}
                      placeholder="e.g. job-1"
                      className="w-full h-10 px-3 border border-slate-300 rounded-lg outline-none focus:border-red-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Detailed Description of What Happened</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                      placeholder="State what occurred, witnesses present, or any immediate danger..."
                      className="w-full p-3 border border-slate-300 rounded-lg min-h-[90px] outline-none focus:border-red-700"
                    />
                  </div>

                  <Button type="submit" variant="destructive" className="w-full h-11 text-xs font-bold gap-2">
                    <AlertTriangle className="w-4 h-4" /> Trigger Immediate Emergency Escalation
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Past Reported Incidents */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">My Registered Welfare Cases ({myIncidents.length})</CardTitle>
              <CardDescription>Track resolution progress and formal reports.</CardDescription>
            </CardHeader>
            <CardContent>
              {myIncidents.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No past incidents reported. Your record is clean.</p>
              ) : (
                <div className="space-y-3">
                  {(myIncidents || []).map(inc => (
                    <div key={inc.id} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-950">{inc.incidentType}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inc.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-700">{inc.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Locality: {inc.location}</span>
                        <span>{formatDate(inc.reportedAt || inc.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Legal Aid & Insurance Shield Information */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                <Scale className="w-4 h-4 text-blue-900" />
                <span>Cooperative Legal Protection</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Guaranteed pro-bono representation for registered cooperative members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-950 block">1. Fair Wage & Payment Dispute Defense</span>
                <p>If a customer refuses to pay or demands arbitrary deductions, the cooperative legal cell steps in at zero cost to the worker.</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-950 block">2. Protection Against False Accusations</span>
                <p>Digital before-and-after work proof photos uploaded to SHRAMSETU serve as legal evidence against unfair damage claims.</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-950 block">3. Anti-Harassment Intervention</span>
                <p>Strict legal escalation under the Prevention of Atrocities Act and labor rights charters for workplace discrimination.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                <HeartHandshake className="w-4 h-4 text-emerald-700" />
                <span>On-Duty Medical & Accident Cover</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-medium text-slate-900">Pradhan Mantri Suraksha Bima (PMSBY)</span>
                <span className="font-bold text-emerald-700">₹2,00,000 Cover</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-medium text-slate-900">Cooperative Emergency Hospitalization Fund</span>
                <span className="font-bold text-emerald-700">₹50,000 Advance</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-medium text-slate-900">Workplace Tool Damage Replacement</span>
                <span className="font-bold text-emerald-700">Up to ₹10,000</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
