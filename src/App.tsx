import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './AppContext';
import { Home, Calendar, BookOpen, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { Toaster } from 'sonner';

// Screens (to be implemented)
import TodayDashboard from './screens/TodayDashboard';
import WeekOverview from './screens/WeekOverview';
import VictoryLog from './screens/VictoryLog';
import MoreMenu from './screens/MoreMenu';
import Onboarding from './screens/Onboarding';
import MorningSession from './screens/MorningSession';
import MiddayCheckin from './screens/MiddayCheckin';
import EveningReflection from './screens/EveningReflection';
import Memorization from './screens/Memorization';
import Help from './screens/Help';
import MasterDeclaration from './screens/MasterDeclaration';
import Settings from './screens/Settings';

const BottomNav = () => {
  const location = useLocation();
  const tabs = [
    { path: '/today', icon: Home, label: 'Today' },
    { path: '/week', icon: Calendar, label: 'Week' },
    { path: '/log', icon: CheckCircle2, label: 'Log' },
    { path: '/more', icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border pb-safe pt-2 px-4 flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const isActive = tab.path === '/today' 
          ? location.pathname === '/today' || (location.pathname.startsWith('/today/') && !['morning', 'midday', 'evening'].some(p => location.pathname.includes(p)))
          : location.pathname.startsWith(tab.path);
        
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              isActive ? "text-navy" : "text-ink/40"
            )}
          >
            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const AppRoutes = () => {
  const { state, isLoading } = useApp();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-cream">Loading...</div>;

  if (!state.settings.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  const showNav = !['/onboarding', '/morning', '/midday', '/evening'].some(p => location.pathname.includes(p));

  return (
    <div className={cn("min-h-screen pb-20", !showNav && "pb-0")}>
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="max-w-md mx-auto px-4 pt-6"
        >
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/today" element={<TodayDashboard />} />
            <Route path="/today/:date" element={<TodayDashboard />} />
            <Route path="/today/morning" element={<MorningSession />} />
            <Route path="/today/morning/:date" element={<MorningSession />} />
            <Route path="/today/midday" element={<MiddayCheckin />} />
            <Route path="/today/midday/:date" element={<MiddayCheckin />} />
            <Route path="/today/evening" element={<EveningReflection />} />
            <Route path="/today/evening/:date" element={<EveningReflection />} />
            <Route path="/week" element={<WeekOverview />} />
            <Route path="/week/:date" element={<WeekOverview />} />
            <Route path="/log" element={<VictoryLog />} />
            <Route path="/memorization" element={<Memorization />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          <Route path="/master-declaration" element={<MasterDeclaration />} />
            <Route path="/more" element={<MoreMenu />} />
            <Route path="/" element={<Navigate to="/today" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
