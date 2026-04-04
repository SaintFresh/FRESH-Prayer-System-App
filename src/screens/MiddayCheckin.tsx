import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { format, isSameDay, parseISO } from 'date-fns';
import { WEEK_CONFIG } from '../config';
import { ChevronLeft, Check, Target, MessageSquare, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useParams } from 'react-router-dom';

const MiddayCheckin = () => {
  const navigate = useNavigate();
  const { date: dateParam } = useParams();
  const { state, updateDayState, updateJournal } = useApp();
  
  const today = new Date();
  const activeDate = dateParam ? parseISO(dateParam) : today;
  const dateKey = format(activeDate, 'yyyy-MM-dd');
  const isToday = isSameDay(activeDate, today);
  
  const dayOfWeek = activeDate.getDay() === 0 ? 7 : activeDate.getDay();
  const config = WEEK_CONFIG[dayOfWeek - 1];

  const [response, setResponse] = useState<'pressing' | 'mixed' | 'drifting' | undefined>(state.days[dateKey]?.midday?.response);
  const [note, setNote] = useState(state.journals[dateKey]?.middayNotes || '');

  const handleFinish = () => {
    if (!isToday) {
      navigate(isToday ? '/today' : `/today/${dateKey}`);
      return;
    }
    updateDayState(dateKey, { 
      midday: { 
        completed: true, 
        response
      } 
    });
    updateJournal(dateKey, {
      middayNotes: note
    });
    navigate('/today');
  };

  return (
    <div className="h-screen flex flex-col bg-cream">
      <header className="p-4 flex items-center justify-between border-b border-border bg-white">
        <button onClick={() => navigate(isToday ? '/today' : `/today/${dateKey}`)} className="p-2 -ml-2 text-navy">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg">Midday Check-In</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy mx-auto">
            <Target size={24} />
          </div>
          <h2 className="text-xl">Midday Check-In</h2>
          <p className="text-ink/60 text-sm italic">"{config.keyPhrase}"</p>
        </div>

        <section className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-border space-y-4">
            <p className="text-sm font-medium text-ink/60 uppercase tracking-widest">Alignment Question:</p>
            <p className="text-xl font-semibold text-navy leading-tight">
              {config.middayCheckin.question}
            </p>
          </div>

          <div className="card bg-forest text-cream p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cream/60">Midday Prayer</h4>
            <p className="text-lg italic leading-relaxed">
              "{config.middayCheckin.prayer}"
            </p>
          </div>

          <h3 className="text-sm font-bold text-ink/40 uppercase tracking-widest">How are you doing?</h3>
          <div className="grid gap-3">
            {[
              { id: 'pressing', label: 'Pressing On', color: 'bg-forest' },
              { id: 'mixed', label: 'Mixed', color: 'bg-brown' },
              { id: 'drifting', label: 'Drifting Back', color: 'bg-navy' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => isToday && setResponse(opt.id as any)}
                disabled={!isToday}
                className={cn(
                  "card p-4 flex items-center justify-between transition-all",
                  response === opt.id ? "border-navy bg-navy/5 ring-2 ring-navy/10" : "opacity-60",
                  !isToday && response !== opt.id && "grayscale opacity-30"
                )}
              >
                <span className="font-semibold">{opt.label}</span>
                {response === opt.id && <Check size={20} className="text-navy" />}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-ink/40">
            <MessageSquare size={16} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Quick Note</h3>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            readOnly={!isToday}
            placeholder={isToday ? "A one-sentence reflection..." : "No notes recorded for this day."}
            className={cn(
              "input-field min-h-[100px] bg-white",
              !isToday && "opacity-60 cursor-not-allowed"
            )}
          />
        </section>
      </div>

      <footer className="p-6 bg-white border-t border-border">
        {!isToday && (
          <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 py-2 rounded-lg text-xs font-bold uppercase tracking-widest mb-4">
            <Lock size={14} />
            Read Only Mode
          </div>
        )}
        <button 
          onClick={handleFinish}
          disabled={isToday && !response}
          className="btn-primary w-full py-4"
        >
          {isToday ? 'Check-In Complete' : 'Back to Dashboard'}
        </button>
      </footer>
    </div>
  );
};

export default MiddayCheckin;
