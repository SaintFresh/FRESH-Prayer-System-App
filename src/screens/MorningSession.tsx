import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { format, isSameDay, parseISO } from 'date-fns';
import { WEEK_CONFIG } from '../config';
import { ChevronLeft, ChevronRight, Check, BookOpen, PenLine, Heart, Timer, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useParams } from 'react-router-dom';

const MorningSession = () => {
  const navigate = useNavigate();
  const { date: dateParam } = useParams();
  const { state, updateDayState, updateJournal } = useApp();
  
  const today = new Date();
  const activeDate = dateParam ? parseISO(dateParam) : today;
  const dateKey = format(activeDate, 'yyyy-MM-dd');
  const isToday = isSameDay(activeDate, today);
  
  const dayOfWeek = activeDate.getDay() === 0 ? 7 : activeDate.getDay();
  const config = WEEK_CONFIG[dayOfWeek - 1];

  const dayState = state.days[dateKey] || {
    morning: { 
      phases: dayOfWeek === 6 ? [
        { id: 'ritual', completed: false },
        { id: 'recite', completed: false },
        { id: 'pray', completed: false },
        { id: 'aloud', completed: false },
        { id: 'rest', completed: false },
      ] : [
        { id: 'read', completed: false },
        { id: 'reflect', completed: false },
        { id: 'pray', completed: false },
        { id: 'rest', completed: false },
      ], 
      completed: false, 
      currentStep: 0 
    },
    midday: { completed: false },
    evening: { completed: false }
  };

  const [step, setStep] = useState(dayState.morning.currentStep || 0);
  const [notes, setNotes] = useState(state.journals[dateKey]?.morningNotes || '');
  const [showVerse, setShowVerse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
    setShowVerse(false);
  }, [step]);

  const saveNotes = (val: string) => {
    updateJournal(dateKey, { morningNotes: val });
  };

  const phases = dayOfWeek === 6 ? [
    { id: 'ritual', title: 'Opening Ritual', icon: BookOpen, desc: 'Read all five verses back-to-back.' },
    { id: 'recite', title: 'Recitation Challenge', icon: BookOpen, desc: 'Recite all five verses from memory.' },
    { id: 'pray', title: 'The Unified Prayer', icon: PenLine, desc: 'Write your own prayer using the verses.' },
    { id: 'aloud', title: 'Read Aloud', icon: Heart, desc: 'Pray your prayer back to God verbatim.' },
    { id: 'rest', title: 'Rest & Listen', icon: Timer, desc: config.morningSession.phase4.instruction },
  ] : [
    { id: 'read', title: 'Read & Meditate', icon: BookOpen, desc: config.morningSession.phase1.instruction },
    { id: 'reflect', title: 'Reflect & Journal', icon: PenLine, desc: 'What is God saying to you today?' },
    { id: 'pray', title: 'Pray (ACTS)', icon: Heart, desc: 'Adoration, Confession, Thanksgiving, Supplication.' },
    { id: 'rest', title: 'Rest & Listen', icon: Timer, desc: config.morningSession.phase4.instruction },
  ];

  const totalSteps = phases.length;
  const currentPhase = dayState.morning.phases[step] || { id: phases[step].id, completed: false };

  const toggleComplete = () => {
    if (!isToday) return;
    const newPhases = [...dayState.morning.phases];
    newPhases[step] = { ...newPhases[step], completed: !newPhases[step].completed, completedAt: new Date().toISOString() };
    updateDayState(dateKey, { morning: { ...dayState.morning, phases: newPhases } });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (isToday) {
        updateDayState(dateKey, { morning: { ...dayState.morning, currentStep: nextStep } });
      }
    } else {
      if (isToday) {
        saveNotes(notes);
        updateDayState(dateKey, { morning: { ...dayState.morning, currentStep: 0 } }); // Reset step on finish
      }
      navigate(isToday ? '/today' : `/today/${dateKey}`);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      if (isToday) {
        updateDayState(dateKey, { morning: { ...dayState.morning, currentStep: prevStep } });
      }
    } else navigate(isToday ? '/today' : `/today/${dateKey}`);
  };

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      <header className="p-4 flex items-center justify-between border-b border-border bg-white">
        <button onClick={handleBack} className="p-2 -ml-2 text-navy">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-lg">{dayOfWeek === 6 ? 'Synthesis Session' : 'Morning Session'}</h1>
          <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Step {step + 1} of {totalSteps}</p>
        </div>
        <div className="w-10" />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-navy/5 rounded-2xl flex items-center justify-center text-navy">
            {React.createElement(phases[step].icon, { size: 32 })}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl">{phases[step].title}</h2>
            <p className="text-ink/60 text-sm leading-relaxed">{phases[step].desc}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {dayOfWeek === 6 ? (
              // Saturday Synthesis Session
              <div className="space-y-6">
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="card bg-navy text-cream p-6 space-y-4">
                      <p className="text-sm font-bold text-cream/60">The Thread of Victory</p>
                      <p className="text-lg leading-relaxed italic">"Lord, what is the thread You wove through my week?"</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-border">
                      <p className="text-sm font-medium text-ink/60 mb-2">Instruction:</p>
                      <p className="text-ink font-semibold">{config.morningSession.phase1.instruction}</p>
                    </div>

                    <button 
                      onClick={() => setShowVerse(!showVerse)}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-navy/5 text-navy border-2 border-navy/10 transition-all active:scale-95"
                    >
                      <BookOpen size={20} />
                      {showVerse ? 'Hide Verses' : 'Read Verses'}
                    </button>

                    <AnimatePresence>
                      {showVerse && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="card bg-navy text-cream p-6 space-y-4 mt-2">
                            <p className="text-lg leading-relaxed italic">
                              "{WEEK_CONFIG.slice(0, 5).map(day => day.verseText).join(' ')}"
                            </p>
                            <p className="text-sm font-bold text-cream/60">— The Weekly Passage</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={32} className="text-navy" />
                    </div>
                    <h3 className="text-xl font-bold">Recitation Challenge</h3>
                    <p className="text-ink/60">Attempt to recite all five verses from memory without looking.</p>
                    <div className="p-4 bg-white rounded-xl border border-border text-sm italic">
                      "I do not dare to classify or compare... I forget what lies behind... I do not run aimlessly... If God be for us... In all these things..."
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-4 border border-border">
                      <p className="text-sm font-medium text-ink/60 mb-2">The Unified Prayer:</p>
                      <p className="text-ink font-semibold">Write your own prayer using all five verses as the backbone.</p>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onBlur={(e) => isToday && saveNotes(e.target.value)}
                      readOnly={!isToday}
                      placeholder="Write your unified prayer here..."
                      className="input-field min-h-[200px] bg-white"
                    />
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="card bg-navy text-cream p-8 text-center space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-cream/60">Weekly Covenant Ceremony</h4>
                      <p className="text-xl italic leading-relaxed">"Read your prayer aloud verbatim to God."</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-border">
                      <p className="text-ink/80 whitespace-pre-wrap italic">{notes || "No prayer written yet."}</p>
                    </div>
                  </div>
                )}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="card p-8 flex flex-col items-center justify-center text-center gap-6">
                      <div className="w-24 h-24 rounded-full border-4 border-navy/10 flex items-center justify-center relative">
                        <Timer size={40} className="text-navy/20" />
                        <div className="absolute inset-0 border-4 border-navy rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <p className="text-ink/70">{config.morningSession.phase4.instruction}</p>
                    </div>
                    <div className="card bg-navy text-cream p-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-cream/60">Morning Declaration</h4>
                      <p className="text-lg italic leading-relaxed">"{config.declarations.morning}"</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Standard Morning Session (Mon-Fri, Sun)
              <div className="space-y-6">
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-4 border border-border">
                      <p className="text-sm font-medium text-ink/60 mb-2">Instruction:</p>
                      <p className="text-ink font-semibold">{config.morningSession.phase1.instruction}</p>
                    </div>

                    <button 
                      onClick={() => setShowVerse(!showVerse)}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-navy/5 text-navy border-2 border-navy/10 transition-all active:scale-95"
                    >
                      <BookOpen size={20} />
                      {showVerse ? 'Hide Verse' : 'Read Verse'}
                    </button>

                    <AnimatePresence>
                      {showVerse && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="card bg-navy text-cream p-6 space-y-4 mt-2">
                            <p className="text-lg leading-relaxed italic">"{config.verseText}"</p>
                            <p className="text-sm font-bold text-cream/60">— {config.verseRef}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="bg-white rounded-2xl p-4 border border-border">
                      <p className="text-sm font-medium text-ink/60 mb-2">Meditation Question:</p>
                      <p className="text-ink font-semibold">{config.morningSession.phase1.question}</p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-4 border border-border">
                      <p className="text-sm font-medium text-ink/60 mb-2">{dayOfWeek === 7 ? 'Sabbath Practices:' : 'Prompts:'}</p>
                      <ul className="text-sm space-y-3 list-disc pl-4 text-ink/80">
                        {config.morningSession.phase2.prompts.map((prompt, i) => (
                          <li key={i}>{prompt}</li>
                        ))}
                      </ul>
                    </div>
                    {dayOfWeek !== 7 && (
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onBlur={(e) => isToday && saveNotes(e.target.value)}
                        readOnly={!isToday}
                        placeholder={isToday ? "Write your reflections here..." : "No reflections recorded for this day."}
                        className={cn(
                          "input-field min-h-[150px] bg-white",
                          !isToday && "opacity-60 cursor-not-allowed"
                        )}
                      />
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    {[
                      { id: 'Adoration', text: config.morningSession.phase3.acts.adoration },
                      { id: 'Confession', text: config.morningSession.phase3.acts.confession },
                      { id: 'Thanksgiving', text: config.morningSession.phase3.acts.thanksgiving },
                      { id: 'Supplication', text: config.morningSession.phase3.acts.supplication },
                    ].map((part) => (
                      <div key={part.id} className="card p-4 space-y-2">
                        <h4 className="font-bold text-navy">{part.id}</h4>
                        <p className="text-sm text-ink/70 leading-relaxed italic">"{part.text}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="card p-8 flex flex-col items-center justify-center text-center gap-6">
                      <div className="w-24 h-24 rounded-full border-4 border-navy/10 flex items-center justify-center relative">
                        <Timer size={40} className="text-navy/20" />
                        <div className="absolute inset-0 border-4 border-navy rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <p className="text-ink/70">{config.morningSession.phase4.instruction}</p>
                    </div>
                    <div className="card bg-navy text-cream p-6 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-cream/60">Morning Declaration</h4>
                      <p className="text-lg italic leading-relaxed">"{config.declarations.morning}"</p>
                      <p className="text-xs text-cream/40">Speak this aloud to seal your morning session.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="p-6 bg-white border-t border-border space-y-4">
        {!isToday && (
          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 rounded-lg text-xs font-bold uppercase tracking-widest mb-2">
            <Lock size={14} />
            Read Only Mode
          </div>
        )}
        <button 
          onClick={toggleComplete}
          disabled={!isToday}
          className={cn(
            "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
            currentPhase.completed 
              ? "bg-forest text-white" 
              : "bg-navy/5 text-navy border-2 border-navy/10",
            !isToday && "opacity-50 cursor-not-allowed"
          )}
        >
          {currentPhase.completed ? <Check size={20} /> : null}
          {currentPhase.completed ? 'Step Completed' : 'Mark Step Complete'}
        </button>
        
        <button 
          onClick={handleNext}
          disabled={isToday && !currentPhase.completed}
          className="btn-primary w-full py-4"
        >
          {step === totalSteps - 1 ? 'Finish Session' : 'Next Step'}
        </button>
      </footer>
    </div>
  );
};

export default MorningSession;
