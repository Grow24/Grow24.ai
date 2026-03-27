import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PhaseCounts } from '@/utils/dashboard';
import { CheckCircle2, Lock } from 'lucide-react';

interface CliphaseCardProps {
  phaseCounts: PhaseCounts;
  hasApprovedBRD: boolean;
  hasApprovedSRS: boolean;
}

export default function CliphaseCard({
  phaseCounts,
  hasApprovedBRD,
  hasApprovedSRS,
}: CliphaseCardProps) {
  const phases = [
    {
      label: 'Conceptual',
      level: 'C',
      enabled: true,
      counts: phaseCounts.conceptual,
      isActive: phaseCounts.conceptual.total > 0 && phaseCounts.conceptual.approved < phaseCounts.conceptual.total,
      isComplete: phaseCounts.conceptual.total > 0 && phaseCounts.conceptual.approved === phaseCounts.conceptual.total,
    },
    {
      label: 'Logical',
      level: 'L',
      enabled: hasApprovedBRD,
      counts: phaseCounts.logical,
      isActive: hasApprovedBRD && phaseCounts.logical.total > 0 && phaseCounts.logical.approved < phaseCounts.logical.total,
      isComplete: phaseCounts.logical.total > 0 && phaseCounts.logical.approved === phaseCounts.logical.total,
    },
    {
      label: 'Implementation',
      level: 'I',
      enabled: false, // SRS hidden for now, so Implementation phase is disabled
      counts: phaseCounts.implementation,
      isActive: false,
      isComplete: phaseCounts.implementation.total > 0 && phaseCounts.implementation.approved === phaseCounts.implementation.total,
    },
  ];

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">CLIPON Progress</CardTitle>
        <CardDescription className="text-xs text-slate-500 font-medium mt-1">SDLC execution phases</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-6">
          {phases.map((phase, index) => (
            <div key={phase.level} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                    phase.isComplete
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200'
                      : phase.isActive
                      ? 'border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-200'
                      : phase.enabled
                      ? 'border-slate-300 bg-slate-50 text-slate-600'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  )}
                  title={
                    !phase.enabled
                      ? phase.level === 'L'
                        ? 'Requires BRD approval'
                        : phase.level === 'I'
                        ? 'Implementation phase disabled'
                        : undefined
                      : undefined
                  }
                >
                  {phase.isComplete ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : phase.enabled ? (
                    <div className="h-3 w-3 rounded-full bg-current" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-semibold tracking-wide',
                    phase.enabled ? 'text-slate-900' : 'text-slate-400'
                  )}
                >
                  {phase.label}
                </span>
                <span
                  className={cn(
                    'text-xs font-medium',
                    phase.enabled ? 'text-slate-600' : 'text-slate-400'
                  )}
                >
                  {phase.counts.approved}/{phase.counts.total}
                </span>
              </div>
              {index < phases.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-16 transition-colors',
                    phase.enabled && phases[index + 1].enabled
                      ? 'bg-slate-300'
                      : 'bg-slate-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

