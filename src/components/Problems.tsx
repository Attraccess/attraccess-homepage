import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Lock, FileText, Wrench } from 'lucide-react';

export function Problems() {
  const { t } = useI18n();

  const problems = [
    {
      icon: Lock,
      title: t('problems.unauthorized'),
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      icon: FileText,
      title: t('problems.billing'),
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: Wrench,
      title: t('problems.maintenance'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('problems.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${problem.bgColor} mb-4`}>
                <problem.icon className={`w-8 h-8 ${problem.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}