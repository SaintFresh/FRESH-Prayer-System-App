import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { format, isSameDay, parseISO } from 'date-fns';
import { WEEK_CONFIG } from '../config';
import { ChevronLeft, Moon, MessageSquare, Star, Sparkles, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useParams } from 'react-router-dom';

const EveningReflection = () => {
  const navigate = useNavigate();
  const { date: dateParam } = useParams();
  const { state, updateDayState, updateJournal } = useApp();
  
  const today = new Date();
  const activeDate = dateParam ? parseISO(dateParam) : today;
  const dateKey = format(activeDate, 'yyyy-MM-dd');
  const isToday = isSameDay(activeDate, today);
  
  const dayOfWeek = activeDate.getDay() === 0 ? 7 : activeDate.getDay();
  const config = WEEK_CONFIG[dayOfWeek - 1];

  const [note, setNote] = useState(state.journals[dateKey]?.eveningNotes || '');
  const [rating, setRating] = useState(state.days[dateKey]?.dayRating || 0);
  const [declared, setDeclared] = useState(false);

  const handleFinish = () => {
    if (!isToday) {
      navigate(isToday ? '/today' : `/today/${dateKey}`);
      return;
    }
    updateDayState(dateKey, { 
      evening: { 
        completed: true
      },
      dayRating: rating
    });
    updateJournal(dateKey, {
      eveningNotes: note,
      dayRating: rating
    });
    navigate('/today');
  };

  return (
    <div className="h-screen flex flex-col bg-cream">
      <header className="p-4 flex items-center justify-between border-b border-border bg-white">
        <button onClick={() => navigate(isToday ? '/today' : `/today/${dateKey}`)} className="p-2 -ml-2 text-navy">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg">Evening Reflection</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy mx-auto">
            <Moon size={24} />
          </div>
          <h2 className="text-xl">Evening Reflection</h2>
          <p className="text-ink/60 text-sm">Reflecting on {config.theme}</p>
        </div>

        <section className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-border space-y-4">
            <p className="text-sm font-medium text-ink/60 uppercase tracking-widest">Reflection Question:</p>
            <p className="text-xl font-semibold text-navy leading-tight">
              {config.eveningReflection.question}
            </p>
          </div>

          <div className="bg-navy/5 rounded-2xl p-4 border border-navy/10">
            <p className="text-sm font-medium text-navy/60 mb-2 uppercase tracking-widest text-[10px] font-bold">Instruction:</p>
            <p className="text-ink text-sm leading-relaxed italic">
              {config.eveningReflection.instruction}
            </p>
          </div>

          <h3 className="text-sm font-bold text-ink/40 uppercase tracking-widest">Rate your day</h3>
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => isToday && setRating(num)}
                disabled={!isToday}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  rating >= num ? "bg-brown text-white" : "bg-white border border-border text-ink/20",
                  !isToday && rating < num && "opacity-30"
                )}
              >
                <Star size={20} fill={rating >= num ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-ink/40">
            <MessageSquare size={16} />
            <h3 className="text-sm font-bold uppercase tracking-widest">Final Thoughts</h3>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            readOnly={!isToday}
            placeholder={isToday ? "What are you grateful for tonight?" : "No reflections recorded for this day."}
            className={cn(
              "input-field min-h-[120px] bg-white",
              !isToday && "opacity-60 cursor-not-allowed"
            )}
          />
        </section>

        <section className="card bg-navy text-cream p-6 space-y-4">
          <div className="flex items-center gap-2 text-cream/60">
            <Sparkles size={16} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Evening Declaration</h3>
          </div>
          <p className="text-lg italic leading-relaxed">
            "{config.declarations.evening}"
          </p>
          <button 
            onClick={() => isToday && setDeclared(!declared)}
            disabled={!isToday}
            className={cn(
              "w-full py-3 rounded-lg text-sm font-bold transition-all",
              declared ? "bg-forest text-white" : "bg-white/10 text-white border border-white/20",
              !isToday && "opacity-50 cursor-not-allowed"
            )}
          >
            {declared ? 'Declared Aloud' : 'I have spoken this aloud'}
          </button>
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
          disabled={isToday && (!declared || rating === 0)}
          className="btn-primary w-full py-4"
        >
          {isToday ? 'Reflection Complete' : 'Back to Dashboard'}
        </button>
      </footer>
    </div>
  );
};

export default EveningReflection;
