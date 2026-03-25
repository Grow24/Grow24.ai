import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CLIPONStepperProps {
  currentLevel?: 'C' | 'L' | 'I' | 'P' | 'O' | 'N';
  className?: string;
}

const steps: Array<{ letter: 'C' | 'L' | 'I' | 'P' | 'O' | 'N'; label: string }> = [
  { letter: 'C', label: 'Conceptual' },
  { letter: 'L', label: 'Logical' },
  { letter: 'I', label: 'Implementation' },
  { letter: 'P', label: 'Production' },
  { letter: 'O', label: 'Operate' },
  { letter: 'N', label: 'Navigate' },
];

export default function CLIPONStepper({ currentLevel, className }: CLIPONStepperProps) {
  const currentIndex = currentLevel ? steps.findIndex((s) => s.letter === currentLevel) : -1;

  return (
    <div className={cn('flex items-center', className)}>
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = currentIndex > index;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.letter} className="flex items-center">
            {/* Arrow shape container - matching image style */}
            <div
              className={cn(
                'relative flex items-center justify-center gap-2',
                'h-10 min-w-[8rem] px-4',
                'transition-all duration-200',
                // Dark gray for active/completed, light gray for inactive - matching image
                isActive || isCompleted
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-700',
                // Hover effect
                !isActive && !isCompleted && 'hover:bg-gray-200'
              )}
              style={{
                clipPath: isLast
                  ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
                  : 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%)',
              }}
            >
              {/* Checkmark icon for completed/active steps - matching image */}
              {(isCompleted || isActive) && (
                <Check className="h-4 w-4 text-white flex-shrink-0" />
              )}
              <span className="text-sm font-bold select-none whitespace-nowrap">
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
