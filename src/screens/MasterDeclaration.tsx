import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Quote } from 'lucide-react';
import { MASTER_DECLARATION } from '../config';

const MasterDeclaration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="p-4 flex items-center gap-4 bg-white border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-navy">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl">Master Declaration</h1>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-12">
        <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center text-navy/20">
          <Quote size={40} />
        </div>

        <div className="space-y-8">
          <p className="text-2xl font-serif italic leading-relaxed text-navy">
            "{MASTER_DECLARATION}"
          </p>
          
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
              The 30-Day Covenant Seal
            </p>
            <div className="w-12 h-1 bg-navy/10 mx-auto rounded-full" />
          </div>
        </div>

        <div className="max-w-xs text-sm text-ink/60 leading-relaxed">
          Speak this declaration aloud daily during Week 4 to seal your 30-day journey of self-competition.
        </div>
      </main>

      <footer className="p-6">
        <button 
          onClick={() => navigate(-1)}
          className="btn-primary w-full py-4"
        >
          Back to Resources
        </button>
      </footer>
    </div>
  );
};

export default MasterDeclaration;
