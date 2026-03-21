import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { NextAction } from '@/utils/dashboard';
import { useNavigate } from 'react-router-dom';

interface NextActionCardProps {
  nextAction: NextAction | null;
  onActionClick?: (action: NextAction) => void;
}

export default function NextActionCard({ nextAction, onActionClick }: NextActionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!nextAction || !onActionClick) return;
    onActionClick(nextAction);
  };

  if (!nextAction) {
    return (
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-900">Next Action</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2.5 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">All current tasks completed</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">Next Action</CardTitle>
        <CardDescription className="text-xs text-slate-500 font-medium mt-1">What to do next</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug">{nextAction.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{nextAction.reason}</p>
        </div>
        <Button
          onClick={handleClick}
          size="default"
          className="w-full font-medium shadow-sm hover:shadow"
          variant="default"
        >
          {nextAction.action === 'create' && 'Create'}
          {nextAction.action === 'submit' && 'Review & Submit'}
          {nextAction.action === 'approve' && 'Approve'}
          {nextAction.action === 'continue' && 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

