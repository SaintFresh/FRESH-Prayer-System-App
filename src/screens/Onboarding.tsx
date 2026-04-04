import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ArrowRight, Check } from 'lucide-react';
import { format } from 'date-fns';

const Onboarding = () => {
  const navigate = useNavigate();
  const { state, updateSettings } = useApp();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (state.settings.onboardingCompleted) {
      navigate('/today', { replace: true });
    }
  }, [state.settings.onboardingCompleted, navigate]);

  const next = () => setStep(s => s + 1);

  const finish = () => {
    updateSettings({ 
      onboardingCompleted: true, 
      startDate: format(new Date(), 'yyyy-MM-dd') 
    });
    navigate('/today', { replace: true });
  };

  return (
    <div className="h-[90vh] flex flex-col justify-between py-10">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center text-center gap-8"
          >
            <div className="w-24 h-24 bg-navy rounded-3xl flex items-center justify-center text-cream">
              <Shield size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl">Victor's Covenant</h1>
              <p className="text-ink/70 leading-relaxed">
                A 7-day Scripture Prayer System designed to guide you through daily spiritual discipline and continuous growth.
              </p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center text-center gap-8"
          >
            <div className="w-24 h-24 bg-forest rounded-3xl flex items-center justify-center text-cream">
              <Check size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl">Daily Rhythm</h2>
              <p className="text-ink/70 leading-relaxed">
                Engage in three guided moments each day:<br/>
                <strong>Morning:</strong> Deep meditation & prayer<br/>
                <strong>Midday:</strong> Quick 2-min alignment<br/>
                <strong>Evening:</strong> Reflection & declaration
              </p>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center text-center gap-8"
          >
            <div className="w-24 h-24 bg-brown rounded-3xl flex items-center justify-center text-cream">
              <ArrowRight size={48} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl">Ready to Begin?</h2>
              <p className="text-ink/70 leading-relaxed">
                Your journey starts today. We'll track your progress locally on this device to ensure your privacy.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4">
        {step < 3 ? (
          <button onClick={next} className="btn-primary w-full">
            Continue <ArrowRight size={20} />
          </button>
        ) : (
          <button onClick={finish} className="btn-primary w-full">
            Go to Today
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
