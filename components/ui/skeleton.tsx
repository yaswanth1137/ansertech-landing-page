import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "shimmer" | "glow" | "pulse" | "glass" | "pill" | "circle" | "default";
}

function Skeleton({
  className,
  variant = "shimmer",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-muted/70 dark:bg-zinc-800/60 relative overflow-hidden transition-all",
        variant === "shimmer" && "animate-skeleton-shimmer backdrop-blur-xs border border-white/5",
        variant === "glow" && "animate-skeleton-glow bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20",
        variant === "pulse" && "animate-pulse bg-muted/80 dark:bg-zinc-800/80",
        variant === "glass" && "bg-background/40 backdrop-blur-md border border-border/50 animate-skeleton-shimmer",
        variant === "circle" && "rounded-full",
        variant === "pill" && "rounded-full",
        className
      )}
      {...props}
    />
  );
}

function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["w-full", "w-5/6", "w-4/6", "w-11/12", "w-3/4"];
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded-lg",
            widths[i % widths.length]
          )}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };
  return (
    <div className="relative inline-block">
      <Skeleton className={cn("rounded-full", sizeClasses[size], className)} />
      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-muted border-2 border-background animate-pulse" />
    </div>
  );
}

function SkeletonBadge({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 w-20 rounded-full", className)} />;
}

function SkeletonButton({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-20 rounded-lg",
    md: "h-10 w-28 rounded-xl",
    lg: "h-12 w-36 rounded-xl",
  };
  return <Skeleton className={cn(sizeClasses[size], className)} />;
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4 shadow-xs backdrop-blur-xs animate-skeleton-shimmer", className)}>
      <div className="flex items-center justify-between">
        <SkeletonAvatar size="md" />
        <SkeletonBadge />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
      <SkeletonText lines={2} />
      <div className="pt-4 flex gap-2">
        <SkeletonButton size="md" className="flex-1" />
        <SkeletonButton size="md" className="flex-1" />
      </div>
    </div>
  );
}

function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/40 px-4 animate-skeleton-shimmer">
      <SkeletonAvatar size="sm" />
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded-lg",
            i === 0 ? "w-1/4" : "flex-1"
          )}
        />
      ))}
      <SkeletonBadge />
    </div>
  );
}

function StatSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-2xl bg-card/40 border border-border/60 space-y-3 backdrop-blur-xs animate-skeleton-shimmer", className)}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-28 rounded-xl" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-3 w-12 rounded-full" />
        <Skeleton className="h-3 w-32 rounded-md" />
      </div>
    </div>
  );
}

function StatGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatSkeleton key={i} />
      ))}
    </div>
  );
}

function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card/30 overflow-hidden shadow-xs backdrop-blur-xs", className)}>
      {/* Table Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border/60 bg-muted/40">
        <Skeleton className="h-4 w-6 rounded-md" />
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 rounded-md" />
        ))}
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

function SkeletonChart({ type = "line", className }: { type?: "bar" | "line" | "kpi"; className?: string }) {
  return (
    <div className={cn("p-6 rounded-2xl border border-border/60 bg-card/40 space-y-6 shadow-xs backdrop-blur-xs animate-skeleton-shimmer", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 rounded-xl" />
          <Skeleton className="h-4 w-60 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <SkeletonButton size="sm" />
          <SkeletonButton size="sm" />
        </div>
      </div>
      
      {/* Chart Bars / Waves Placeholder */}
      <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2 border-b border-border/40">
        {Array.from({ length: 12 }).map((_, i) => {
          const heights = ["h-1/3", "h-2/3", "h-1/2", "h-3/4", "h-4/5", "h-2/5", "h-5/6", "h-3/5"];
          return (
            <Skeleton
              key={i}
              className={cn("w-full rounded-t-lg transition-all", heights[i % heights.length])}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-3 w-24 rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function SkeletonForm({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("p-6 rounded-2xl border border-border/60 bg-card/40 space-y-6 shadow-xs backdrop-blur-xs animate-skeleton-shimmer", className)}>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded-xl" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="pt-4 flex justify-end gap-3">
        <SkeletonButton size="md" />
        <SkeletonButton size="md" />
      </div>
    </div>
  );
}

function SkeletonChat({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-[600px] rounded-2xl border border-border/60 bg-card/30 overflow-hidden shadow-xs backdrop-blur-xs", className)}>
      {/* Chat Header */}
      <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        </div>
        <SkeletonButton size="sm" />
      </div>
      {/* Messages Stream */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex items-start gap-3 max-w-[80%]">
          <SkeletonAvatar size="sm" />
          <Skeleton className="h-16 w-full rounded-2xl rounded-tl-none p-4" />
        </div>
        <div className="flex items-start justify-end gap-3 ml-auto max-w-[80%]">
          <Skeleton className="h-12 w-full rounded-2xl rounded-tr-none bg-amber-500/10 border border-amber-500/20" />
          <SkeletonAvatar size="sm" />
        </div>
        <div className="flex items-start gap-3 max-w-[75%]">
          <SkeletonAvatar size="sm" />
          <Skeleton className="h-24 w-full rounded-2xl rounded-tl-none p-4" />
        </div>
      </div>
      {/* Input Bar */}
      <div className="p-4 border-t border-border/60 bg-card/50 flex gap-3 items-center">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <SkeletonButton size="md" />
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  SkeletonCard,
  CardSkeleton,
  TableRowSkeleton,
  StatSkeleton,
  StatGridSkeleton,
  SkeletonTable,
  SkeletonChart,
  SkeletonForm,
  SkeletonChat,
};
