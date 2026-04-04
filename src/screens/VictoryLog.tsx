import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { format, startOfWeek } from 'date-fns';
import { Trophy, Save, History, Check, ShieldOff, Target, Zap, Compass, Info, Calendar, PenLine, Sparkles, X, ChevronRight, HelpCircle } from 'lucide-react';
import { VictoryLogEntry } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const FIELDS: { id: keyof VictoryLogEntry; label: string; placeholder: string; icon: any; color: string; desc: string; prompt: string }[] = [
  { 
    id: 'surrender', 
    label: 'Surrender', 
    placeholder: 'What did you release to God this week?', 
    icon: ShieldOff, 
    color: 'text-orange-500',
    desc: 'Letting go of control and trusting His plan.',
    prompt: 'Think about a situation where you tried to force an outcome. How can you release that to Him today?'
  },
  { 
    id: 'focus', 
    label: 'Focus', 
    placeholder: 'Where was your attention fixed?', 
    icon: Target, 
    color: 'text-blue-500',
    desc: 'Keeping your eyes on the prize of the high calling.',
    prompt: 'What was the single most important spiritual priority for you this week? Did you stay aligned with it?'
  },
  { 
    id: 'discipline', 
    label: 'Discipline', 
    placeholder: 'How did you master your impulses?', 
    icon: Zap, 
    color: 'text-amber-500',
    desc: 'Small wins that build spiritual muscle.',
    prompt: 'Identify a moment where you chose discipline over comfort. How did that impact your spirit?'
  },
  { 
    id: 'alignment', 
    label: 'Alignment', 
    placeholder: 'How did your actions match your words?', 
    icon: Compass, 
    color: 'text-indigo-500',
    desc: 'Walking the narrow path with integrity.',
    prompt: 'Were there any moments where your actions didn\'t reflect your faith? How can you realign for next week?'
  },
  { 
    id: 'victory', 
    label: 'Victory', 
    placeholder: 'What was your greatest breakthrough?', 
    icon: Trophy, 
    color: 'text-forest',
    desc: 'Celebrating what God has done in and through you.',
    prompt: 'What is one thing you did this week that you couldn\'t have done a month ago? Give thanks for that growth.'
  },
];

