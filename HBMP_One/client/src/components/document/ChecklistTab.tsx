import { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { ChecklistItem, ChecklistItemStatus, ChecklistItemTag } from '@/types/checklist';
import { CheckCircle2, AlertCircle, Search, ExternalLink, Check, X, ChevronRight } from 'lucide-react';
import {
  filterChecklistItems,
  computeChecklistSummary,
  getBlockingMandatoryItems,
  ChecklistFilters,
  EnhancedChecklistSummary,
} from '@/utils/checklistFilters';

interface ChecklistTabProps {
  documentTitle: string;
  items: ChecklistItem[];
  onItemsChange?: (items: ChecklistItem[]) => void;
  onGoToSection?: (sectionId: string) => void;
  requiredCompletionPercent?: number;
  onTabChange?: (tab: string) => void;
  initialFilter?: 'all' | 'pending';
}

export default function ChecklistTab({
  documentTitle,
  items: initialItems,
  onItemsChange,
  onGoToSection,
  requiredCompletionPercent = 100,
  onTabChange,
  initialFilter = 'all',
}: ChecklistTabProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [filters, setFilters] = useState<ChecklistFilters>({
    status: initialFilter === 'pending' ? 'open' : 'all',
    tag: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Update items when initialItems change
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Calculate enhanced summary
  const summary: EnhancedChecklistSummary = useMemo(() => {
    return computeChecklistSummary(items);
  }, [items]);

  // Get blocking items
  const blockingItems = useMemo(() => {
    return getBlockingMandatoryItems(items);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = filterChecklistItems(items, filters);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => item.label.toLowerCase().includes(query));
    }

    return filtered;
  }, [items, filters, searchQuery]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Toggle category collapse
  const toggleCategory = useCallback((category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  // Toggle item status
  const handleToggleItem = useCallback(
    (itemId: string) => {
      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          if (item.id === itemId && item.tag === 'MANDATORY') {
            const newStatus: ChecklistItemStatus = item.status === 'OPEN' ? 'DONE' : 'OPEN';
            return { ...item, status: newStatus };
          }
          return item;
        });
        onItemsChange?.(updatedItems);
        return updatedItems;
      });
    },
    [onItemsChange]
  );

  // Handle go to section with smooth scroll and highlight
  const handleGoToSection = useCallback(
    (sectionId: string) => {
      if (onGoToSection) {
        onGoToSection(sectionId);
      }

      // Smooth scroll to section
      setTimeout(() => {
        const sectionElement = document.getElementById(`section-${sectionId}`);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Flash highlight
          sectionElement.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-75', 'transition-all');
          setTimeout(() => {
            sectionElement.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-75');
          }, 1500);
        }
      }, 100);
    },
    [onGoToSection]
  );

  // Check if gate is satisfied
  const isGateSatisfied = summary.completionPercent >= requiredCompletionPercent;

  return (
    <div className="space-y-4 pb-4">
      {/* Progress Bar and Summary */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Checklist Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold">
                {summary.completedCount} / {summary.totalCount} ({summary.completionPercent}%)
              </span>
            </div>
            <Progress value={summary.completionPercent} className="h-2" />
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Mandatory Items</span>
              <span className={cn(
                "font-semibold",
                summary.mandatoryCompletionPercent >= 100 ? "text-green-600" : "text-amber-600"
              )}>
                {summary.mandatoryCompleted} / {summary.mandatoryTotal} ({summary.mandatoryCompletionPercent}%)
              </span>
            </div>
            <Progress 
              value={summary.mandatoryCompletionPercent} 
              className={cn(
                "h-2",
                summary.mandatoryCompletionPercent >= 100 && "bg-green-500"
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Blocking Reasons Card */}
      {!isGateSatisfied && blockingItems.length > 0 && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-amber-900">
                Blocking Reasons
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-amber-700">
              Complete these mandatory items to unlock approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {blockingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border border-amber-200 bg-white p-2"
              >
                <span className="text-xs text-gray-700 flex-1">{item.label}</span>
                {item.sectionId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGoToSection(item.sectionId!)}
                    className="h-6 px-2 text-xs ml-2"
                  >
                    Go to Section
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Workflow Gate Banner */}
      <Card className={cn('border-2', isGateSatisfied ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200')}>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-2">
            {isGateSatisfied ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-600" />
            )}
            <span className={cn('text-sm font-medium', isGateSatisfied ? 'text-green-800' : 'text-orange-800')}>
              {isGateSatisfied
                ? `Workflow Gate: ${requiredCompletionPercent}% completion achieved. Ready to approve.`
                : `Workflow Gate: Needs ${requiredCompletionPercent}% complete to APPROVE`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Filters Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-gray-600">Status:</span>
          <div className="flex gap-1.5">
            {(['all', 'open', 'done', 'auto_failed'] as const).map((status) => (
              <Button
                key={status}
                variant={filters.status === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, status }))}
                className={cn(
                  'h-7 px-2.5 text-xs font-medium',
                  filters.status === status && 'bg-primary text-primary-foreground shadow-sm'
                )}
              >
                {status === 'all' ? 'All' : status === 'open' ? 'Open' : status === 'done' ? 'Done' : 'Auto Failed'}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-gray-600">Tag:</span>
          <div className="flex gap-1.5">
            {(['all', 'mandatory', 'auto'] as const).map((tag) => (
              <Button
                key={tag}
                variant={filters.tag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, tag }))}
                className={cn(
                  'h-7 px-2.5 text-xs font-medium',
                  filters.tag === tag && 'bg-primary text-primary-foreground shadow-sm'
                )}
              >
                {tag === 'all' ? 'All' : tag === 'mandatory' ? 'Mandatory' : 'Auto'}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search checklist items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-7 text-xs border-gray-300 focus:border-primary"
          />
        </div>
      </div>

      {/* Checklist Items by Category */}
      <div className="space-y-4 pr-1">
        {Object.keys(groupedItems).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-gray-500">No items found matching your filters.</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedItems).map(([category, categoryItems]) => {
            const categoryCompleted = categoryItems.filter(
              (i) => i.status === 'DONE' || i.status === 'AUTO_PASSED'
            ).length;
            const categoryTotal = categoryItems.length;
            const isCollapsed = collapsedCategories.has(category);

            return (
              <Card key={category} className="border">
                <Collapsible
                  isOpen={!isCollapsed}
                  onOpenChange={(open) => toggleCategory(category)}
                  trigger={
                    <div className="flex items-center justify-between w-full py-2 px-3">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {category}
                        </h4>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {categoryCompleted}/{categoryTotal}
                        </Badge>
                      </div>
                    </div>
                  }
                >
                  <CardContent className="pt-0 pb-3 px-3 space-y-1.5">
                    {categoryItems.map((item) => {
                      const isManual = item.tag === 'MANDATORY';
                      const isCompleted = item.status === 'DONE' || item.status === 'AUTO_PASSED';
                      const isAutoPassed = item.status === 'AUTO_PASSED';
                      const isAutoFailed = item.status === 'AUTO_FAILED';

                      return (
                        <Card
                          key={item.id}
                          className={cn(
                            'transition-all border hover:border-gray-300 hover:shadow-sm',
                            isCompleted && 'bg-gray-50/30 border-gray-200'
                          )}
                        >
                          <CardContent className="py-2.5 px-3.5">
                            <div className="flex items-center gap-3">
                              {/* Left: Checkbox or Auto Icon */}
                              <div className="flex-shrink-0">
                                {isManual ? (
                                  <button
                                    onClick={() => handleToggleItem(item.id)}
                                    className={cn(
                                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer',
                                      isCompleted
                                        ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                                        : 'border-gray-300 hover:border-gray-400 bg-white'
                                    )}
                                    aria-label={`Toggle ${item.label}`}
                                  >
                                    {isCompleted && <Check className="h-3 w-3" />}
                                  </button>
                                ) : (
                                  <div
                                    className={cn(
                                      'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border',
                                      isAutoPassed && 'bg-green-100 text-green-700 border-green-300',
                                      isAutoFailed && 'bg-red-100 text-red-700 border-red-300',
                                      !isAutoPassed && !isAutoFailed && 'bg-blue-100 text-blue-700 border-blue-300'
                                    )}
                                    title="System evaluated based on rules. Not manually editable."
                                  >
                                    A
                                  </div>
                                )}
                              </div>

                              {/* Middle: Label */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    'text-sm leading-snug',
                                    isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'
                                  )}
                                >
                                  {item.label}
                                </p>
                              </div>

                              {/* Right: Tag and Go to Section */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {/* Tag */}
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-[10px] font-semibold px-1.5 py-0.5 h-5',
                                    item.tag === 'MANDATORY'
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  )}
                                >
                                  {item.tag}
                                </Badge>

                                {/* Go to Section Link */}
                                {item.sectionId && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleGoToSection(item.sectionId!)}
                                    className="h-5 px-1.5 text-[10px] text-primary hover:text-primary/80 hover:bg-primary/5"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </CardContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
