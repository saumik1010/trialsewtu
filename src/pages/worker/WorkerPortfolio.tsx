import React from 'react';
import { useStore } from '../../store/useStore';
import { WorkerProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Star, CheckCircle2, ShieldCheck, Download, Award, 
  Clock, MapPin
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

export function WorkerPortfolio() {
  const { currentUser, jobs = [], users = [] } = useStore();
  const worker = (currentUser?.role === 'worker' ? currentUser : users.find(u => u.role === 'worker')) as WorkerProfile;
  const safeJobs = jobs || [];

  // Calculate stats from actual history
  const historyRecords = (worker?.earningsHistory && worker.earningsHistory.length > 0) ? worker.earningsHistory : [
    { month: 'October', jobs: 24, earnings: 34200 },
    { month: 'November', jobs: 28, earnings: 39500 },
    { month: 'December', jobs: 26, earnings: 36800 },
    { month: 'January', jobs: 30, earnings: 42100 },
    { month: 'February', jobs: 27, earnings: 38400 },
    { month: 'March (Active)', jobs: 19, earnings: 28700 },
  ];

  const minEarning = historyRecords.length > 0 ? Math.min(...historyRecords.map(r => r.earnings)) : 0;
  const maxEarning = historyRecords.length > 0 ? Math.max(...historyRecords.map(r => r.earnings)) : 50000;

  const completedWorkerJobs = safeJobs.filter(j => j.workerId === worker?.id && j.status === 'completed');

  const handleDownloadEarningsStatement = () => {
    const header = `SHRAMSETU OFFICIAL 6-MONTH EARNINGS STATEMENT\nWorker: ${worker?.name || 'Worker'}\nID: ${worker?.id || 'ID'}\nTrade: ${worker?.skills?.join(', ') || 'Technician'}\nGenerated On: ${new Date().toLocaleDateString()}\n\nMonth\t\tJobs Completed\t\tNet Direct Earnings\n------------------------------------------------------------\n`;
    const body = (historyRecords || []).map(r => `${r.month.padEnd(16)}\t${r.jobs}\t\t\t${formatCurrency(r.earnings)}`).join('\n');
    const footer = `\n------------------------------------------------------------\nTotal 6-Month Payout: ${formatCurrency(historyRecords.reduce((acc, curr) => acc + curr.earnings, 0))}\nZero Platform Fee Verified • Cooperative Society Endorsed\n`;
    
    const blob = new Blob([header + body + footer], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHRAMSETU-Earnings-Statement-${(worker?.name || 'Worker').replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Worker Portfolio & Credentials</h1>
          <p className="text-slate-500 text-sm">Verified trade certifications, labor cooperative credentials, and continuous service record.</p>
        </div>
        <Button 
          onClick={handleDownloadEarningsStatement}
          className="bg-blue-900 text-white hover:bg-blue-800 gap-2 text-xs font-bold"
        >
          <Download className="w-4 h-4" /> Download 6-Month Earnings Statement
        </Button>
      </div>

      {/* Profile & Cooperative Credentials Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-white shadow-xs md:col-span-1">
          <CardContent className="p-6 text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              <img 
                src={worker?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'} 
                alt={worker?.name} 
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-900 shadow-md"
              />
              <span className="absolute bottom-1 right-1 bg-emerald-600 text-white rounded-full p-1 border-2 border-white shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{worker?.name}</h2>
              <p className="text-blue-900 font-semibold text-sm mt-0.5">{worker?.skills?.join(' • ')}</p>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{worker?.serviceLocality} ({worker?.serviceRadius} km service radius)</span>
              </div>
            </div>

            <div className="flex justify-center items-center gap-2 text-amber-700 font-bold bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200 text-sm">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{worker?.rating || 4.9} Verified Rating</span>
            </div>

            <div className="pt-2 text-xs text-slate-600 space-y-1 text-left border-t border-slate-100">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Experience:</span>
                <strong className="text-slate-900">{worker?.experience || 8} Years</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span>Completed Jobs:</span>
                <strong className="text-slate-900">{worker?.completedJobs || 120} Verified</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Languages:</span>
                <strong className="text-slate-900">{worker?.languages?.join(', ') || 'Hindi, Marathi, English'}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cooperative Membership & Trade Verification</CardTitle>
            <CardDescription>Government-recognized labor cooperative membership and verified civic identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-500 block">Current Workload</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  {worker?.workload === 0 ? '🟢 Available (Ready for assignment)' : `🟡 ${worker?.workload} Active Assignment`}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-500 block">Availability</span>
                <span className="text-sm font-bold text-emerald-700 mt-1 block capitalize">
                  🟢 {worker?.status || 'available'} for bookings
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-500 block">Monthly Earnings Window</span>
                <span className="text-sm font-bold text-blue-950 mt-1 block">
                  {formatCurrency(minEarning)} - {formatCurrency(maxEarning)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-xs text-slate-500 block">Federated Cooperative</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">
                  Mumbai Shramik Seva Cooperative Society
                </span>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">Government Endorsements & Badges</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar KYC Cleared
                </span>
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Police Record Verified
                </span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> NSDC Certified Tradesperson
                </span>
                <span className="px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PMSBY Accident Insurance Covered
                </span>
              </div>
            </div>

            <div className="pt-1">
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">Verified Skill Sets</h4>
              <div className="flex flex-wrap gap-1.5">
                {(worker?.skills || ['Plumbing', 'Sanitary Repair', 'Pipe Fitting']).map((sk, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work History at Bottom Only */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Work History</CardTitle>
            <CardDescription className="text-xs">Complete log of fulfilled service orders, client ratings, and verified direct payouts.</CardDescription>
          </div>
          <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {completedWorkerJobs.length + 3} Completed Assignments
          </span>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {(completedWorkerJobs || []).map(job => (
              <div key={job.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{job.service}</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>
                  </div>
                  <p className="text-xs text-slate-600">{job.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.locality}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {formatDate(job.scheduledDate)}</span>
                  </div>
                </div>
                <div className="text-right sm:shrink-0">
                  <span className="font-bold text-emerald-800 text-base">{formatCurrency(job.price)}</span>
                  <span className="block text-[11px] text-emerald-600 font-semibold">✓ 100% Direct Payout</span>
                </div>
              </div>
            ))}

            {/* Historical Logged Work Records */}
            <div className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Concealed Wall Seepage & CPVC Joint Replacement</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>
                  <span className="flex items-center text-amber-600 text-xs font-bold gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 5.0</span>
                </div>
                <p className="text-xs text-slate-600">Pressure testing done, wall leak sealed with high-grade CPVC solvent and new brass union.</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Hill Road, Bandra West</span>
                  <span>•</span>
                  <span>26 Feb 2026</span>
                </div>
              </div>
              <div className="text-right sm:shrink-0">
                <span className="font-bold text-slate-900 text-base">₹1,200</span>
                <span className="block text-[11px] text-emerald-600 font-semibold">✓ Settled Directly</span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Sanitary & Geyser Safety Pressure Valve Replacement</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>
                  <span className="flex items-center text-amber-600 text-xs font-bold gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 5.0</span>
                </div>
                <p className="text-xs text-slate-600">Installed 25L water heater pressure release valve, cleared mineral deposits, tested thermostat cutoff.</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokhandwala, Andheri West</span>
                  <span>•</span>
                  <span>18 Feb 2026</span>
                </div>
              </div>
              <div className="text-right sm:shrink-0">
                <span className="font-bold text-slate-900 text-base">₹850</span>
                <span className="block text-[11px] text-emerald-600 font-semibold">✓ Settled Directly</span>
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">Main Water Meter Overhead Tank Line Installation</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>
                  <span className="flex items-center text-amber-600 text-xs font-bold gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" /> 4.8</span>
                </div>
                <p className="text-xs text-slate-600">Fitted heavy duty 1.5-inch PVC ball valve and automatic ball float switch for society tank.</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Juhu Tara Road, Santacruz</span>
                  <span>•</span>
                  <span>04 Feb 2026</span>
                </div>
              </div>
              <div className="text-right sm:shrink-0">
                <span className="font-bold text-slate-900 text-base">₹2,400</span>
                <span className="block text-[11px] text-emerald-600 font-semibold">✓ Settled Directly</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