const VictoryLog = () => {
  const { state, updateVictoryLog } = useApp();
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const weekId = format(monday, 'yyyy-\'W\'ww');
  
  const log = state.victoryLogs[weekId] || {
    surrender: '',
    focus: '',
    discipline: '',
    alignment: '',
    victory: '',
  };

  const [localLog, setLocalLog] = useState(log);
  const [isSaved, setIsSaved] = useState(true);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showPrompt, setShowPrompt] = useState<string | null>(null);
  const [autoSave, setAutoSave] = useState(false);
  const [showSealed, setShowSealed] = useState(false);
  const sealedTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalLog(log);
    setIsSaved(true);
  }, [weekId]);

  const handleSave = useCallback(() => {
    updateVictoryLog(weekId, localLog);
    setIsSaved(true);
    
    // Show "All Victories Sealed" notification for 1.5 seconds
    setShowSealed(true);
    if (sealedTimeoutRef.current) clearTimeout(sealedTimeoutRef.current);
    sealedTimeoutRef.current = setTimeout(() => {
      setShowSealed(false);
    }, 1500);

    const currentFilledCount = FIELDS.filter(f => {
      const val = localLog[f.id];
      return typeof val === 'string' && val.trim().length > 0;
    }).length;

    if (currentFilledCount === FIELDS.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0A192F', '#5A5A40', '#E6E6E6']
      });
    }
  }, [weekId, localLog, updateVictoryLog]);

  useEffect(() => {
    if (autoSave && !isSaved) {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave();
      }, 1000);
    }
    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [localLog, autoSave, isSaved, handleSave]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (!isSaved) {
        updateVictoryLog(weekId, localLog);
      }
    };
  }, [isSaved, localLog, updateVictoryLog, weekId]);

  const handleChange = (field: string, value: string) => {
    setLocalLog(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const filledCount = FIELDS.filter(f => {
    const val = localLog[f.id];
    return typeof val === 'string' && val.trim().length > 0;
  }).length;
  const progress = (filledCount / FIELDS.length) * 100;

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-12 pb-48">
      <header className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-navy tracking-tighter leading-none">Victory Log</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-ink/40 font-mono text-[10px] uppercase tracking-widest">
              <Calendar size={12} />
              <span>Week of {format(monday, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Auto-Save</span>
              <button 
                onClick={() => setAutoSave(!autoSave)}
                className={cn(
                  "w-8 h-4 rounded-full transition-colors relative",
                  autoSave ? "bg-forest" : "bg-border"
                )}
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform",
                  autoSave && "translate-x-4"
                )} />
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowHistory(true)}
          className="p-3 bg-white border border-border rounded-2xl text-navy/40 hover:text-navy transition-all hover:shadow-md active:scale-95"
        >
          <History size={20} />
        </button>
      </header>

      {/* Bento Progress Card */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 card bg-navy text-cream p-6 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40 mb-1">Weekly Completion</p>
            <h2 className="text-4xl font-black tracking-tighter">{Math.round(progress)}%</h2>
          </div>
          <div className="relative z-10 space-y-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-forest shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-[10px] text-cream/40 font-mono">
              {filledCount} of {FIELDS.length} modules completed
            </p>
          </div>
        </div>
        
        <div className="card bg-white border-2 border-navy/5 p-4 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
            <Sparkles size={20} />
          </div>
          <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Status</p>
          <span className="text-xs font-black text-navy">
            {progress === 100 ? 'VICTORIOUS' : progress > 50 ? 'ADVANCING' : 'STARTING'}
          </span>
        </div>
      </div>

      <div className="space-y-16">
        {FIELDS.map((field, index) => (
          <motion.section 
            key={field.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl bg-white border-2 transition-all duration-300",
                  activeField === field.id ? "border-navy shadow-lg -translate-y-1" : "border-border shadow-sm",
                  field.color
                )}>
                  <field.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-navy tracking-tight leading-none mb-1">{field.label}</h3>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-[0.15em]">{field.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {localLog[field.id].trim().length > 0 && (
                  <div className="px-2 py-1 bg-forest/10 text-forest rounded-lg text-[10px] font-black tracking-tighter flex items-center gap-1">
                    <Check size={12} />
                    {getWordCount(localLog[field.id])} WORDS
                  </div>
                )}
                <button 
                  onClick={() => setShowPrompt(showPrompt === field.id ? null : field.id)}
                  className="p-2 text-ink/20 hover:text-navy transition-colors"
                >
                  <HelpCircle size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showPrompt === field.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="p-4 bg-navy/5 rounded-xl border-l-4 border-navy text-sm text-navy/70 italic">
                    {field.prompt}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              "relative transition-all duration-500",
              activeField === field.id ? "scale-[1.01]" : "scale-100"
            )}>
              <textarea
                value={(localLog[field.id] as string) || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onFocus={() => setActiveField(field.id)}
                onBlur={() => setActiveField(null)}
                placeholder={field.placeholder}
                className={cn(
                  "input-field min-h-[160px] bg-white text-lg leading-relaxed p-6 transition-all border-2",
                  activeField === field.id ? "border-navy shadow-2xl ring-4 ring-navy/5" : "border-transparent shadow-sm"
                )}
              />
              <div className={cn(
                "absolute bottom-4 right-4 transition-opacity duration-300",
                activeField === field.id ? "opacity-10" : "opacity-5"
              )}>
                <PenLine size={24} />
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* History Modal Placeholder */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-cream rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setShowHistory(false)} className="p-2 text-ink/20 hover:text-navy transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-navy leading-none">Log History</h2>
                  <p className="text-sm text-ink/60">Your previous weekly victories.</p>
                </div>
                
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {Object.keys(state.victoryLogs).length > 0 ? (
                    Object.keys(state.victoryLogs).sort().reverse().map((id) => (
                      <div key={id} className="card p-4 flex items-center justify-between group hover:bg-navy/5 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-navy">{id}</h4>
                            <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Completed</p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-ink/20 group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy/20">
                        <History size={32} />
                      </div>
                      <p className="text-sm text-ink/40 italic">No previous logs found yet.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setShowHistory(false)}
                  className="btn-primary w-full py-4 bg-navy text-cream"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-24 left-0 right-0 px-6 z-50 pointer-events-none">
        <div className="max-w-md mx-auto flex justify-center">
          <AnimatePresence mode="wait">
            {showSealed ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="pointer-events-auto bg-forest text-white py-3 px-8 rounded-full font-black flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(34,197,94,0.3)] border border-white/20 backdrop-blur-md"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check size={14} strokeWidth={4} />
                </div>
                <span className="tracking-tight">ALL VICTORIES SEALED</span>
              </motion.div>
            ) : !isSaved && !autoSave ? (
              <motion.button 
                key="save"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={handleSave}
                className="pointer-events-auto w-full bg-navy text-cream py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(10,25,47,0.3)] border border-white/5 active:scale-[0.98] transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-forest/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Save size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10 tracking-tight">SAVE WEEKLY VICTORY LOG</span>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VictoryLog;
