import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '@/api/documents.api';

interface StepperCLIOProps {
  projectId: string;
}

export default function StepperCLIO({ projectId }: StepperCLIOProps) {
  const { data: documentsData } = useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: () => documentsApi.getByProject(projectId),
    enabled: !!projectId,
  });

  // Determine which steps are enabled
  const hasApprovedBRD = documentsData?.documents.some(
    (doc) => doc.level === 'C' && doc.status === 'APPROVED' && doc.templateName.includes('BRD')
  );
  const hasApprovedSRS = documentsData?.documents.some(
    (doc) => doc.level === 'L' && doc.status === 'APPROVED' && doc.templateName === 'SRS'
  );

  const steps = [
    { label: 'Conceptual', level: 'C', enabled: true },
    { label: 'Logical', level: 'L', enabled: hasApprovedBRD },
    { label: 'Implementation', level: 'I', enabled: hasApprovedSRS },
  ];

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => (
        <div key={step.level} className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold',
              step.enabled
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted bg-muted text-muted-foreground'
            )}
          >
            {step.enabled ? '●' : '○'}
          </div>
          <span
            className={cn(
              'ml-2 text-sm font-medium',
              step.enabled ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className="mx-4 h-px w-8 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}

