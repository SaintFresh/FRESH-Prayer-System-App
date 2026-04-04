import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Book, Target, Shield } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'The Concept',
      icon: Shield,
      content: 'Victor\'s Covenant is a 7-day scripture prayer system designed to help you build spiritual discipline and walk in continuous victory through Christ. It is a strategic framework for self-competition, not human comparison.'
    },
    {
      title: 'The Philosophy',
      icon: Book,
      content: 'The core philosophy is that your only competition is who you were yesterday. By focusing on your own race and God\'s specific calling for you, you eliminate the poison of comparison and walk in true freedom.'
    },
    {
      title: 'Daily Rhythm',
      icon: Target,
      content: 'The system is built around three daily touchpoints: a deep Morning Session (30 min), a quick Midday Alignment (2 min), and an Evening Reflection (5 min). Each session is designed to anchor your day in the Word.'
    },
    {
      title: 'Weekly Themes',
      icon: Book,
      content: 'Monday (Surrender), Tuesday (Focus), Wednesday (Discipline), Thursday (Alignment), Friday (Victory), Saturday (Synthesis), and Sunday (Sabbath). Each day builds upon the previous, creating a complete arc of spiritual growth.'
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-navy">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl">Help & Guide</h1>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="card p-6 space-y-4">
            <div className="flex items-center gap-3 text-navy">
              <section.icon size={24} />
              <h2 className="text-xl">{section.title}</h2>
            </div>
            <p className="text-ink/70 leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}

        <section className="card bg-navy text-cream p-6 space-y-4">
          <h3 className="text-lg text-cream">How to use this app</h3>
          <ol className="space-y-3 text-sm text-cream/80 list-decimal pl-4">
            <li>Start your Morning Session as early as possible.</li>
            <li>Set a reminder for a quick Midday check-in.</li>
            <li>End your day with the Evening Reflection and Declaration.</li>
            <li>On Friday or Saturday, complete your Victory Log.</li>
            <li>Track your verse memorization in the More tab.</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default Help;
