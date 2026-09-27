import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { 
  Building2, Users, Briefcase, TrendingUp, AlertTriangle, 
  MapPin, Clock, Calendar, GraduationCap, FileCheck, 
  ChevronRight, ArrowUpRight, CheckCircle2, ShieldCheck, Scale
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { WorkerProfile } from '../../types';

export function CooperativeDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    jobs = [], 
    users = [], 
    grievances = [], 
    incidents = [], 
    trainings = [],
    contracts = [],
    assignWorkerManually
  } = useStore();

  const tabParam = searchParams.get('tab');
  const validTabs: Array<'dispatch' | 'forecast' | 'training' | 'contracts'> = ['dispatch', 'forecast', 'training', 'contracts'];
  const initialTab = validTabs.includes(tabParam as any) ? (tabParam as 'dispatch' | 'forecast' | 'training' | 'contracts') : 'dispatch';

  const [activeTab, setActiveTab] = useState<'dispatch' | 'forecast' | 'training' | 'contracts'>(initialTab);
  const [selectedJobToAssign, setSelectedJobToAssign] = useState<string | null>(null);
  const [targetWorkerId, setTargetWorkerId] = useState<string>('');

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam as any)) {
      setActiveTab(tabParam as any);
    } else if (!tabParam) {
      setActiveTab('dispatch');
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'dispatch' | 'forecast' | 'training' | 'contracts') => {
    setActiveTab(tab);
    if (tab === 'dispatch') {
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab }, { replace: true });
    }
  };

  const workers = users.filter(u => u.role === 'worker') as WorkerProfile[];
  const unassignedJobs = jobs.filter(j => j.status === 'requested' || !j.workerId);
  const activeJobs = jobs.filter(j => ['accepted', 'on_the_way', 'arrived', 'started'].includes(j.status));
  const completedJobs = jobs.filter(j => j.status === 'completed');
  const totalDisbursed = completedJobs.reduce((acc, curr) => acc + curr.price, 0);

  // Demand Forecast data (projected upcoming seasonal & weekly ward needs)
  const demandForecasts = [
    { trade: 'Plumbing Solutions', trend: '+35% surge expected', reason: 'Pre-monsoon pipeline maintenance & drainage check', alertLevel: 'high', recommendedCrews: 18 },
    { trade: 'Electrical & Wiring', trend: '+20% increase', reason: 'Summer cooling & AC load wiring', alertLevel: 'medium', recommendedCrews: 24 },
    { trade: 'Appliance Repair', trend: '+45% high demand', reason: 'AC servicing & refrigerator seasonal maintenance', alertLevel: 'high', recommendedCrews: 15 },
    { trade: 'Carpentry & Wood', trend: 'Stable baseline', reason: 'Standard residential furniture & fixtures', alertLevel: 'normal', recommendedCrews: 10 },
  ];

  const handleManualDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobToAssign || !targetWorkerId) return;
    assignWorkerManually(selectedJobToAssign, targetWorkerId);
    setSelectedJobToAssign(null);
    setTargetWorkerId('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Cooperative Hub</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch management, demand projections, skill training, and bulk institutional contracts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm"
            onClick={() => navigate('/dashboard/cooperative/workload')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold h-8"
          >
            <Scale className="w-3.5 h-3.5 mr-1" /> Workload Balancing
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate('/dashboard/cooperative/grievances')}
            className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold h-8"
          >
            Dispute Support ({grievances.length + incidents.length})
          </Button>
        </div>
      </div>

      {/* Simple Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Members</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{workers.length}</span>
          <span className="text-[11px] text-emerald-600 font-medium">100% Verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Active Jobs</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{activeJobs.length}</span>
          <span className="text-[11px] text-slate-500">{unassignedJobs.length} waiting</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Training Programs</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{trainings.length}</span>
          <span className="text-[11px] text-blue-900 font-medium">Active sessions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block">Institute Contracts</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{contracts.length}</span>
          <span className="text-[11px] text-teal-700 font-medium">Bulk orders</span>
        </div>
      </div>

      {/* Navigation Tabs - Clean, uncluttered layout */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-2 rounded-t-2xl border-t border-x overflow-x-auto gap-2">
        <button
          onClick={() => handleTabChange('dispatch')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'dispatch'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Live Dispatch ({jobs.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('forecast')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'forecast'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Demand Forecast</span>
        </button>

        <button
          onClick={() => handleTabChange('training')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'training'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Worker Training ({trainings.length})</span>
        </button>

        <button
          onClick={() => handleTabChange('contracts')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'contracts'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Institute Contracts ({contracts.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 p-6 shadow-xs min-h-[360px]">
        {/* TAB 1: Live Dispatch */}
        {activeTab === 'dispatch' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Service Requests Queue</h3>
                <p className="text-xs text-slate-500">Monitor citizen bookings and assign available trade workers.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {jobs.map(job => {
                const assignedWorker = workers.find(w => w.id === job.workerId);
                return (
                  <div key={job.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{job.service}</span>
                        <span className="text-[11px] text-slate-400">#{job.id}</span>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-md">
                          {formatCurrency(job.price)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{job.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.locality}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(job.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {assignedWorker ? (
                        <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {assignedWorker.name}
                        </span>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => setSelectedJobToAssign(job.id)}
                          className="bg-blue-900 hover:bg-blue-800 text-white text-xs h-8 px-3"
                        >
                          Assign Worker
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Demand Forecast */}
        {activeTab === 'forecast' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Trade Demand Projections</h3>
              <p className="text-xs text-slate-500">Anticipate seasonal demand across wards to prepare workforce crews ahead of time.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demandForecasts.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.trade}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      item.alertLevel === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.trend}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.reason}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Target Crew Capacity:</span>
                    <span className="font-bold text-slate-900">{item.recommendedCrews} available technicians</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-900 shrink-0" />
              <span>Proactive mobilization helps maintain zero surge pricing and rapid customer fulfillment.</span>
            </div>
          </div>
        )}

        {/* TAB 3: Worker Training */}
        {activeTab === 'training' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cooperative Skill Trainings</h3>
                <p className="text-xs text-slate-500">Upskilling workshops, safety certifications, and trade upgrade courses.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainings.map(t => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md block w-fit mb-1">
                        {t.skill}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">Trainer: {t.trainer}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>{t.duration}</span>
                    <span className="font-semibold text-slate-700">
                      {t.enrolledWorkerIds.length} / {t.seats} Enrolled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Institute Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Institutional Bulk Contracts</h3>
                <p className="text-xs text-slate-500">Government facilities, schools, and commercial maintenance tenders.</p>
              </div>
            </div>

            <div className="space-y-3">
              {contracts.map(c => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{c.institutionName}</h4>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {formatCurrency(c.budget)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{c.workType}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span><MapPin className="w-3 h-3 inline mr-1" />{c.location}</span>
                      <span><Calendar className="w-3 h-3 inline mr-1" />Starts {c.startDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                      {c.workersRequired} Technicians Needed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Assignment Modal */}
      {selectedJobToAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Assign Tradesperson</h3>
              <button onClick={() => setSelectedJobToAssign(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleManualDispatch} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Select Member Worker</label>
                <select 
                  value={targetWorkerId} 
                  onChange={e => setTargetWorkerId(e.target.value)} 
                  required
                  className="w-full h-9 border border-slate-300 rounded-lg px-2 bg-white"
                >
                  <option value="">Choose worker...</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.skills[0]}) - Load: {w.workload}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setSelectedJobToAssign(null)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-900 text-white">
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
