import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { WorkerProfile } from '../../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Mic, MicOff, Phone, Volume2, Sparkles, MessageSquare, 
  MapPin, Clock, DollarSign, CheckCircle2, ChevronRight, RotateCcw 
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface VoiceQueryOption {
  lang: 'hi' | 'mr' | 'en';
  queryText: string;
  responseText: string;
  tag: string;
}

export function VoiceSaathi() {
  const { currentUser, jobs = [], users = [] } = useStore();
  const worker = (currentUser?.role === 'worker' ? currentUser : users.find(u => u.role === 'worker')) as WorkerProfile;
  const safeJobs = jobs || [];

  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'mr' | 'en'>('hi');
  const [isListening, setIsListening] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // IVR Dial Simulator State
  const [showIvrModal, setShowIvrModal] = useState(false);
  const [dialNumber, setDialNumber] = useState('1800-555-7472');
  const [ivrStep, setIvrStep] = useState<'calling' | 'connected' | 'ended'>('calling');
  const [ivrAudioText, setIvrAudioText] = useState('श्रमसेतु किसान एवं कामगार साथी सेवा में आपका स्वागत है। हिंदी के लिए 1 दबाएं, मराठी साठी 2 दाबा...');

  const activeJob = safeJobs.find(j => j.workerId === worker?.id && ['accepted', 'on_the_way', 'arrived', 'started'].includes(j.status));

  const sampleQueries: VoiceQueryOption[] = [
    {
      lang: 'hi',
      queryText: 'मेरा अगला काम कहाँ है और कितने बजे है?',
      responseText: activeJob 
        ? `नमस्ते ${worker?.name || 'साथी'}! आपका अगला काम ${activeJob.service} है, जो ${activeJob.address} (${activeJob.locality}) में है। यह ग्राहक द्वारा आज के लिए निर्धारित है।`
        : `नमस्ते ${worker?.name || 'साथी'}! वर्तमान में आपके पास कोई सक्रिय काम नहीं है। आप उपलब्ध सूची से नया काम स्वीकार कर सकते हैं।`,
      tag: 'Next Job Location'
    },
    {
      lang: 'hi',
      queryText: 'मेरी आज की और इस महीने की कुल कमाई कितनी है?',
      responseText: `आपकी अब तक की कुल सीधी कमाई ${formatCurrency(worker?.earnings || 0)} है। इसमें कोई भी कमीशन नहीं काटा गया है।`,
      tag: 'Earnings Check'
    },
    {
      lang: 'hi',
      queryText: 'ग्राहक का पता और फोन नंबर क्या है?',
      responseText: activeJob 
        ? `ग्राहक का पता ${activeJob.address} है। आप सीधे एप्लिकेशन में कॉल बटन दबाकर सुरक्षित रूप से बात कर सकते हैं।`
        : `आपके पास अभी कोई असाइन किया गया ग्राहक नहीं है।`,
      tag: 'Customer Contact'
    },
    {
      lang: 'mr',
      queryText: 'माझे पुढील काम कुठे आहे आणि किती वाजता आहे?',
      responseText: activeJob 
        ? `नमस्कार ${worker?.name || 'भाऊ'}! तुमचे पुढील काम ${activeJob.service} चे असून ते ${activeJob.address} (${activeJob.locality}) येथे आहे.`
        : `नमस्कार! सध्या तुमच्याकडे कोणतेही सक्रिय काम नाही. कृपया नवीन कामांची यादी तपासा.`,
      tag: 'पुढील काम'
    },
    {
      lang: 'mr',
      queryText: 'या महिन्याची माझी एकूण कमाई किती झाली?',
      responseText: `तुमची एकूण थेट कमाई ${formatCurrency(worker?.earnings || 0)} इतकी आहे. कोणतीही दलाली किंवा कमिशन कापलेले नाही.`,
      tag: 'कमाई चौकशी'
    },
    {
      lang: 'en',
      queryText: 'Where is my next job and customer address?',
      responseText: activeJob 
        ? `Hello ${worker?.name}! Your assigned job is ${activeJob.service} located at ${activeJob.address}, ${activeJob.locality}.`
        : `Hello! You currently have zero active assignments in queue.`,
      tag: 'Next Assignment'
    },
    {
      lang: 'en',
      queryText: 'What are my total direct earnings with zero commission?',
      responseText: `Your total direct cooperative earnings stand at ${formatCurrency(worker?.earnings || 0)}. 100% credited to your bank.`,
      tag: 'Earnings Balance'
    }
  ];

  const handleSimulateSpeech = (query: VoiceQueryOption) => {
    setIsListening(true);
    setCurrentQuery(query.queryText);
    setCurrentResponse('');

    setTimeout(() => {
      setIsListening(false);
      setCurrentResponse(query.responseText);
      speakText(query.responseText);
    }, 1000);
  };

  const handleMicToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setCurrentQuery(selectedLanguage === 'hi' ? 'मेरा अगला काम कहाँ है?' : selectedLanguage === 'mr' ? 'माझे पुढील काम कुठे आहे?' : 'Where is my next job?');
    
    setTimeout(() => {
      setIsListening(false);
      const matched = sampleQueries.find(q => q.lang === selectedLanguage);
      if (matched) {
        setCurrentResponse(matched.responseText);
        speakText(matched.responseText);
      }
    }, 1500);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startIvrCall = () => {
    setShowIvrModal(true);
    setIvrStep('calling');
    setTimeout(() => {
      setIvrStep('connected');
      setIvrAudioText('श्रमसेतु किसान एवं कामगार साथी सेवा में आपका स्वागत है। हिंदी के लिए 1 दबाएं, मराठी साठी 2 दाबा...');
    }, 1500);
  };

  const handleIvrDigit = (digit: string) => {
    if (digit === '1') {
      setIvrAudioText(activeJob 
        ? `आपका अगला काम ${activeJob.service} है, जो ${activeJob.address} में है। कमाई ₹${activeJob.price} है। मुख्य मेनू के लिए 0 दबाएं।`
        : `आपके पास अभी कोई सक्रिय काम नहीं है। आपकी कुल कमाई ₹${worker?.earnings || 0} है।`
      );
    } else if (digit === '2') {
      setIvrAudioText(activeJob 
        ? `तुमचे पुढील काम ${activeJob.service} चे असून पत्ता ${activeJob.address} आहे. रक्कम ₹${activeJob.price} आहे.`
        : `सध्या कोणतेही काम सुरू नाही. तुमची एकूण कमाई ₹${worker?.earnings || 0} आहे.`
      );
    } else if (digit === '9') {
      setIvrAudioText('आपकी कॉल सहकार वेलफेयर डेस्क अधिकारी को स्थानांतरित की जा रही है, कृपया प्रतीक्षा करें...');
    } else {
      setIvrAudioText('कृपया सही विकल्प चुनें: अगला काम जानने के लिए 1 दबाएं, वेलफेयर सहायता के लिए 9 दबाएं...');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Voice Saathi & Multilingual IVR</h1>
          <p className="text-slate-500 text-sm">बोलकर या साधारण फोन कॉल (IVR) से काम का पता, समय और कमाई की जानकारी प्राप्त करें।</p>
        </div>
        <Button 
          onClick={startIvrCall}
          className="bg-teal-700 hover:bg-teal-800 text-white gap-2 text-xs font-bold"
        >
          <Phone className="w-4 h-4" /> Simulate Toll-Free IVR Call (1800-555-SHRAM)
        </Button>
      </div>

      {/* Language Selector Chips */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Select Voice Language:</span>
        <div className="flex gap-2">
          {[
            { key: 'hi', label: 'हिंदी (Hindi)' },
            { key: 'mr', label: 'मराठी (Marathi)' },
            { key: 'en', label: 'English' }
          ].map(l => (
            <button
              key={l.key}
              onClick={() => setSelectedLanguage(l.key as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                selectedLanguage === l.key 
                  ? 'bg-blue-900 text-white shadow-xs' 
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Voice Microphone Stage */}
      <Card className="border-blue-200 shadow-md bg-gradient-to-b from-blue-50/70 to-white overflow-hidden text-center p-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={handleMicToggle}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-lg mx-auto ${
                isListening 
                  ? 'bg-red-600 text-white ring-8 ring-red-300 animate-pulse' 
                  : isPlayingAudio
                  ? 'bg-teal-600 text-white ring-8 ring-teal-200 animate-bounce'
                  : 'bg-blue-900 text-white hover:bg-blue-800 hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </button>
            {isPlayingAudio && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-md">
                <Volume2 className="w-4 h-4 animate-spin" />
              </span>
            )}
          </div>

          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {isListening ? 'सुन रहा हूँ... बोलिए (Listening...)' : 'माइक दबाकर बोलें (Tap Mic to Speak)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports voice queries without typing. Works even for low-literacy tradespersons.
            </p>
          </div>

          {/* Active Query & Response Display */}
          {(currentQuery || currentResponse) && (
            <div className="text-left space-y-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              {currentQuery && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">Aapka Sawal (Your Question):</span>
                  <p className="text-xs font-semibold text-slate-800 italic bg-slate-50 p-2 rounded">
                    "{currentQuery}"
                  </p>
                </div>
              )}

              {currentResponse && (
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Saathi ka Jawab (Answer):
                  </span>
                  <p className="text-xs text-slate-900 font-medium bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                    {currentResponse}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => speakText(currentResponse)}
                    className="text-[11px] h-7 gap-1 mt-1 border-emerald-300 text-emerald-900"
                  >
                    <Volume2 className="w-3 h-3" /> Replay Audio
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Suggested Quick Audio Prompts */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Suggested Common Questions (Click to Ask Immediately)</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(sampleQueries || [])
            .filter(q => q.lang === selectedLanguage)
            .map((q, idx) => (
              <div 
                key={idx}
                onClick={() => handleSimulateSpeech(q)}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-xs transition-all cursor-pointer space-y-2 text-left"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                  <span>{q.tag}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-slate-700 font-medium">"{q.queryText}"</p>
              </div>
            ))}
        </div>
      </div>

      {/* Toll-Free IVR Interactive Simulator Modal */}
      {showIvrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-teal-800">Toll-Free Labor IVR Helpline</span>
              <button onClick={() => setShowIvrModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <span className="text-lg font-mono font-bold text-slate-900">{dialNumber}</span>
              <span className={`block text-xs font-bold ${ivrStep === 'calling' ? 'text-amber-600' : 'text-emerald-700'}`}>
                {ivrStep === 'calling' ? '● Dialing toll-free...' : '● Call Connected (Audio Streaming)'}
              </span>
            </div>

            {/* Audio Transcript on Phone Screen */}
            <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl min-h-[90px] flex items-center justify-center text-center">
              "{ivrAudioText}"
            </div>

            {/* Simulated Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                <button
                  key={key}
                  onClick={() => handleIvrDigit(key)}
                  className="w-14 h-12 bg-slate-100 hover:bg-slate-200 active:bg-blue-900 active:text-white rounded-lg font-bold text-sm text-slate-800 transition-colors shadow-2xs"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <Button 
                variant="destructive" 
                className="w-full h-10 text-xs font-bold"
                onClick={() => setShowIvrModal(false)}
              >
                End IVR Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
