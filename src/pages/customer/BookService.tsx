import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { 
  ShieldCheck, Info, Upload, Image as ImageIcon, Video, X, 
  MapPin, CheckCircle2, Clock, Sparkles, Navigation 
} from 'lucide-react';
import { InteractiveMap } from '../../components/common/InteractiveMap';
import { JobMedia } from '../../types';

export function BookService() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';
  const initialType = searchParams.get('type') || 'normal';

  const navigate = useNavigate();
  const { bookService, currentUser, findBestWorkerMatch } = useStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: initialService,
    description: '',
    address: 'Flat 402, Shivam Apts, Hill Road',
    locality: currentUser?.locality || 'Bandra West',
    priority: initialType as 'normal' | 'urgent' | 'emergency',
    preference: 'any' as 'any' | 'women_preferred',
    media: [] as JobMedia[]
  });

  const [isMatching, setIsMatching] = useState(false);
  const [previewMatch, setPreviewMatch] = useState<any>(null);

  // File upload simulator / handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const isVideo = file.type.startsWith('video');
      const mockUrl = isVideo 
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        media: [...prev.media, {
          type: isVideo ? 'video' : 'image',
          url: mockUrl,
          label: file.name
        }]
      }));
    }
  };

  const handleAddSampleMedia = (type: 'tap' | 'switch') => {
    if (type === 'tap') {
      setFormData(prev => ({
        ...prev,
        service: 'Plumbing Solutions',
        description: 'Kitchen sink pipe joint leaking water onto the cabinet base.',
        media: [...prev.media, {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80',
          label: 'Leaking Sink Joint.jpg'
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        service: 'Electrical & Wiring',
        description: 'Main switch board sparking and tripped MCB.',
        media: [...prev.media, {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=80',
          label: 'Sparking MCB Box.jpg'
        }]
      }));
    }
  };

  const removeMedia = (index: number) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    // Calculate preview match for step 2
    const match = findBestWorkerMatch(
      formData.service || 'Plumbing Solutions',
      formData.locality,
      formData.preference === 'women_preferred'
    );
    setPreviewMatch(match);
    setStep(2);
  };
  
  const handleConfirm = () => {
    setIsMatching(true);
    setTimeout(() => {
      bookService({
        service: formData.service || 'Plumbing Solutions',
        description: formData.description,
        address: formData.address,
        locality: formData.locality,
        coordinates: { lat: 19.0596, lng: 72.8295 },
        priority: formData.priority,
        preference: formData.preference,
        price: formData.priority === 'emergency' ? 850 : 600,
        scheduledDate: new Date(Date.now() + 3600000 * 2).toISOString(),
        media: formData.media
      });
      navigate('/dashboard/customer/bookings');
    }, 1500);
  };

  if (isMatching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-2xl border border-slate-200 p-8">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Connecting with Cooperative Workforce...</h2>
        <p className="text-slate-600 max-w-md text-center text-sm leading-relaxed">
          Evaluating proximity, certified trade skills, and workload distribution to assign your local verified professional.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-blue-800 bg-blue-50 px-4 py-2 rounded-full font-medium">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>Zero Platform Fee • Cooperative Owned Guarantee</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <span className={step >= 1 ? "text-blue-900 font-bold" : ""}>1. Service & Problem Details</span>
        <span className="text-slate-300">———</span>
        <span className={step >= 2 ? "text-blue-900 font-bold" : ""}>2. Location, Locality & Matching</span>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-900">Book Cooperative Service</CardTitle>
              <CardDescription>
                {formData.priority === 'emergency' 
                  ? 'High Priority / Emergency dispatch. Immediate cooperative technician assignment.' 
                  : 'Fair pricing, verified local workers, with transparent zero platform fee.'}
              </CardDescription>
            </div>
            {formData.priority === 'emergency' && (
              <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Emergency
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {step === 1 ? (
            <>
              {/* Service Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Trade / Service Category</label>
                <select 
                  className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                >
                  <option value="">Select a service category...</option>
                  <option value="Plumbing Solutions">Plumbing Solutions</option>
                  <option value="Electrical & Wiring">Electrical & Wiring</option>
                  <option value="Deep Cleaning">Deep Cleaning</option>
                  <option value="Carpentry & Wood">Carpentry & Wood</option>
                  <option value="Home Care & Nursing">Home Care & Nursing</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Painting & Decor">Painting & Decor</option>
                  <option value="Professional Driving">Professional Driving</option>
                </select>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">Describe the Issue or Requirements</label>
                <textarea 
                  className="flex w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 min-h-[110px]"
                  placeholder="Explain what needs repair, location of leak or fault, symptoms (e.g. water leaking under basin, burning smell from socket)..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Media Upload (Photos & Video) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-700" />
                    Upload Photos or Short Video (Optional)
                  </label>
                  <span className="text-xs text-slate-500">Helps worker bring exact spare parts</span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-slate-500 self-center">Quick demo presets:</span>
                  <button
                    type="button"
                    onClick={() => handleAddSampleMedia('tap')}
                    className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                  >
                    + Attach Leaking Tap Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddSampleMedia('switch')}
                    className="px-2.5 py-1 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 rounded border border-yellow-200 transition-colors"
                  >
                    + Attach Sparking Switch Photo
                  </button>
                </div>

                {/* Upload Input Area */}
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-700 rounded-xl p-4 text-center bg-slate-50/50 cursor-pointer transition-colors relative">
                  <input 
                    type="file" 
                    accept="image/*,video/*" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <div className="text-xs font-medium text-slate-700">
                      <span className="text-blue-900 font-semibold underline">Click to upload</span> or drag and drop photos / video
                    </div>
                    <p className="text-[11px] text-slate-400">PNG, JPG, MP4 up to 25MB</p>
                  </div>
                </div>

                {/* Attached Previews */}
                {(formData?.media || []).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {(formData?.media || []).map((item, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.label} className="w-full h-24 object-cover" />
                        ) : (
                          <div className="w-full h-24 bg-slate-800 flex items-center justify-center text-white">
                            <Video className="w-6 h-6" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(idx)}
                          className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="p-1 text-[10px] truncate text-slate-600 bg-slate-50 font-medium">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Priority */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-slate-800">Service Priority</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['normal', 'urgent', 'emergency'] as const).map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setFormData({...formData, priority: p})}
                      className={`p-3 border rounded-lg text-sm font-medium capitalize transition-all text-left flex flex-col justify-between ${
                        formData.priority === p 
                          ? (p === 'emergency' 
                              ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500' 
                              : 'border-blue-900 bg-blue-50 text-blue-950 ring-2 ring-blue-900')
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-bold">{p}</span>
                      <span className="text-[11px] text-slate-500 mt-1">
                        {p === 'normal' ? 'Scheduled slot' : p === 'urgent' ? 'Within 2 hours' : 'Immediate dispatch'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Locality, Address, Map, and Preference */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Locality / Area</label>
                  <select
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
                    value={formData.locality}
                    onChange={e => {
                      const loc = e.target.value;
                      setFormData(prev => ({ ...prev, locality: loc }));
                      setPreviewMatch(findBestWorkerMatch(formData.service, loc, formData.preference === 'women_preferred'));
                    }}
                  >
                    <option value="Bandra West">Bandra West</option>
                    <option value="Andheri West">Andheri West</option>
                    <option value="Dadar East">Dadar East</option>
                    <option value="Santacruz">Santacruz</option>
                    <option value="Mumbai Central">Mumbai Central</option>
                    <option value="Powai">Powai</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Premises / Flat Address</label>
                  <Input 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Building, Flat No, Street..."
                    className="h-11"
                  />
                </div>
              </div>

              {/* Women Worker Preference Filter */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-700" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Worker Preference</h4>
                      <p className="text-xs text-slate-500">Optionally prioritize verified women service professionals</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Safe & Verified
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <label 
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.preference === 'any' ? 'bg-white border-blue-900 ring-1 ring-blue-900' : 'bg-white border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="preference" 
                      checked={formData.preference === 'any'}
                      onChange={() => {
                        setFormData({...formData, preference: 'any'});
                        setPreviewMatch(findBestWorkerMatch(formData.service, formData.locality, false));
                      }}
                      className="accent-blue-900"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Any Verified Worker</div>
                      <div className="text-[11px] text-slate-500">Fastest available certified specialist</div>
                    </div>
                  </label>

                  <label 
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.preference === 'women_preferred' ? 'bg-white border-blue-900 ring-1 ring-blue-900' : 'bg-white border-slate-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="preference" 
                      checked={formData.preference === 'women_preferred'}
                      onChange={() => {
                        setFormData({...formData, preference: 'women_preferred'});
                        setPreviewMatch(findBestWorkerMatch(formData.service, formData.locality, true));
                      }}
                      className="accent-blue-900"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Prefer a Women Worker</div>
                      <div className="text-[11px] text-slate-500">Ideal for home care, nursing & cleaning</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Locality Map & Matching Recommendation Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-700" />
                    Locality Proximity & Matching Engine
                  </label>
                  <span className="text-xs text-slate-500">Fair opportunity routing</span>
                </div>

                <InteractiveMap 
                  customerLocality={formData.locality}
                  customerAddress={formData.address}
                  workerName={previewMatch?.worker?.name || 'Cooperative Technician'}
                  workerLocality={previewMatch?.worker?.serviceLocality || 'Andheri West'}
                  distanceKm={previewMatch?.distanceKm || 2.1}
                  estimatedTravelMins={previewMatch?.travelMins || 11}
                  status="accepted"
                  className="h-56"
                />

                {previewMatch?.worker && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-700" />
                        <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                          Recommended Match: {previewMatch.worker.name} ({previewMatch.worker.rating}★)
                        </span>
                      </div>
                      <span className="text-xs text-blue-800 font-medium">
                        {previewMatch.distanceKm} km away • {previewMatch.travelMins} mins
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-1.5 pt-1 text-xs text-slate-700">
                      {(previewMatch?.reasons || []).map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Zero Fee & Cost Transparency */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900">Standard Estimated Service Charge</div>
                  <div className="text-slate-500">Includes trade labor inspection and standard repair tools.</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-950">
                    {formData.priority === 'emergency' ? '₹850' : '₹600'}
                  </div>
                  <div className="text-emerald-700 font-semibold">Zero Platform Commission</div>
                </div>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between bg-slate-50 border-t border-slate-200 p-4">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
          )}
          {step === 1 ? (
            <Button 
              className="ml-auto bg-blue-900 text-white hover:bg-blue-800" 
              onClick={handleNext} 
              disabled={!formData.service || !formData.description}
            >
              Continue to Matching
            </Button>
          ) : (
            <Button 
              className="ml-auto bg-blue-900 text-white hover:bg-blue-800" 
              onClick={handleConfirm}
            >
              Confirm & Book Service
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
