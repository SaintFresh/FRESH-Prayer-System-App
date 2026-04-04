import React from 'react';
import { useApp } from '../AppContext';
import { MEMORIZATION_PLAN } from '../config';
import { Check, BookOpen, Trophy, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Memorization = () => {
  const { state, toggleMemorized } = useApp();
  
  const memorizedCount = state.memorization.filter(m => m.memorized).length;
  const totalCount = MEMORIZATION_PLAN.length;
  const percentage = Math.round((memorizedCount / totalCount) * 100);

  return (
    <div className="space-y-8 pb-8">
      <header>
        <h1 className="text-3xl">Memorization</h1>
        <p className="text-ink/60 font-medium">30-Day Verse Plan</p>
      </header>

      <div className="card p-6 bg-navy text-cream space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Overall Progress</span>
            <h3 className="text-2xl text-cream">{percentage}% Complete</h3>
          </div>
          <Trophy size={32} className="opacity-20" />
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-forest transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((week) => {
          const weekVerses = MEMORIZATION_PLAN.filter(v => v.weekIndex === week);
          if (weekVerses.length === 0) return null;

          return (
            <section key={week} className="space-y-3">
              <h3 className="text-sm font-bold text-ink/40 uppercase tracking-widest">Week {week}</h3>
              <div className="grid gap-3">
                {weekVerses.map((verse) => {
                  const isMemorized = state.memorization.find(m => m.verseId === verse.verseId)?.memorized;
                  
                  return (
                    <div key={verse.verseId} className="card p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          isMemorized ? "bg-forest/10 text-forest" : "bg-navy/5 text-navy"
                        )}>
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">{verse.reference}</h4>
                          <p className="text-xs text-ink/50">Verse {week}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleMemorized(verse.verseId)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                          isMemorized ? "bg-forest border-forest text-white" : "border-border text-transparent"
                        )}
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Memorization;
