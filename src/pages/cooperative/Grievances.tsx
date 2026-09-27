import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Clock, 
  User, MessageSquare, Scale, Phone, MapPin 
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { Grievance, IncidentReport } from '../../types';

export function Grievances() {
  const { grievances = [], incidents = [], resolveGrievance, resolveIncident } = useStore();
  const safeGrievances = grievances || [];
  const safeIncidents = incidents || [];

  const [activeTab, setActiveTab] = useState<'grievances' | 'incidents'>('grievances');

  // Mediation Resolution Action Modal
  const [selectedCase, setSelectedCase] = useState<{ type: 'grievance' | 'incident'; id: string; subject: string } | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolved, setIsResolved] = useState(false);

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    if (selectedCase.type === 'grievance') {
      resolveGrievance(selectedCase.id, resolutionNotes || 'Mediation completed: Both parties consented to amicable cooperative settlement.');
    } else {
      resolveIncident(selectedCase.id, resolutionNotes || 'Emergency safety protocol completed: Worker protected and verified.');
    }

    setIsResolved(true);
    setTimeout(() => {
      setSelectedCase(null);
      setIsResolved(false);
      setResolutionNotes('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dispute & Complaint Support</h1>
          <p className="text-slate-500 text-sm">
            Quick and fair resolution of customer complaints and worker safety alerts.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('grievances')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'grievances'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Customer Grievances ({safeGrievances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'incidents'
              ? 'border-red-700 text-red-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Worker SOS & Safety Incidents ({safeIncidents.length})</span>
        </button>
      </div>

      {/* Customer Grievances List */}
      {activeTab === 'grievances' && (
        <div className="space-y-4">
          {safeGrievances.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              Zero pending customer grievances. All complaints resolved.
            </div>
          ) : (
            safeGrievances.map(g => (
              <Card key={g.id} className="border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{g.subject}</span>
                        <span className="text-[10px] font-mono text-slate-400">#{g.id}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Filed by: <strong>{g.userName}</strong> ({g.userRole}) • Ref Booking: #{g.bookingId}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        g.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {g.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    "{g.details}"
                  </p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Filed: {formatDate(g.createdAt)}
                    </span>

                    {g.status !== 'Resolved' ? (
                      <Button 
                        size="sm"
                        onClick={() => setSelectedCase({ type: 'grievance', id: g.id, subject: g.subject })}
                        className="bg-blue-900 text-white hover:bg-blue-800 text-xs h-8"
                      >
                        Intervene & Settle Mediation
                      </Button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolved by Welfare Officer
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Worker SOS & Incidents List */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {safeIncidents.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              Zero emergency incidents on record.
            </div>
          ) : (
            safeIncidents.map(inc => (
              <Card key={inc.id} className="border-red-200 shadow-xs hover:border-red-400 transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-red-950 text-sm">{inc.incidentType}</h4>
                        <p className="text-xs text-slate-600">
                          Reported by worker: <strong>{inc.userName}</strong> • Locality: {inc.location}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-900'
                    }`}>
                      {inc.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-200">
                    "{inc.description}"
                  </p>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Reported: {formatDate(inc.reportedAt || inc.createdAt)}
                    </span>

                    {inc.status !== 'Resolved' ? (
                      <Button 
                        size="sm"
                        variant="destructive"
                        onClick={() => setSelectedCase({ type: 'incident', id: inc.id, subject: inc.incidentType })}
                        className="text-xs h-8 font-bold"
                      >
                        Dispatch Legal Officer / Mark Protected
                      </Button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Legal Support Dispatched & Case Closed
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Mediation Settlement Action Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Formal Cooperative Resolution: {selectedCase.subject}
              </h3>
              <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {isResolved ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1 text-xs text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">Case Officially Resolved</p>
                <p>Resolution terms recorded on public audit trail.</p>
              </div>
            ) : (
              <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Official Settlement / Action Summary</label>
                  <textarea 
                    value={resolutionNotes}
                    onChange={e => setResolutionNotes(e.target.value)}
                    required
                    placeholder="Document the resolution terms, compensation/re-service agreed upon, or legal protection dispatched..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg min-h-[90px] outline-none focus:border-blue-900"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 text-[11px]">
                  Under cooperative law, this resolution will be preserved with a permanent digital hash and communicated to both parties.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedCase(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800">
                    Sign & Close Case
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
