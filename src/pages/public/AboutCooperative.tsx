import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Building2, Scale, Users, ShieldCheck, HeartHandshake, 
  Award, CheckCircle2, ArrowRight, Landmark, ShieldAlert,
  Percent, UserCheck, Sparkles, Heart, Lock, GraduationCap, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutCooperative() {
  const navigate = useNavigate();

  const whyUsCards = [
    {
      title: 'Zero Platform Fee',
      tag: '100% Payout',
      desc: 'Unlike private aggregators charging 25-35% commission, SHRAMSETU takes zero cut. Customers pay fair transparent rates, and workers take home 100% of their hard-earned money.',
      icon: Percent,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Women Safety & Verified Trust',
      tag: 'Strict Safety Rails',
      desc: 'Mandatory Aadhaar KYC, Mumbai Police record clearance, live GPS transit tracking, and an integrated SOS emergency dispatch desk designed to ensure maximum safety for women at home and female service professionals.',
      icon: ShieldCheck,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Training & Certifications',
      tag: 'Skill Advancement',
      desc: 'Workers receive structured skill upskilling workshops, safety standard trainings, and government-recognized trade certifications administered directly by labor cooperatives to advance their trade careers.',
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Faster Services',
      tag: 'Smart Geo-Matching',
      desc: 'Prompt turnaround by intelligently pairing you with the nearest available verified tradesperson based on precise geolocation, live status, and specialized trade skills.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  const principles = [
    {
      title: 'Zero Platform Commission',
      desc: '100% of customer payments flow straight into worker accounts. No predatory platform fees or dynamic surge deductions.',
      icon: ShieldCheck
    },
    {
      title: 'Civic Trust & Democratic Governance',
      desc: 'Platform policies, minimum price floors, and dispute mechanisms are governed democratically by registered labor cooperatives.',
      icon: Scale
    },
    {
      title: 'Anti-Burnout Fair Workload Allocation',
      desc: 'Workload rotation algorithms guarantee equitable job opportunities while capping daily assignments to prevent physical exhaustion.',
      icon: Users
    },
    {
      title: 'Portable Digital Identity & Work Credentials',
      desc: 'Workers own their work history, ratings, and certifications via an open, portable verifiable portfolio that cannot be erased.',
      icon: Award
    },
    {
      title: 'Statutory Welfare & Social Security',
      desc: 'Direct integration with PMSBY, e-Shram, and state welfare boards ensures health insurance and accident protection.',
      icon: HeartHandshake
    },
    {
      title: 'Open Public Auditability',
      desc: 'Every transaction, resolution timeline, and financial ledger entry is open to municipal and public civic audit.',
      icon: Landmark
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Civic Charter & Bylaws
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            A Digital Public Infrastructure for India's Unorganized Workforce
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            SHRAMSETU replaces corporate gig intermediaries with decentralized, worker-owned cooperative networks. Our charter ensures dignifying livelihoods, direct earnings, and democratic civic trust.
          </p>
        </div>

        {/* Dedicated "Why Us?" Section */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose SHRAMSETU?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Built on ethics, public dignity, and cooperative accountability. Here is why thousands of households and technicians trust our platform rail.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUsCards.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6 Core Principles Bento Grid */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Cooperative Charter Principles</h2>
            <p className="text-xs text-slate-500">Statutory guarantees embedded into our open platform architecture.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Card key={idx} className="border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Cooperative Model vs Private Gig Platforms Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-900 text-white">
            <h2 className="text-xl font-bold">Structural Contrast: SHRAMSETU vs Venture Gig Platforms</h2>
            <p className="text-xs text-slate-300 mt-1">Comparing digital public goods with corporate intermediary models.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Dimension</th>
                  <th className="p-4 text-emerald-800 font-bold">SHRAMSETU Cooperative Rail</th>
                  <th className="p-4 text-slate-500">Corporate Aggregators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-4 font-bold text-slate-900">Platform Commission</td>
                  <td className="p-4 font-bold text-emerald-700 bg-emerald-50/50">0% (Worker receives 100%)</td>
                  <td className="p-4 text-red-700">20% - 35% extracted per job</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Algorithm Transparency</td>
                  <td className="p-4 text-slate-800 bg-emerald-50/50">Open fair workload rotation and fatigue caps</td>
                  <td className="p-4 text-slate-600">Opaque blackbox algorithmic penalization</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Data & Rating Ownership</td>
                  <td className="p-4 text-slate-800 bg-emerald-50/50">Worker-owned portable public credentials</td>
                  <td className="p-4 text-slate-600">Locked-in platform proprietary ratings</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Dispute Resolution</td>
                  <td className="p-4 text-slate-800 bg-emerald-50/50">Human cooperative welfare mediation desk</td>
                  <td className="p-4 text-slate-600">Automated bots with instant account bans</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-slate-900">Social Protection</td>
                  <td className="p-4 text-slate-800 bg-emerald-50/50">Statutory insurance (PMSBY & e-Shram) integrated</td>
                  <td className="p-4 text-slate-600">Classified as informal independent contractors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-teal-800 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold">Join the Cooperative Workforce Movement</h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Whether you are a customer seeking ethical, verified home services, or a skilled tradesperson ready for fair pay, join SHRAMSETU today.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/directory')}
              className="bg-white text-blue-950 font-bold hover:bg-slate-100 text-xs px-6 h-11"
            >
              Browse Verified Directory
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-xs px-6 h-11"
            >
              Worker & Cooperative Login
            </Button>
          </div>
        </div>
      </div>
  );
}
