import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { 
  Zap, Droplet, Hammer, Sparkles, HeartHandshake, 
  Paintbrush, Wrench, ShieldCheck, 
  ArrowRight, Users, Award, TrendingUp, Building2, 
  PhoneCall, Star, Clock, Percent, Heart, Landmark, GraduationCap 
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export function Home() {
  const navigate = useNavigate();
  const { currentUser } = useStore();

  const handleBookService = (serviceName: string) => {
    if (currentUser && currentUser.role === 'customer') {
      navigate(`/dashboard/customer/book?service=${encodeURIComponent(serviceName)}`);
    } else {
      navigate('/login');
    }
  };

  const servicesList = [
    {
      name: 'Electrical & Power Systems',
      nativeName: 'बिजली व वायरिंग सेवा',
      shortName: 'Electrical',
      description: 'Circuit diagnosis, MCB repair, switchboard replacement, earthing & heavy appliance load installations.',
      rate: '₹249',
      category: 'Power & Infrastructure',
      icon: Zap,
      accent: 'text-amber-700 bg-amber-50 border-amber-200',
      badge: '30 Min Dispatch',
      rating: '4.9 ★',
      workers: '42 Available'
    },
    {
      name: 'Plumbing & Water Flow',
      nativeName: 'नल व जल सेवा',
      shortName: 'Plumbing',
      description: 'Leak detection, pipe repairs, bathroom fittings, motor pumps, kitchen drainage & overhead tank sanitization.',
      rate: '₹299',
      category: 'Water & Piping',
      icon: Droplet,
      accent: 'text-blue-700 bg-blue-50 border-blue-200',
      badge: 'Leakage Guaranteed',
      rating: '4.8 ★',
      workers: '56 Available'
    },
    {
      name: 'Carpentry & Woodcraft',
      nativeName: 'बढ़ईगीरी व फर्नीचर',
      shortName: 'Carpentry',
      description: 'Modular furniture assembly, door locks, hinges, sliding channels, bed repair & custom architectural woodwork.',
      rate: '₹349',
      category: 'Woodcraft',
      icon: Hammer,
      accent: 'text-amber-800 bg-amber-50 border-amber-200',
      badge: 'Precision Tools',
      rating: '4.9 ★',
      workers: '31 Available'
    },
    {
      name: 'Home Sanitization & Cleaning',
      nativeName: 'गहन घर सफाई',
      shortName: 'Cleaning',
      description: 'Mechanized scrubbing, kitchen degreasing, bathroom descaling, sofa extraction & eco-friendly hospital-grade disinfection.',
      rate: '₹499',
      category: 'Sanitization',
      icon: Sparkles,
      accent: 'text-teal-700 bg-teal-50 border-teal-200',
      badge: 'Eco Safe Scrub',
      rating: '4.9 ★',
      workers: '68 Available'
    },
    {
      name: 'Home Healthcare & Elder Care',
      nativeName: 'बुजुर्ग व स्वास्थ्य सेवा',
      shortName: 'Elder Care',
      description: 'Certified bedside patient assistance, elderly companionship, vitals monitoring & post-operative compassionate home care.',
      rate: '₹450/day',
      category: 'Social Health Care',
      icon: HeartHandshake,
      accent: 'text-rose-700 bg-rose-50 border-rose-200',
      badge: 'Certified Aides',
      rating: '5.0 ★',
      workers: '24 Available'
    },
    {
      name: 'Wall Painting & Waterproofing',
      nativeName: 'पेंटिंग व वॉटरप्रूफिंग',
      shortName: 'Painting',
      description: 'Wall seepage treatment, waterproof primer, crack filling, anti-fungal emulsion & designer accent finishes.',
      rate: '₹399',
      category: 'Surface Finishes',
      icon: Paintbrush,
      accent: 'text-purple-700 bg-purple-50 border-purple-200',
      badge: 'Anti-Damp Guarantee',
      rating: '4.8 ★',
      workers: '38 Available'
    },
    {
      name: 'AC & Appliance Care',
      nativeName: 'एसी व उपकरण मरम्मत',
      shortName: 'Appliance',
      description: 'High-pressure AC jet cleaning, gas charging, washing machine drum repair & refrigerator cooling diagnosis.',
      rate: '₹349',
      category: 'Cooling & Machines',
      icon: Wrench,
      accent: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      badge: 'Genuine Spares',
      rating: '4.9 ★',
      workers: '49 Available'
    },
    {
      name: 'Civil Masonry & Tile Work',
      nativeName: 'राजमिस्त्री व निर्माण कार्य',
      shortName: 'Civil Work',
      description: 'Tile crack restoration, floor grouting, boundary plastering, balcony slope correction & concrete masonry repair.',
      rate: '₹499',
      category: 'Civil Trades',
      icon: Building2,
      accent: 'text-slate-800 bg-slate-100 border-slate-300',
      badge: 'Government Certified',
      rating: '4.7 ★',
      workers: '29 Available'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Connecting Skills.<br />
            <span className="text-teal-300">Empowering Cooperatives.</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Verified local technicians. Zero platform commissions. Dignity and fair workload allocation for informal trade workers across India.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-950 hover:bg-slate-100 font-bold px-7 h-12 shadow-md w-full sm:w-auto" 
              onClick={() => navigate('/login')}
            >
              Book a Certified Service
            </Button>
            <Button 
              size="lg" 
              className="bg-blue-800 hover:bg-blue-700 text-white font-bold border border-blue-600 px-7 h-12 w-full sm:w-auto" 
              onClick={() => navigate('/login')}
            >
              Join as Worker / Cooperative
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section - Just Logo & Service Name */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Services</h2>
            <p className="text-sm text-slate-600">
              Select a service trade to book verified cooperative technicians.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {servicesList.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.name} 
                  onClick={() => handleBookService(service.shortName || service.name)}
                  className="p-6 rounded-2xl border border-slate-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 bg-white flex flex-col items-center text-center justify-center gap-3 cursor-pointer group hover:-translate-y-0.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center border border-blue-100 group-hover:bg-blue-900 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-900 transition-colors">
                    {service.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose SHRAMSETU? (Why Us Section) */}
      <section id="why-us" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose SHRAMSETU?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Built on ethics, public dignity, and cooperative accountability. Here is why thousands of households and technicians trust our platform rail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Zero Platform Fee</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% direct payouts to workers. No commission cuts or aggregator deductions. Fair pricing for customers with zero inflated middleman markups.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Women Safety & Verified Trust</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mandatory Aadhaar KYC, Police record verification, live GPS tracking during transit, and an integrated SOS emergency dispatch desk for complete peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Training & Certifications</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Workers receive structured skill upskilling workshops, safety standard trainings, and government-recognized trade certifications administered directly by labor cooperatives to advance their trade careers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Faster Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prompt service delivery by matching the right nearest verified worker to your doorstep using real-time geolocation, exact trade skills, and live availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">About SHRAMSETU</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              SHRAMSETU is an open digital public infrastructure engineered to bring dignity, financial empowerment, and cooperative self-governance to unorganized trade workers. Built in alignment with municipal labor unions, our platform balances worker welfare with transparent citizen service delivery.
            </p>
          </div>
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-xs border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-950 mb-1">5,000+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Happy Citizens Served</div>
              <p className="text-[11px] text-slate-400 mt-1">Across residential clusters</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-xs border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-teal-700 mb-1">1,000+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Technicians</div>
              <p className="text-[11px] text-slate-400 mt-1">Police-cleared & insured</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-xs border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-950 mb-1">50+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Labor Cooperatives</div>
              <p className="text-[11px] text-slate-400 mt-1">Federated union network</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-xs border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-1">10,000+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Jobs</div>
              <p className="text-[11px] text-slate-400 mt-1">₹0 commission deducted</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
