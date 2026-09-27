import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, LogOut, Menu, X, Home, Briefcase, 
  User, Calendar, Bell, Mic, FileText, 
  TrendingUp, Users, ShieldAlert, Award, Globe, AlertCircle, Scale, GraduationCap, FileCheck 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { INDIAN_LANGUAGES } from './PublicLayout';

export function DashboardLayout() {
  const { currentUser, logout, users, login } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'customer':
        return [
          { label: 'Dashboard', icon: Home, path: '/dashboard/customer' },
          { label: 'Book Service', icon: Briefcase, path: '/dashboard/customer/book' },
          { label: 'My Bookings', icon: Calendar, path: '/dashboard/customer/bookings' },
          { label: 'Register Complaint', icon: AlertCircle, path: '/dashboard/customer?action=complaint' },
        ];
      case 'worker':
        return [
          { label: 'Today\'s Jobs', icon: Home, path: '/dashboard/worker' },
          { label: 'My Portfolio', icon: FileText, path: '/dashboard/worker/portfolio' },
          { label: 'Mass Hiring', icon: Users, path: '/dashboard/worker/mass-hiring' },
          { label: 'Govt Schemes', icon: Award, path: '/dashboard/worker/schemes' },
          { label: 'Direct Earnings', icon: TrendingUp, path: '/dashboard/worker/earnings' },
          { label: 'SOS & Welfare', icon: ShieldAlert, path: '/dashboard/worker/welfare' },
        ];
      case 'cooperative':
        return [
          { label: 'Live Dispatch', icon: Home, path: '/dashboard/cooperative' },
          { label: 'Demand Forecast', icon: TrendingUp, path: '/dashboard/cooperative?tab=forecast' },
          { label: 'Worker Training', icon: GraduationCap, path: '/dashboard/cooperative?tab=training' },
          { label: 'Institute Contracts', icon: FileCheck, path: '/dashboard/cooperative?tab=contracts' },
          { label: 'Fair Workload Balancing', icon: Scale, path: '/dashboard/cooperative/workload' },
          { label: 'Dispute Support', icon: ShieldAlert, path: '/dashboard/cooperative/grievances' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <header className="md:hidden bg-blue-900 text-white h-16 flex items-center justify-between px-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-300" />
            <span className="font-bold tracking-tight text-white">SHRAMSETU</span>
          </Link>
        </div>
        <div className="flex items-center gap-2.5">
          {currentUser.role === 'worker' && (
            <button 
              className="bg-teal-500 p-2 rounded-full shadow text-white flex items-center justify-center" 
              onClick={() => navigate('/dashboard/worker/voice')}
              title="Voice Saathi"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Language Selector */}
          <div className="flex items-center bg-blue-950 text-white rounded-md px-1.5 py-1 text-xs border border-blue-800">
            <Globe className="w-3.5 h-3.5 mr-1 text-teal-300" />
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-white text-[11px] font-bold outline-none cursor-pointer"
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-slate-900">
                  {lang.code === 'en' || lang.native === lang.english ? lang.native : `${lang.native} (${lang.english})`}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop) & Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-slate-900/50 transition-opacity md:hidden",
        isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsMobileMenuOpen(false)} />

      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shrink-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Brand Banner */}
        <div className="h-16 hidden md:flex items-center justify-between px-6 border-b border-blue-950 bg-blue-900 text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white/10 p-1 rounded-md">
              <Building2 className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">SHRAMSETU</span>
              <span className="text-[9px] text-blue-200 font-semibold tracking-wider uppercase">Public Service</span>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-200 flex flex-col items-center bg-slate-50/70">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-900 mb-2 shadow-xs">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-sm text-center line-clamp-1">{currentUser.name}</h3>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const currentFull = location.pathname + location.search;
              const isActive = item.path === '/dashboard/cooperative' 
                ? (location.pathname === '/dashboard/cooperative' && (!location.search || location.search === '?tab=dispatch'))
                : currentFull === item.path || (item.path.includes('?') && location.search.includes(item.path.split('?')[1]));

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                      isActive
                        ? "bg-blue-900 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-200 space-y-1.5 bg-slate-50/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-xs font-bold text-red-700 hover:text-red-800 hover:bg-red-50" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Desktop Top Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-end px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Multi-Language Selector with Native Words */}
            <div className="flex items-center gap-1 text-slate-700 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 hover:bg-white transition-colors">
              <Globe className="w-4 h-4 text-blue-900 shrink-0" />
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold outline-none cursor-pointer pr-1"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code === 'en' || lang.native === lang.english ? lang.native : `${lang.native} (${lang.english})`}
                  </option>
                ))}
              </select>
            </div>

            {currentUser.role === 'worker' && (
              <Button 
                variant="outline" 
                size="sm"
                className="gap-1.5 border-teal-600 text-teal-800 hover:bg-teal-50 text-xs font-bold" 
                onClick={() => navigate('/dashboard/worker/voice')}
              >
                <Mic className="w-4 h-4 text-teal-600" />
                Voice Saathi (बोलकर पूछें)
              </Button>
            )}
          </div>
        </header>

        {/* Scrollable View */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-between">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
            
            {/* Dashboard Footer */}
            <footer className="mt-12 pt-6 pb-4 border-t border-slate-200 text-xs text-slate-500 flex justify-center items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">SHRAMSETU</span>
                <span>•</span>
                <span>श्रमसेतु सहकार मंच</span>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
