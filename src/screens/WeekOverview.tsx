import React from 'react';
import { useApp } from '../AppContext';
import { WEEK_CONFIG } from '../config';
import { format, addDays, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { Trophy, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const WeekOverview = () => {
  const { state } = useApp();
  const { date: dateParam } = useParams();
  const navigate = useNavigate();
  
  const today = new Date();
  const activeDate = dateParam ? parseISO(dateParam) : today;
  const monday = startOfWeek(activeDate, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  
  const handlePrevWeek = () => {
    const prevWeek = addDays(monday, -7);
    navigate(`/week/${format(prevWeek, 'yyyy-MM-dd')}`);
  };

  const handleNextWeek = () => {
    const nextWeek = addDays(monday, 7);
    navigate(`/week/${format(nextWeek, 'yyyy-MM-dd')}`);
  };
  
  const completedModules = weekDays.reduce((acc, date) => {
    const key = format(date, 'yyyy-MM-dd');
    const day = state.days[key];
    if (!day) return acc;
    let count = 0;
    if (day.morning.completed) count++;
    if (day.midday.completed) count++;
    if (day.evening.completed) count++;
    return acc + count;
  }, 0);

  const totalModules = 21;
  const percentage = Math.round((completedModules / totalModules) * 100);

  return (
    <div className="space-y-8 pb-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Weekly Progress</h1>
          <p className="text-ink/60 font-medium">Week of {format(monday, 'MMM d, yyyy')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevWeek} className="p-2 bg-white rounded-full border border-border text-navy hover:bg-navy/5">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNextWeek} className="p-2 bg-white rounded-full border border-border text-navy hover:bg-navy/5">
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="card flex items-center gap-6 p-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              className="text-navy/5"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * percentage) / 100}
              strokeLinecap="round"
              className="text-navy transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-navy">{percentage}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="text-lg">Overall Completion</h3>
          <p className="text-sm text-ink/50">{completedModules} of {totalModules} sessions finished</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-ink/40 uppercase tracking-widest">Daily Breakdown</h3>
        <div className="grid gap-3">
          {weekDays.map((date, i) => {
            const key = format(date, 'yyyy-MM-dd');
            const config = WEEK_CONFIG[i];
            const dayState = state.days[key];
            const isToday = isSameDay(date, today);

            return (
              <Link 
                key={key} 
                to={isToday ? '/today' : `/today/${key}`}
                className={cn(
                  "card p-4 flex items-center justify-between transition-all active:scale-[0.98]",
                  isToday && "border-navy bg-navy/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 text-center">
                    <span className="text-[10px] font-bold text-ink/40 uppercase block">{format(date, 'EEE')}</span>
                    <span className="text-lg font-bold">{format(date, 'd')}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{config.theme}</h4>
                    <div className="flex gap-1 mt-1">
                      {[
                        dayState?.morning.completed,
                        dayState?.midday.completed,
                        dayState?.evening.completed
                      ].map((done, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            done ? "bg-forest" : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {dayState?.morning.completed && dayState?.midday.completed && dayState?.evening.completed && (
                  <CheckCircle2 size={20} className="text-forest" />
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <Link to="/log" className="btn-primary w-full">
        <Trophy size={20} /> Open Victory Log
      </Link>
    </div>
  );
};

export default WeekOverview;
