import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { MapPin, CheckCircle2, Users } from 'lucide-react';
import { WorkerProfile } from '../../types';

export function WorkerMassHiring() {
  const { currentUser, users = [], massHirings = [], applyForMassHiring } = useStore();
  const worker = (currentUser?.role === 'worker' ? currentUser : users.find(u => u.role === 'worker')) as WorkerProfile;
  const workerId = worker?.id || 'w1';

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleApply = (hiringId: string, orgName: string) => {
    applyForMassHiring(hiringId, workerId);
    setSuccessToast(`Applied to ${orgName}!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Simple Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mass Hiring</h1>
        <p className="text-slate-500 text-sm mt-1">
          Apply for bulk institutional jobs and contract projects.
        </p>
      </div>

      {/* Success Notice */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-950 font-bold ml-3">✕</button>
        </div>
      )}

      {/* Simplified Clean List */}
      <div className="space-y-3">
        {massHirings.map((hiring) => {
          const isApplied = (hiring.appliedWorkerIds || []).includes(workerId);

          return (
            <div 
              key={hiring.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{hiring.organization}</h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {hiring.requiredWorkers} workers
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {hiring.location}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {hiring.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                  <span className="text-xs font-semibold text-emerald-700 ml-2">
                    {hiring.paymentBudget}
                  </span>
                </div>
              </div>

              <div className="shrink-0 sm:self-center">
                {isApplied ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Applied
                  </span>
                ) : (
                  <Button 
                    onClick={() => handleApply(hiring.id, hiring.organization)}
                    className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold h-9 px-4 rounded-xl w-full sm:w-auto"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
