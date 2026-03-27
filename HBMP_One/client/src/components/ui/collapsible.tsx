import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  trigger: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Collapsible({ 
  children, 
  defaultOpen = true, 
  trigger, 
  className,
  isOpen: controlledIsOpen,
  onOpenChange,
}: CollapsibleProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    const newValue = !isOpen;
    if (onOpenChange) {
      onOpenChange(newValue);
    } else {
      setInternalIsOpen(newValue);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between text-left"
      >
        {trigger}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

