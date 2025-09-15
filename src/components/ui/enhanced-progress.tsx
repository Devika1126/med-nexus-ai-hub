import * as React from "react"
import { cn } from "@/lib/utils"

interface EnhancedProgressProps {
  value: number
  className?: string
  showGradient?: boolean
  colorScheme?: 'default' | 'medical'
}

const EnhancedProgress = React.forwardRef<
  HTMLDivElement,
  EnhancedProgressProps
>(({ className, value, showGradient = true, colorScheme = 'medical', ...props }, ref) => {
  const getColorClasses = (val: number) => {
    if (colorScheme === 'medical') {
      if (val >= 85) return 'bg-success';
      if (val >= 70) return 'bg-warning';
      return 'bg-destructive';
    }
    // Default color scheme
    if (val >= 70) return 'bg-primary';
    if (val >= 40) return 'bg-warning'; 
    return 'bg-destructive';
  };

  const getGradientStyle = (val: number) => {
    if (!showGradient) return {};
    
    if (colorScheme === 'medical') {
      if (val >= 85) return { 
        background: 'linear-gradient(90deg, hsl(var(--success)), hsl(var(--success) / 0.8))'
      };
      if (val >= 70) return { 
        background: 'linear-gradient(90deg, hsl(var(--warning)), hsl(var(--warning) / 0.8))'
      };
      return { 
        background: 'linear-gradient(90deg, hsl(var(--destructive)), hsl(var(--destructive) / 0.8))'
      };
    }
    
    // Default gradient
    return { 
      background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))'
    };
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", getColorClasses(value || 0))}
        style={{ 
          width: `${value || 0}%`,
          ...getGradientStyle(value || 0)
        }}
      />
      {/* Glow effect overlay */}
      {showGradient && (
        <div 
          className="absolute top-0 left-0 h-full rounded-full opacity-40 blur-[1px]"
          style={{ 
            width: `${value || 0}%`,
            ...getGradientStyle(value || 0)
          }}
        />
      )}
    </div>
  )
})

EnhancedProgress.displayName = "EnhancedProgress"

export { EnhancedProgress }