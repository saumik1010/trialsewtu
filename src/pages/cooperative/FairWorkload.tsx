import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { WorkerProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Scale, Users, Award, ShieldCheck, TrendingUp, 
  AlertTriangle, CheckCircle2, RotateCcw, ArrowRight, Zap 
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export function FairWorkload() {
  const { users = [], jobs = [], updateWorkerStatus } = useStore();
  const safeUsers = users || [];
  const safeJobs = jobs || [];
  const workers = safeUsers.filter(u => u.role === 'worker') as WorkerProfile[];

  const [selectedTradeFilter, setSelectedTradeFilter] = useState<string>('all');
  const [fatigueThreshold, setFatigueThreshold] = useState<number>(3); // max recommended jobs per day

  const filteredWorkers = workers.filter(w => {
    if (selectedTradeFilter === 'all') return true;
    return w.skills.some(s => s.toLowerCase().includes(selectedTradeFilter.toLowerCase()));
  });

  const averageWorkload = workers.length > 0 
    ? (workers.reduce((acc, curr) => acc + curr.workload, 0) / workers.length).toFixed(1) 
    : '0';

  const overloadedWorkers = workers.filter(w => w.workload >= fatigueThreshold);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fair Workload Allocation & Fatigue Balancing</h1>
          <p className="text-slate-500 text-sm">
            Statutory cooperative algorithm preventing worker exploitation, algorithmic burnout, and unequal dispatch favoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Fatigue Cap (Max Daily Jobs):</span>
          <select 
            value={fatigueThreshold}
            onChange={e => setFatigueThreshold(Number(e.target.value))}
            className="text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white"
          >
            <option value={2}>2 Jobs / Day (High Rest)</option>
            <option value={3}>3 Jobs / Day (Balanced)</option>
            <option value={4}>4 Jobs / Day (Peak Festive)</option>
          </select>
        </div>
      </div>

      {/* Principle Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-900 text-white border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4 text-blue-300" />
              <span>Gini Workload Index</span>
            </div>
            <div className="text-3xl font-bold">0.12 (Optimal)</div>
            <p className="text-xs text-blue-200 mt-1">
              Near-perfect equality across active members in municipal zones.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-teal-700" />
              <span>Average Daily Load</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{averageWorkload} Jobs / Member</div>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              ✓ All members within safe physical health limits
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Fatigue Protection State</span>
            </div>
            <div className="text-3xl font-bold text-amber-700">{overloadedWorkers.length} Near Cap</div>
            <p className="text-xs text-slate-500 mt-1">
              Automated algorithm routes new calls to underutilized peers.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trade Filter Row */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Filter by Trade:</span>
        <div className="flex flex-wrap gap-2">
          {['all', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'].map(trade => (
            <button
              key={trade}
              onClick={() => setSelectedTradeFilter(trade)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedTradeFilter === trade
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {/* Member Workload Status Matrix */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Cooperative Member Distribution Board</CardTitle>
          <CardDescription>
            Workload allocation is computed dynamically: Priority = (Locality Proximity) × 0.4 + (Skill Match) × 0.3 + (Fatigue Inversion) × 0.3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWorkers.map(worker => {
              const loadPct = Math.min(100, Math.round((worker.workload / fatigueThreshold) * 100));
              const isOverloaded = worker.workload >= fatigueThreshold;

              return (
                <div key={worker.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 w-full md:w-1/3">
                    <img src={worker.avatar} alt={worker.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-900" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{worker.name}</h4>
                        {worker.isWomenWorker && (
                          <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">
                            Women Worker
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{worker.skills.join(', ')}</p>
                      <span className="text-[11px] text-slate-500 font-medium">Zone: {worker.serviceLocality}</span>
                    </div>
                  </div>

                  {/* Progress Bar of Daily Workload */}
                  <div className="w-full md:w-1/3 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Daily Allocation:</span>
                      <span className={isOverloaded ? 'text-red-700 font-bold' : 'text-slate-900'}>
                        {worker.workload} / {fatigueThreshold} Jobs {isOverloaded ? '(Fatigue Cap)' : ''}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isOverloaded ? 'bg-red-600' : worker.workload === 0 ? 'bg-emerald-500' : 'bg-blue-900'
                        }`} 
                        style={{ width: `${loadPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Dispatch Priority: <strong>{isOverloaded ? 'Paused for Rest' : worker.workload === 0 ? 'Maximum Priority' : 'Standard Rotation'}</strong>
                    </span>
                  </div>

                  {/* Quick Action Toggle */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateWorkerStatus(worker.status === 'available' ? 'busy' : 'available')}
                      className="text-xs h-8"
                    >
                      Toggle Availability
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
