import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { WorkerProfile } from '../../types';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Search, MapPin, Star, ShieldCheck, Award, 
  CheckCircle2, Clock, Filter, ArrowRight 
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export function PublicDirectory() {
  const navigate = useNavigate();
  const { users = [], selectWorkerForBooking } = useStore();
  const safeUsers = users || [];
  const workers = safeUsers.filter(u => u.role === 'worker') as WorkerProfile[];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [selectedLocality, setSelectedLocality] = useState('all');
  const [womenOnly, setWomenOnly] = useState(false);

  const trades = ['all', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'];
  const localities = ['all', 'Bandra West', 'Andheri West', 'Santacruz', 'Dadar East'];

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.serviceLocality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrade = selectedTrade === 'all' || w.skills.some(s => s.toLowerCase().includes(selectedTrade.toLowerCase()));
    const matchesLocality = selectedLocality === 'all' || w.serviceLocality.toLowerCase().includes(selectedLocality.toLowerCase());
    const matchesWomen = !womenOnly || w.isWomenWorker;

    return matchesSearch && matchesTrade && matchesLocality && matchesWomen;
  });

  const handleHireDirectly = (worker: WorkerProfile) => {
    selectWorkerForBooking(worker.id);
    navigate(`/dashboard/customer/book?workerId=${worker.id}&trade=${encodeURIComponent(worker.skills[0] || '')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Public Civic Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Verified Cooperative Tradespersons
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Search certified independent workers across municipal wards. 100% police & skill verified, backed by labor cooperative guarantees.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
          <div className="grid sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by worker name, skill, or locality..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-blue-900"
              />
            </div>

            {/* Locality Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedLocality}
                onChange={e => setSelectedLocality(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white outline-none focus:border-blue-900"
              >
                {localities.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Municipal Localities' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Women worker toggle */}
            <div className="sm:col-span-3 flex items-center justify-center sm:justify-start px-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={womenOnly}
                  onChange={e => setWomenOnly(e.target.checked)}
                  className="accent-teal-700 w-4 h-4 rounded"
                />
                <span>Verified Women Workers Only</span>
              </label>
            </div>
          </div>

          {/* Trade Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Trade:</span>
            {trades.map(trade => (
              <button
                key={trade}
                onClick={() => setSelectedTrade(trade)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedTrade === trade
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map(worker => (
            <Card key={worker.id} className="border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-900 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{worker.name}</h3>
                    </div>
                    <p className="text-blue-900 font-semibold text-xs mt-0.5">{worker.skills.join(', ')}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 font-bold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {worker.rating}
                      </span>
                      <span>•</span>
                      <span>{worker.completedJobs} jobs</span>
                    </div>
                  </div>
                </div>

                {worker.isWomenWorker && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold">
                    ✓ Verified Women Cooperative Tradesperson
                  </span>
                )}

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Locality: <strong>{worker.serviceLocality}</strong> ({worker.serviceRadius} km radius)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Experience: <strong>{worker.experience} Years Certified</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Police & Skill Background Verified</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600">
                  Languages: <strong>{worker.languages.join(', ')}</strong>
                </div>
              </CardContent>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-500 block">Cooperative Rate</span>
                  <span className="font-bold text-slate-900">Zero Commission</span>
                </div>
                <Button 
                  onClick={() => handleHireDirectly(worker)}
                  className="bg-blue-900 text-white hover:bg-blue-800 text-xs font-bold gap-1"
                >
                  Hire Worker Directly <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
  );
}
