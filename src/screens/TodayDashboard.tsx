import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { WEEK_CONFIG } from '../config';
import { format, addDays, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { ChevronRight, Sun, CloudSun, Moon, Trophy, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';

const TodayDashboard = () => {
  const { state } = useApp();
  const { date: dateParam } = useParams();
  
  const today = new Date();
  const activeDate = dateParam ? parseISO(dateParam) : today;
  const dateKey = format(activeDate, 'yyyy-MM-dd');
  const isToday = isSameDay(activeDate, today);
  
  const dayOfWeek = activeDate.getDay() === 0 ? 7 : activeDate.getDay();
  const config = WEEK_CONFIG[dayOfWeek - 1];
  
  // Get start of current week (Monday) based on activeDate
  const monday = startOfWeek(activeDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const isSaturday = dayOfWeek === 6;
  const initialPhases = isSaturday 
    ? [
        { id: 'ritual', completed: false },
        { id: 'recite', completed: false },
        { id: 'pray', completed: false },
        { id: 'aloud', completed: false },
        { id: 'rest', completed: false },
      ]
    : [
        { id: 'read', completed: false },
        { id: 'reflect', completed: false },
        { id: 'pray', completed: false },
        { id: 'rest', completed: false },
      ];

  const dayState = state.days[dateKey] || {
    morning: { phases: initialPhases, completed: false, currentStep: 0 },
    midday: { completed: false },
    evening: { completed: false }
  };

  const [showVerse, setShowVerse] = useState(false);

  const sessions = [
    { 
      id: 'morning', 
      title: 'Morning Session', 
      desc: 'Guided 30-min Session', 
      icon: Sun, 
      path: isToday ? '/today/morning' : `/today/morning/${dateKey}`,
      completed: dayState.morning.completed,
      color: 'text-orange-500'
    },
    { 
      id: 'midday', 
      title: 'Midday Check-In', 
      desc: '2-min Alignment', 
      icon: CloudSun, 
      path: isToday ? '/today/midday' : `/today/midday/${dateKey}`,
      completed: dayState.midday.completed,
      color: 'text-blue-400'
    },
    { 
      id: 'evening', 
      title: 'Evening Reflection', 
      desc: '5-min Reflection', 
      icon: Moon, 
      path: isToday ? '/today/evening' : `/today/evening/${dateKey}`,
      completed: dayState.evening.completed,
      color: 'text-indigo-600'
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy">{isToday ? 'Today' : format(activeDate, 'EEEE')}</h1>
          <p className="text-ink/60 font-medium">{config.name} — {config.theme}</p>
        </div>
        {!isToday && (
          <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
            Read Only
          </div>
        )}
      </header>

      {/* Day Selector */}
      <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-border">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, activeDate);
          const isCurrentDay = isSameDay(day, today);
          const dayKey = format(day, 'yyyy-MM-dd');
          
          return (
            <Link
              key={dayKey}
              to={isCurrentDay ? '/today' : `/today/${dayKey}`}
              className={cn(
                "flex flex-col items-center gap-1 w-10 py-2 rounded-xl transition-all",
                isSelected ? "bg-navy text-white shadow-lg" : "hover:bg-navy/5",
                !isSelected && isCurrentDay && "text-navy font-bold"
              )}
            >
              <span className="text-[10px] uppercase font-bold opacity-60">{format(day, 'eee')[0]}</span>
              <span className="text-sm font-bold">{format(day, 'd')}</span>
              {isCurrentDay && !isSelected && <div className="w-1 h-1 bg-navy rounded-full" />}
            </Link>
          );
        })}
      </div>

      <div className="card bg-navy text-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BookOpen size={80} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex px-3 py-1 bg-forest rounded-full text-[10px] font-bold tracking-widest uppercase">
            {config.theme}
          </div>
          <div className="space-y-2">
            <h2 className="text-xl text-cream font-bold">{config.verseRef}</h2>
            {showVerse && (
              <p className="text-cream/90 text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                {config.verseText}
              </p>
            )}
            <p className="text-cream/80 italic text-sm pt-2 border-t border-cream/10">
              "{config.keyPhrase}"
            </p>
          </div>
          <button 
            onClick={() => setShowVerse(!showVerse)}
            className="absolute bottom-3 right-4 text-[10px] font-bold uppercase tracking-widest text-cream/30 hover:text-cream/60 transition-colors"
          >
            {showVerse ? 'Hide Verse' : 'View Verse'}
          </button>
        </div>
      </div>

      {/* Theme Description */}
      <div className="bg-white/50 border border-border p-4 rounded-2xl space-y-2">
        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">The Theme</h3>
        <p className="text-sm text-ink/80 leading-relaxed italic">
          {config.themeDescription}
        </p>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-ink/40 uppercase tracking-widest">Daily Sessions</h3>
        <div className="grid gap-3">
          {sessions.map((session) => (
            <Link 
              key={session.id} 
              to={session.path}
              className={cn(
                "card flex items-center justify-between group active:bg-navy/5 transition-colors",
                session.completed && "bg-forest/5 border-forest/20"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl bg-cream", session.color)}>
                  <session.icon size={24} />
                </div>
                <div>
                  <h4 className="text-base font-semibold">{session.title}</h4>
                  <p className="text-xs text-ink/50">{session.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {session.completed ? (
                  <div className="w-6 h-6 bg-forest rounded-full flex items-center justify-center text-white">
                    <CheckCircle2 size={16} />
                  </div>
                ) : (
                  <ChevronRight size={20} className="text-ink/20 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link to={`/week/${dateKey}`} className="card flex flex-col gap-3 active:bg-navy/5 transition-colors">
          <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
            <Calendar size={20} />
          </div>
          <span className="text-sm font-semibold">Weekly Progress</span>
        </Link>
        <Link to="/log" className="card flex flex-col gap-3 active:bg-navy/5 transition-colors">
          <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center text-forest">
            <Trophy size={20} />
          </div>
          <span className="text-sm font-semibold">Victory Log</span>
        </Link>
      </div>
    </div>
  );
};

export default TodayDashboard;
