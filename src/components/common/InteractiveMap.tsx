import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, User } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InteractiveMapProps {
  customerLocality?: string;
  customerAddress?: string;
  workerName?: string;
  workerLocality?: string;
  distanceKm?: number;
  estimatedTravelMins?: number;
  status?: string; // 'requested' | 'assigned' | 'accepted' | 'on_the_way' | 'arrived' | 'started' | 'completed'
  className?: string;
  showExactRoute?: boolean;
}

export function InteractiveMap({
  customerLocality = 'Bandra West',
  customerAddress = 'Hill Road, Bandra West, Mumbai',
  workerName = 'Rajesh Kumar',
  workerLocality = 'Andheri West',
  distanceKm = 2.4,
  estimatedTravelMins = 12,
  status = 'accepted',
  className,
  showExactRoute = true
}: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');

  const isOnTheWay = status === 'on_the_way';
  const hasArrived = status === 'arrived' || status === 'started' || status === 'completed';

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-slate-300 bg-slate-100 select-none", className)}>
      {/* Map Header / Status Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-sm border border-slate-200 shadow-sm rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-slate-800">
          <Navigation className="w-3.5 h-3.5 text-blue-700 animate-pulse" />
          <span>{distanceKm} km away</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-semibold">{estimatedTravelMins} mins ETA</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-1 shadow-sm">
          <button 
            type="button"
            onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
            className={cn("px-2 py-1 text-[11px] rounded font-medium transition-colors", mapType === 'street' ? "bg-blue-900 text-white" : "text-slate-700 hover:bg-slate-100")}
          >
            <Layers className="w-3 h-3 inline mr-1" />
            {mapType === 'street' ? 'Street' : 'Satellite'}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Simulation */}
      <div className={cn("w-full h-full min-h-[260px] flex items-center justify-center transition-all duration-300", mapType === 'satellite' ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900")}>
        <svg 
          viewBox="0 0 600 340" 
          className="w-full h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
        >
          {/* Map Grid / Roads */}
          <defs>
            <pattern id="road-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={mapType === 'satellite' ? '#334155' : '#e2e8f0'} strokeWidth="1" />
            </pattern>
            <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>

          <rect width="600" height="340" fill="url(#road-grid)" />

          {/* Major Roads */}
          <path d="M 0 160 Q 200 130 400 190 T 600 140" fill="none" stroke={mapType === 'satellite' ? '#475569' : '#cbd5e1'} strokeWidth="12" />
          <path d="M 0 160 Q 200 130 400 190 T 600 140" fill="none" stroke={mapType === 'satellite' ? '#64748b' : '#ffffff'} strokeWidth="8" />

          <path d="M 180 0 Q 220 180 320 340" fill="none" stroke={mapType === 'satellite' ? '#475569' : '#cbd5e1'} strokeWidth="10" />
          <path d="M 180 0 Q 220 180 320 340" fill="none" stroke={mapType === 'satellite' ? '#64748b' : '#ffffff'} strokeWidth="6" />

          {/* Local area labels */}
          <text x="70" y="80" fill={mapType === 'satellite' ? '#94a3b8' : '#94a3b8'} fontSize="11" fontWeight="600" letterSpacing="1">MUMBAI WESTERN SUBURBS</text>
          <text x="380" y="270" fill={mapType === 'satellite' ? '#94a3b8' : '#94a3b8'} fontSize="11" fontWeight="600" letterSpacing="1">COOPERATIVE ZONE 4</text>

          {/* Route path connecting Worker and Customer */}
          {showExactRoute && (
            <>
              {/* Route Glow */}
              <path 
                d="M 160 210 C 230 200, 270 140, 440 120" 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeOpacity="0.4" 
              />
              {/* Animated Dashed Route */}
              <path 
                d="M 160 210 C 230 200, 270 140, 440 120" 
                fill="none" 
                stroke="url(#route-gradient)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeDasharray="6 4"
                className={isOnTheWay ? "animate-pulse" : ""}
              />
            </>
          )}

          {/* Worker Approximate Locality Circle (when privacy applies before live transit) */}
          {!isOnTheWay && !hasArrived && (
            <circle cx="160" cy="210" r="42" fill="#0284c7" fillOpacity="0.12" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 3" />
          )}

          {/* Worker Location Pin */}
          <g transform={`translate(${hasArrived ? 430 : (isOnTheWay ? 280 : 160)}, ${hasArrived ? 130 : (isOnTheWay ? 165 : 210)})`} className="cursor-pointer">
            <circle cx="0" cy="0" r="18" fill="#1e3a8a" className="shadow-lg" />
            <circle cx="0" cy="0" r="24" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" />
            <path d="M -6 -4 L 0 6 L 6 -4 Z" fill="#ffffff" />
            <circle cx="0" cy="-6" r="4" fill="#ffffff" />
            
            {/* Label */}
            <g transform="translate(0, -32)">
              <rect x="-60" y="-12" width="120" height="22" rx="6" fill="#172554" />
              <text x="0" y="3" fill="#ffffff" fontSize="9.5" fontWeight="600" textAnchor="middle">
                {workerName.split(' ')[0]} ({isOnTheWay ? 'Moving' : workerLocality})
              </text>
            </g>
          </g>

          {/* Customer Location Pin */}
          <g transform="translate(440, 120)" className="cursor-pointer">
            <circle cx="0" cy="0" r="18" fill="#0d9488" className="shadow-lg" />
            <circle cx="0" cy="0" r="8" fill="#ffffff" />
            <circle cx="0" cy="0" r="3" fill="#0d9488" />
            
            {/* Label */}
            <g transform="translate(0, 32)">
              <rect x="-65" y="-12" width="130" height="22" rx="6" fill="#0f766e" />
              <text x="0" y="3" fill="#ffffff" fontSize="9.5" fontWeight="600" textAnchor="middle">
                Customer ({customerLocality})
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-1 shadow-sm">
        <button 
          type="button"
          onClick={() => setZoom(prev => Math.min(prev + 0.2, 1.6))}
          className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button 
          type="button"
          onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))}
          className="w-7 h-7 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 rounded text-sm"
          title="Zoom Out"
        >
          -
        </button>
        <button 
          type="button"
          onClick={() => setZoom(1)}
          className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs"
          title="Reset View"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Privacy & Proximity Footer */}
      <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
          <span>Worker location privacy protected: Exact coordinates active during service transit.</span>
        </div>
        <div className="text-slate-500 font-medium">
          Locality: <span className="text-slate-800 font-semibold">{customerLocality}</span>
        </div>
      </div>
    </div>
  );
}
