import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, HelpCircle, BookOpen, Info, ChevronRight, Quote } from 'lucide-react';

const MoreMenu = () => {
  const menuItems = [
    { label: 'Master Declaration', icon: Quote, path: '/master-declaration', color: 'text-navy' },
    { label: 'Memorization Tracker', icon: BookOpen, path: '/memorization', color: 'text-ink/60' },
    { label: 'Settings', icon: Settings, path: '/settings', color: 'text-ink/60' },
    { label: 'Help & Guide', icon: HelpCircle, path: '/help', color: 'text-ink/60' },
    { label: 'About FRESH With Prayer', icon: Info, path: '/help', color: 'text-ink/60' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <header>
        <h1 className="text-3xl">More</h1>
        <p className="text-ink/60 font-medium">Resources & Settings</p>
      </header>

      <div className="grid gap-3">
        {menuItems.map((item) => (
          <Link 
            key={item.label} 
            to={item.path}
            className="card flex items-center justify-between p-4 active:bg-navy/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={item.color}>
                <item.icon size={24} />
              </div>
              <span className="font-semibold">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-ink/20" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MoreMenu;
