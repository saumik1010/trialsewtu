import React from 'react';
import { useStore } from '../../store/useStore';
import { WorkerProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  TrendingUp, Wallet, ArrowUpRight, ShieldCheck, Download, 
  CheckCircle2, CreditCard, Calendar, Clock 
} from 'lucide-react';

export function WorkerEarnings() {
  const { currentUser, jobs = [], users = [] } = useStore();
  const worker = (currentUser?.role === 'worker' ? currentUser : users.find(u => u.role === 'worker')) as WorkerProfile;

  const historyRecords = (worker?.earningsHistory && worker.earningsHistory.length > 0) ? worker.earningsHistory : [
    { month: 'October', jobs: 24, earnings: 34200 },
    { month: 'November', jobs: 28, earnings: 39500 },
    { month: 'December', jobs: 26, earnings: 36800 },
    { month: 'January', jobs: 30, earnings: 42100 },
    { month: 'February', jobs: 27, earnings: 38400 },
    { month: 'March (Active)', jobs: 19, earnings: 28700 },
  ];

  const maxMonthEarnings = historyRecords.length > 0 ? Math.max(...historyRecords.map(r => r.earnings)) : 50000;
  const total6Month = historyRecords.reduce((acc, curr) => acc + curr.earnings, 0);

  const handleDownloadStatement = () => {
    const header = `SHRAMSETU DIRECT COOPERATIVE EARNINGS STATEMENT\nBeneficiary Worker: ${worker?.name || 'Worker'}\nRegistration ID: ${worker?.id || 'ID'}\nAadhaar Verification: Masked Validated\n\nDate\t\t\tTransaction ID\t\tService\t\t\tDisbursed\n--------------------------------------------------------------------------------\n`;
    const recentPayouts = [
      { date: '10 Mar 2026', id: 'TXN-SHRAM-882101', service: 'Plumbing Solutions', amt: 850 },
      { date: '08 Mar 2026', id: 'TXN-SHRAM-882092', service: 'Emergency Pipe Leak', amt: 1200 },
      { date: '05 Mar 2026', id: 'TXN-SHRAM-881944', service: 'Sanitary Fixture', amt: 650 },
      { date: '02 Mar 2026', id: 'TXN-SHRAM-881820', service: 'Water Tank Overhaul', amt: 1500 },
    ];
    const body = (recentPayouts || []).map(p => `${p.date}\t${p.id}\t${p.service.padEnd(20)}\t${formatCurrency(p.amt)}`).join('\n');
    const footer = `\n--------------------------------------------------------------------------------\nZero Platform Deduction: ₹0.00\nNet Disbursed to Worker Bank Account: 100%\n`;

    const blob = new Blob([header + body + footer], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHRAMSETU-Payout-Statement-${(worker?.name || 'Worker').replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Direct Earnings & Disbursals</h1>
          <p className="text-slate-500 text-sm">100% of customer payments are credited directly without platform cuts or hidden commission.</p>
        </div>
        <Button 
          onClick={handleDownloadStatement}
          className="bg-blue-900 text-white hover:bg-blue-800 gap-1.5 text-xs font-bold"
        >
          <Download className="w-4 h-4" /> Download Official Statement
        </Button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-blue-900 text-white border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-blue-300" />
              <span>Total Lifetime Disbursed</span>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(worker?.earnings || 0)}</div>
            <div className="mt-2 text-xs text-teal-300 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 0% Platform Commission Deducted
            </div>
          </CardContent>
        </Card>

        <Card className="bg-teal-700 text-white border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-teal-200 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-teal-300" />
              <span>This Month (March Active)</span>
            </div>
            <div className="text-3xl font-bold">{formatCurrency(28700)}</div>
            <div className="mt-2 text-xs text-teal-100 font-medium">
              19 completed jobs • ₹1,510 avg/job
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-blue-700" />
              <span>Last 6-Month Aggregate</span>
            </div>
            <div className="text-3xl font-bold text-slate-900">{formatCurrency(total6Month)}</div>
            <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Direct Bank Transfer (DBT) Active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Chart Bars (Monthly History) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">6-Month Monthly Earning Trajectory</CardTitle>
          <CardDescription>Consistent month-on-month income stability under cooperative workforce scheduling.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(historyRecords || []).map((r, i) => {
              const pct = Math.round((r.earnings / maxMonthEarnings) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{r.month} ({r.jobs} jobs)</span>
                    <span className="text-blue-950 font-bold">{formatCurrency(r.earnings)}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-900 rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payout Records Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Direct Disbursals</CardTitle>
          <CardDescription>Instant settlement logs with bank transaction verification IDs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Disbursal Date</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Trade Order</th>
                  <th className="p-3">Customer Locality</th>
                  <th className="p-3">Net Disbursed</th>
                  <th className="p-3">Bank Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { date: '10 Mar 2026', txn: 'TXN-SHRAM-882101', trade: 'Plumbing Solutions', loc: 'Bandra West', amt: 850 },
                  { date: '08 Mar 2026', txn: 'TXN-SHRAM-882092', trade: 'Emergency Pipe Leak', loc: 'Andheri West', amt: 1200 },
                  { date: '05 Mar 2026', txn: 'TXN-SHRAM-881944', trade: 'Sanitary Fixture Fitting', loc: 'Santacruz', amt: 650 },
                  { date: '02 Mar 2026', txn: 'TXN-SHRAM-881820', trade: 'Water Tank Overhaul', loc: 'Dadar East', amt: 1500 },
                  { date: '27 Feb 2026', txn: 'TXN-SHRAM-881452', trade: 'Tap & Mixer Replacement', loc: 'Bandra West', amt: 600 }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{row.date}</td>
                    <td className="p-3 font-mono text-slate-600">{row.txn}</td>
                    <td className="p-3 font-medium text-slate-800">{row.trade}</td>
                    <td className="p-3 text-slate-600">{row.loc}</td>
                    <td className="p-3 font-bold text-emerald-800 text-sm">{formatCurrency(row.amt)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded-full text-[10px] flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> Credited
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
