import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Bell, CheckCircle2, MessageSquare, Briefcase, Award, 
  AlertTriangle, Settings, X, Phone, ShieldCheck
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { Button } from '../ui/Button';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { 
    currentUser, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    notificationPreferences,
    updateNotificationPreferences,
    whatsAppLogs
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'job' | 'training' | 'whatsapp' | 'settings'>('all');
  const [prefPhone, setPrefPhone] = useState(notificationPreferences?.phone || '+91 98201 44521');
  const [prefWhatsApp, setPrefWhatsApp] = useState(notificationPreferences?.whatsapp ?? true);
  const [prefSMS, setPrefSMS] = useState(notificationPreferences?.sms ?? true);
  const [prefIVR, setPrefIVR] = useState(notificationPreferences?.voiceIvr ?? true);
  const [prefInApp, setPrefInApp] = useState(notificationPreferences?.inApp ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter notifications for current user / role
  const userNotifications = (notifications || []).filter(n => 
    n.userId === currentUser?.id || n.role === currentUser?.role || n.role === 'all'
  );

  const filteredList = activeTab === 'all' 
    ? userNotifications 
    : activeTab === 'whatsapp'
      ? userNotifications.filter(n => n.type === 'whatsapp')
      : userNotifications.filter(n => n.type === activeTab);

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences({
      phone: prefPhone,
      whatsapp: prefWhatsApp,
      sms: prefSMS,
      voiceIvr: prefIVR,
      inApp: prefInApp
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'training':
        return <Award className="w-4 h-4 text-teal-600" />;
      case 'payment':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-700" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-200" />
              <div>
                <h2 className="font-bold text-base">Notification Center</h2>
                <p className="text-xs text-blue-200">
                  {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-xs text-blue-200 hover:text-white underline underline-offset-2 px-2 py-1"
                >
                  Mark all read
                </button>
              )}
              <button 
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-blue-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={cn("px-3 py-2 rounded-md whitespace-nowrap", activeTab === 'all' ? "bg-white text-blue-900 font-semibold shadow-xs" : "hover:text-slate-900")}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setActiveTab('job')}
              className={cn("px-3 py-2 rounded-md whitespace-nowrap", activeTab === 'job' ? "bg-white text-blue-900 font-semibold shadow-xs" : "hover:text-slate-900")}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={cn("px-3 py-2 rounded-md whitespace-nowrap", activeTab === 'training' ? "bg-white text-blue-900 font-semibold shadow-xs" : "hover:text-slate-900")}
            >
              Training
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={cn("px-3 py-2 rounded-md whitespace-nowrap flex items-center gap-1", activeTab === 'whatsapp' ? "bg-white text-emerald-800 font-semibold shadow-xs" : "hover:text-slate-900")}
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              WhatsApp Log
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn("px-3 py-2 rounded-md whitespace-nowrap flex items-center gap-1 ml-auto", activeTab === 'settings' ? "bg-white text-blue-900 font-semibold shadow-xs" : "hover:text-slate-900")}
            >
              <Settings className="w-3 h-3" />
              Channels
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'settings' ? (
              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-xs text-blue-900 leading-relaxed">
                  Configure real-time notification dispatch channels. Updates, job assignments, and receipts are forwarded to your preferred destinations.
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Verified Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={prefPhone} 
                      onChange={e => setPrefPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md outline-none focus:border-blue-700"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Alert Channels</h4>
                  
                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">WhatsApp Dispatch</div>
                        <div className="text-xs text-slate-500">Instant job alerts, ETA tracking and invoice PDFs</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={prefWhatsApp} 
                      onChange={e => setPrefWhatsApp(e.target.checked)} 
                      className="w-4 h-4 accent-blue-900 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">In-App Alerts</div>
                        <div className="text-xs text-slate-500">Live dashboard audio-visual alerts</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={prefInApp} 
                      onChange={e => setPrefInApp(e.target.checked)} 
                      className="w-4 h-4 accent-blue-900 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">SMS Notifications</div>
                        <div className="text-xs text-slate-500">Direct telecom SMS for OTPs and status changes</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={prefSMS} 
                      onChange={e => setPrefSMS(e.target.checked)} 
                      className="w-4 h-4 accent-blue-900 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">IVR / Automated Voice Call</div>
                        <div className="text-xs text-slate-500">Automated phone calls in regional languages for critical updates</div>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={prefIVR} 
                      onChange={e => setPrefIVR(e.target.checked)} 
                      className="w-4 h-4 accent-blue-900 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full bg-blue-900 text-white hover:bg-blue-800">
                    Save Channel Preferences
                  </Button>
                  {saveSuccess && (
                    <p className="text-xs text-emerald-700 text-center font-medium mt-2">
                      ✓ Preferences updated successfully!
                    </p>
                  )}
                </div>
              </form>
            ) : activeTab === 'whatsapp' ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900">
                  <span className="font-semibold block mb-1">WhatsApp Business Sandbox Active</span>
                  Official WhatsApp template transmissions for booking confirmations and digital receipts.
                </div>

                {(whatsAppLogs || []).map(log => (
                  <div key={log.id} className="p-3 border border-slate-200 rounded-lg bg-white shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" /> {log.phone}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{log.message}</p>
                    <div className="text-[10px] text-slate-400 text-right">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
              </div>
            ) : (filteredList || []).length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Bell className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-sm">No notifications found.</p>
              </div>
            ) : (
              (filteredList || []).map(n => (
                <div 
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer relative flex gap-3 items-start",
                    n.read 
                      ? "bg-white border-slate-200 text-slate-700" 
                      : "bg-blue-50/70 border-blue-200 text-slate-900 shadow-xs"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-700 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>SHRAMSETU Public Alert Infrastructure</span>
            <button 
              type="button"
              onClick={() => setActiveTab('settings')}
              className="text-blue-900 hover:underline font-medium"
            >
              Configure channels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
