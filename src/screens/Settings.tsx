import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { ChevronLeft, Moon, Sun, Monitor, Bell, Shield, Database, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'sonner';

import { format } from 'date-fns';

const Settings = () => {
  const navigate = useNavigate();
  const { state, updateSettings, resetApp } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Basic validation
        if (!parsedData.settings || !parsedData.days) {
          throw new Error('Invalid backup file format');
        }

        localStorage.setItem('victors_covenant_state', JSON.stringify(parsedData));
        toast.success('Data imported successfully. Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Import failed', error);
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-8 pb-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-navy">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl">Settings</h1>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ink/40">
          <Moon size={16} />
          <h3 className="text-sm font-bold uppercase tracking-widest">Appearance</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => updateSettings({ theme: t.id as any })}
              className={cn(
                "card p-4 flex flex-col items-center gap-2 transition-all",
                state.settings.theme === t.id ? "border-navy bg-navy/5" : "opacity-60"
              )}
            >
              <t.icon size={20} />
              <span className="text-xs font-semibold">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ink/40">
          <Bell size={16} />
          <h3 className="text-sm font-bold uppercase tracking-widest">Notifications</h3>
        </div>
        <div className="card flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-navy/40" />
            <span className="font-medium">Enable Reminders</span>
          </div>
          <button 
            onClick={() => updateSettings({ notificationsEnabled: !state.settings.notificationsEnabled })}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              state.settings.notificationsEnabled ? "bg-forest" : "bg-border"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
              state.settings.notificationsEnabled ? "left-7" : "left-1"
            )} />
          </button>
        </div>
        <p className="text-[10px] text-ink/40 px-2">
          Note: Push notifications are a v2 feature and currently only toggle the UI state.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ink/40">
          <Database size={16} />
          <h3 className="text-sm font-bold uppercase tracking-widest">Data Management</h3>
        </div>
        <div className="space-y-3">
          <button 
            onClick={() => {
              const data = JSON.stringify(state, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `victors-covenant-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
              a.click();
              toast.success('Data exported successfully');
            }}
            className="card w-full flex items-center justify-between p-4 active:bg-navy/5"
          >
            <span className="font-medium">Export Local Data</span>
            <ChevronLeft size={20} className="rotate-180 text-ink/20" />
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="card w-full flex items-center justify-between p-4 active:bg-navy/5"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">Import Data</span>
            </div>
            <Upload size={20} className="text-ink/20" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
          
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="card w-full flex items-center justify-between p-4 text-red-500 border-red-100 active:bg-red-50"
          >
            <span className="font-medium">Reset Application</span>
            <ChevronLeft size={20} className="rotate-180 text-red-200" />
          </button>
        </div>
      </section>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetApp}
        title="Reset Application?"
        message="DANGER: This will permanently delete all your progress, journals, and logs. This action cannot be undone."
        confirmText="Reset Now"
        cancelText="Keep Data"
      />

      <div className="text-center pt-8">
        <p className="text-[10px] text-ink/30 uppercase tracking-widest font-bold">
          Victor's Covenant v1.0.0
        </p>
      </div>
    </div>
  );
};

export default Settings;
