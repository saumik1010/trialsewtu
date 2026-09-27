import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Menu, X, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { INDIAN_LANGUAGES } from '../../data/languages';
export { INDIAN_LANGUAGES };

export function PublicLayout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#' + id);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileNavOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2.5">
            <div className="bg-blue-900 text-white p-2 rounded-xl flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-blue-950 block leading-tight">SHRAMSETU</span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block">श्रमसेतु सहकार मंच</span>
            </div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <button onClick={handleHomeClick} className="hover:text-blue-900 transition-colors cursor-pointer">Home</button>
            <button onClick={(e) => handleScroll(e, 'services')} className="hover:text-blue-900 transition-colors cursor-pointer">Our Services</button>
            <button onClick={(e) => handleScroll(e, 'about')} className="hover:text-blue-900 transition-colors cursor-pointer">About</button>
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Multi-Language Selector */}
            <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white hover:border-slate-400 transition-colors">
              <Globe className="w-4 h-4 text-blue-900 shrink-0" />
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer pr-1"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code === 'en' || lang.native === lang.english ? lang.native : `${lang.native} (${lang.english})`}
                  </option>
                ))}
              </select>
            </div>

            <Button 
              variant="outline" 
              onClick={() => navigate('/login')} 
              className="text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-100 h-9 px-4"
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs h-9 px-4"
            >
              Book Service
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-900" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-lg">
            <nav className="flex flex-col space-y-3 font-semibold text-sm text-slate-800">
              <button onClick={handleHomeClick} className="text-left py-1 hover:text-blue-900">Home</button>
              <button onClick={(e) => handleScroll(e, 'services')} className="text-left py-1 hover:text-blue-900">Our Services</button>
              <button onClick={(e) => handleScroll(e, 'about')} className="text-left py-1 hover:text-blue-900">About SHRAMSETU</button>
            </nav>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-3">
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-2 bg-slate-50">
                <Globe className="w-4 h-4 text-blue-900 shrink-0" />
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none w-full"
                >
                  {INDIAN_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.code === 'en' || lang.native === lang.english ? lang.native : `${lang.native} (${lang.english})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => { setMobileNavOpen(false); navigate('/login'); }} 
                  className="flex-1 text-xs font-bold"
                >
                  Log In
                </Button>
                <Button 
                  onClick={() => { setMobileNavOpen(false); navigate('/login'); }} 
                  className="flex-1 bg-blue-900 text-white text-xs font-bold"
                >
                  Book Service
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-slate-300 py-14 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-blue-900 p-1.5 rounded-lg text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">SHRAMSETU</span>
            </div>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Empowering skilled informal workers through cooperative digital public infrastructure. Zero platform fees, fair workload allocation, and direct civic trust.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">FOR CUSTOMERS</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li><button onClick={(e) => handleScroll(e, 'services')} className="hover:text-white cursor-pointer text-left">Our Services</button></li>
              <li><Link to="/login" className="hover:text-white block">Book a Certified Technician</Link></li>
              <li><button onClick={(e) => handleScroll(e, 'services')} className="hover:text-white cursor-pointer text-left">Fair Standard Price Card</button></li>
              <li><Link to="/login" className="hover:text-white block">Track Live Booking</Link></li>
              <li><Link to="/directory" className="hover:text-white block">Find Workers Directory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">FOR WORKERS</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li><Link to="/login" className="hover:text-white block">Join as Member Worker</Link></li>
              <li><Link to="/login" className="hover:text-white block">Social Security & PMSBY Schemes</Link></li>
              <li><Link to="/login" className="hover:text-white block">NSDC Trade Certifications</Link></li>
              <li><Link to="/login" className="hover:text-white block">Mass Hiring & Bulk Drives</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">FOR COOPERATIVES</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li><Link to="/login" className="hover:text-white block">Cooperative Administration</Link></li>
              <li><Link to="/login" className="hover:text-white block">Inter-Union Federation Network</Link></li>
              <li><Link to="/login" className="hover:text-white block">AI Demand Load Forecasting</Link></li>
              <li><Link to="/audits" className="hover:text-white block">Institutional AMC Contracts</Link></li>
              <li><Link to="/audits" className="hover:text-white block">Public Audit Ledger</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-blue-900/60 text-xs text-blue-300/70 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 SHRAMSETU. A Digital Public Infrastructure Initiative for Labor Cooperatives.</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Safeguards</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition-colors">Citizen Charter</Link>
            <span>•</span>
            <span className="hover:text-white">Toll-Free 1800-SHRAM-SETU</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
