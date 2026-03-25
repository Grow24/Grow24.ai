import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle2 } from 'lucide-react';
import { Blocker } from '@/utils/dashboard';

interface BlockersCardProps {
  blockers: Blocker[];
}

export default function BlockersCard({ blockers }: BlockersCardProps) {
  if (blockers.length === 0) {
    return (
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-4 border-b border-slate-100">
          <CardTitle className="text-base font-semibold text-slate-900">Blockers</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2.5 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="font-medium">No blockers - all prerequisites met</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <CardTitle className="text-base font-semibold text-slate-900">Blockers</CardTitle>
        <CardDescription className="text-xs text-slate-500 font-medium mt-1">Items waiting on prerequisites</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-4">
        {blockers.map((blocker, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm hover:bg-slate-100 transition-colors"
            title={blocker.reason}
          >
            <div className="flex items-center space-x-2.5">
              <Lock className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="font-medium text-slate-700">{blocker.label}</span>
            </div>
            <Badge variant="secondary" className="text-xs font-medium bg-slate-200 text-slate-700 border-0">
              LOCKED
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

