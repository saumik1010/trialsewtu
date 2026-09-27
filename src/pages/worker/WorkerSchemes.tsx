import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Award, ExternalLink, CheckCircle2, AlertCircle, BookOpen, 
  Calendar, MapPin, Users, Sparkles, ShieldCheck 
} from 'lucide-react';
import { GovernmentScheme, Training } from '../../types';

export function WorkerSchemes() {
  const { schemes = [], trainings = [], enrollTraining } = useStore();
  const safeSchemes = schemes || [];
  const safeTrainings = trainings || [];
  const [activeTab, setActiveTab] = useState<'schemes' | 'training'>('schemes');

  // Eligibility Checker State
  const [showCheckerModal, setShowCheckerModal] = useState(false);
  const [age, setAge] = useState(32);
  const [monthlyIncome, setMonthlyIncome] = useState(22000);
  const [isUnorganized, setIsUnorganized] = useState(true);
  const [hasAadhaarBank, setHasAadhaarBank] = useState(true);
  const [checkerSubmitted, setCheckerSubmitted] = useState(false);

  const eligibleSchemes = safeSchemes.filter(s => {
    if (!isUnorganized && s.id === 'scheme-1') return false;
    if (monthlyIncome > 50000 && s.id === 'scheme-2') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Government Schemes & Upskilling</h1>
          <p className="text-slate-500 text-sm">Official welfare entitlements, social security programs, and cooperative vocational courses.</p>
        </div>
        <Button 
          onClick={() => {
            setShowCheckerModal(true);
            setCheckerSubmitted(false);
          }}
          className="bg-blue-900 text-white hover:bg-blue-800 gap-1.5 text-xs"
        >
          <Sparkles className="w-4 h-4" /> Run 1-Click Eligibility Check
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'schemes'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Central & State Schemes ({safeSchemes.length})
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'training'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Cooperative Skill Upgrades & Training ({safeTrainings.length})
        </button>
      </div>

      {/* Tab Content: Schemes */}
      {activeTab === 'schemes' && (
        <div className="grid md:grid-cols-2 gap-6">
          {safeSchemes.map(s => (
            <Card key={s.id} className="shadow-xs border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <CardHeader className="bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                      <Award className="w-5 h-5 text-teal-700 shrink-0" />
                      <span>{s.name}</span>
                    </CardTitle>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full shrink-0">
                      {s.category}
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-600 mt-1">{s.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <span className="font-bold text-xs text-slate-800 block mb-1">Key Eligibility Criteria:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {(s.eligibility || []).map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-xs text-slate-800 block mb-1">Entitlements & Benefits:</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {s.benefits}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-xs text-slate-800 block mb-1">Required Documents:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(s.documentsRequired || []).map((doc, i) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-medium">Official Portal Link</span>
                <a
                  href={s.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700 hover:underline"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab Content: Training */}
      {activeTab === 'training' && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950">
              <span className="font-bold block">Free Cooperative Upskilling Modules</span>
              Complete NSDC and municipal safety certifications to increase your priority matching score and unlock commercial high-value contracts.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {safeTrainings.map(t => (
              <Card key={t.id} className="border-slate-200 shadow-xs flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                      {t.trade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{t.description}</p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.date} ({t.duration})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{t.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.availableSeats} of {t.totalSeats} seats remaining</span>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                    Certification: <strong>{t.certification}</strong>
                  </div>
                </CardContent>

                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  {t.enrolled ? (
                    <div className="w-full py-2 bg-emerald-100 text-emerald-800 text-center font-bold text-xs rounded-lg flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Enrolled & Confirmed</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => enrollTraining(t.id)}
                      className="w-full bg-blue-900 text-white hover:bg-blue-800 text-xs font-bold"
                    >
                      Enroll in Course (Free)
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Eligibility Checker Modal */}
      {showCheckerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-blue-900">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Welfare Scheme Eligibility Evaluator</h3>
              </div>
              <button onClick={() => setShowCheckerModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {!checkerSubmitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setCheckerSubmitted(true); }} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Age (Years)</label>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={e => setAge(Number(e.target.value))} 
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Monthly Household Income (₹)</label>
                  <input 
                    type="number" 
                    value={monthlyIncome} 
                    onChange={e => setMonthlyIncome(Number(e.target.value))} 
                    className="w-full h-10 px-3 border border-slate-300 rounded-lg text-xs outline-none focus:border-blue-900"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isUnorganized} 
                      onChange={e => setIsUnorganized(e.target.checked)}
                      className="accent-blue-900 rounded"
                    />
                    <span className="text-slate-800">I work in the unorganized / informal trade sector</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={hasAadhaarBank} 
                      onChange={e => setHasAadhaarBank(e.target.checked)}
                      className="accent-blue-900 rounded"
                    />
                    <span className="text-slate-800">I have an Aadhaar-linked savings bank account (DBT enabled)</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowCheckerModal(false)}>
                    Close
                  </Button>
                  <Button type="submit" className="bg-blue-900 text-white text-xs">
                    Evaluate My Entitlements
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <span className="font-bold block text-sm">Congratulations! You are eligible for {eligibleSchemes.length} schemes:</span>
                  <p className="mt-1">Based on your age ({age}) and unorganized sector profile, your official benefits are ready to claim.</p>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {(eligibleSchemes || []).map(s => (
                    <div key={s.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-emerald-700 font-semibold">{s.benefits.slice(0, 50)}...</span>
                      </div>
                      <a 
                        href={s.officialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-2.5 py-1 bg-blue-900 text-white rounded text-[11px] font-bold hover:bg-blue-800 shrink-0"
                      >
                        Apply Link
                      </a>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={() => setShowCheckerModal(false)} className="bg-blue-900 text-white text-xs">
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
