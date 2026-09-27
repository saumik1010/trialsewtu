import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ShieldCheck, TrendingUp, DollarSign, Scale, CheckCircle2, 
  FileText, Download, Clock, Landmark, AlertCircle 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

export function Audits() {
  const { jobs = [], users = [], grievances = [] } = useStore();
  const safeJobs = jobs || [];
  const safeUsers = users || [];
  const safeGrievances = grievances || [];

  const completedJobs = safeJobs.filter(j => j.status === 'completed');
  const totalDisbursed = completedJobs.reduce((acc, curr) => acc + curr.price, 0);
  const totalCommissionSaved = totalDisbursed * 0.25; // vs typical 25% gig platform extraction

  const [filterPeriod, setFilterPeriod] = useState<'q1' | 'all'>('all');

  const auditTransactions = [
    { hash: '0x8f19...b29c', date: '10 Mar 2026', order: 'JOB-101', trade: 'Plumbing Solutions', amount: 850, feeDeducted: 0, recipient: 'Rajesh Kumar (Aadhaar Linked)', status: 'Settled' },
    { hash: '0x7e22...a411', date: '08 Mar 2026', order: 'JOB-102', trade: 'Emergency Electrical Repair', amount: 1200, feeDeducted: 0, recipient: 'Sunita Sharma (Aadhaar Linked)', status: 'Settled' },
    { hash: '0x5c88...190a', date: '05 Mar 2026', order: 'JOB-103', trade: 'Sanitary Fixtures', amount: 650, feeDeducted: 0, recipient: 'Amit Varma (Aadhaar Linked)', status: 'Settled' },
    { hash: '0x4b71...cc34', date: '02 Mar 2026', order: 'JOB-104', trade: 'Carpentry Restorations', amount: 1500, feeDeducted: 0, recipient: 'Vikram Jadhav (Aadhaar Linked)', status: 'Settled' },
    { hash: '0x2a94...ff12', date: '27 Feb 2026', order: 'JOB-105', trade: 'Water Tank Overhaul', amount: 950, feeDeducted: 0, recipient: 'Pooja Patil (Aadhaar Linked)', status: 'Settled' },
  ];

  const handleDownloadLedger = () => {
    const header = `SHRAMSETU PUBLIC CIVIC LEDGER & COMMISSION AUDIT REPORT\nGenerated On: ${new Date().toISOString()}\nZero Platform Fee Policy: Active and Enforced\n\nTX Hash\t\tDate\t\tOrder\t\tGross Amt\tPlatform Cut\tNet Worker Disbursed\n----------------------------------------------------------------------------------------------------\n`;
    const body = auditTransactions.map(t => `${t.hash}\t${t.date}\t${t.order}\t${formatCurrency(t.amount)}\t\t₹0.00 (0%)\t${formatCurrency(t.amount)}`).join('\n');
    const footer = `\n----------------------------------------------------------------------------------------------------\nPlatform Sustainability: Financed through civic municipal cooperative grants.\nZero Worker Exploitation Guarantee Signed.\n`;

    const blob = new Blob([header + body + footer], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHRAMSETU-Public-Audit-Ledger.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Open Civic Governance & Public Transparency Ledger
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Zero-Commission Public Audit Trail
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            All transaction disbursements, grievance resolution logs, and cooperative sustainability data are publicly verifiable. No worker pays platform cuts.
          </p>
        </div>

        {/* Highlight Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-900 text-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-blue-200 uppercase tracking-wider mb-2">
                <span>Direct Worker Disbursals</span>
                <DollarSign className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalDisbursed || 164500)}</p>
              <p className="text-xs text-teal-300 mt-1 font-medium">100% delivered to bank accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-teal-800 text-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-teal-200 uppercase tracking-wider mb-2">
                <span>Platform Commission Saved</span>
                <TrendingUp className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalCommissionSaved || 41125)}</p>
              <p className="text-xs text-teal-100 mt-1 font-medium">Retained by local families vs gig apps</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-wider mb-2">
                <span>Dispute Resolution Rate</span>
                <Scale className="w-4 h-4 text-blue-900" />
              </div>
              <p className="text-3xl font-bold text-slate-900">98.4%</p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">Mediated under cooperative bylaws</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs text-slate-500 uppercase tracking-wider mb-2">
                <span>Civic Model</span>
                <Landmark className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-3xl font-bold text-emerald-800">Public Good</p>
              <p className="text-xs text-slate-500 mt-1">Non-profit digital public rail</p>
            </CardContent>
          </Card>
        </div>

        {/* Verifiable Ledger Section */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <CardTitle className="text-lg">Real-Time Civic Disbursal Ledger</CardTitle>
              <CardDescription>
                Cryptographically verifiable record of payment settlements and verified zero-deductions.
              </CardDescription>
            </div>
            <Button
              onClick={handleDownloadLedger}
              className="bg-blue-900 text-white hover:bg-blue-800 text-xs font-bold gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Full Public Audit File (.txt)
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Audit Hash</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Service Trade</th>
                    <th className="p-3.5">Gross Paid</th>
                    <th className="p-3.5">Platform Cut</th>
                    <th className="p-3.5">Net Worker Payout</th>
                    <th className="p-3.5">Disbursal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-mono text-blue-900 font-bold">{tx.hash}</td>
                      <td className="p-3.5 text-slate-600">{tx.date}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{tx.trade}</td>
                      <td className="p-3.5 font-bold text-slate-900">{formatCurrency(tx.amount)}</td>
                      <td className="p-3.5 font-bold text-emerald-700">₹0.00 (0%)</td>
                      <td className="p-3.5 font-bold text-emerald-800 text-sm">{formatCurrency(tx.amount)}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified DBT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability & Financial Ledger Explanation */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-900" />
              How SHRAMSETU Sustains with 0% Commission
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike venture-capital funded gig apps that extract 25-35% cuts from worker earnings, SHRAMSETU operates as a <strong>Digital Public Good (DPG)</strong>. Infrastructure server hosting is sponsored by municipal labor welfare boards and cooperative confederation grants under national digital public infrastructure guidelines.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-700" />
              Democratic Governance by Worker Cooperatives
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Platform rules, pricing floors, and algorithm parameters are governed by elected cooperative board members. No private corporate entity can alter worker wages, impose punitive algorithmic deactivations, or monopolize local trade territories.
            </p>
          </Card>
        </div>
      </div>
  );
}
