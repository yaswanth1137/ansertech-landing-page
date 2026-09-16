import React from "react";
import { cn } from "@/lib/utils";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonBadge,
  SkeletonButton,
  CardSkeleton,
  StatGridSkeleton,
  SkeletonTable,
  SkeletonChart,
  SkeletonForm,
  SkeletonChat,
} from "@/components/ui/skeleton";

export interface PageSkeletonProps {
  type?:
    | "dashboard"
    | "landing"
    | "docs"
    | "list"
    | "table"
    | "grid"
    | "detail"
    | "form"
    | "settings"
    | "chat"
    | "copilot"
    | "auth"
    | "pricing"
    | "analytics"
    | "partners";
  className?: string;
}

export function PageSkeleton({ type = "dashboard", className }: PageSkeletonProps) {
  // ─── 1. Landing / Public Marketing Skeleton ─────────────────────────
  if (type === "landing") {
    return (
      <div className={cn("min-h-screen bg-background p-6 space-y-16 max-w-7xl mx-auto pt-24", className)}>
        {/* Header Hero Skeleton */}
        <div className="space-y-6 text-center max-w-3xl mx-auto py-12">
          <SkeletonBadge className="mx-auto h-7 w-40" />
          <Skeleton className="h-14 w-4/5 mx-auto rounded-2xl" />
          <Skeleton className="h-6 w-3/5 mx-auto rounded-xl" />
          <div className="flex justify-center gap-4 pt-4">
            <SkeletonButton size="lg" className="w-40" />
            <SkeletonButton size="lg" className="w-40" />
          </div>
        </div>

        {/* Dynamic Feature Preview Block */}
        <div className="p-8 rounded-3xl border border-border/60 bg-card/30 backdrop-blur-md shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Skeleton className="w-3.5 h-3.5 rounded-full" />
              <Skeleton className="w-3.5 h-3.5 rounded-full" />
              <Skeleton className="w-3.5 h-3.5 rounded-full" />
            </div>
            <Skeleton className="h-5 w-44 rounded-full" />
          </div>
          <SkeletonChart type="line" />
        </div>

        {/* Feature Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // ─── 2. Auth Skeleton (Login, Register, Passwords) ─────────────────
  if (type === "auth") {
    return (
      <div className={cn("min-h-screen flex items-center justify-center p-6 bg-background", className)}>
        <div className="w-full max-w-md p-8 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl space-y-6 shadow-2xl animate-skeleton-shimmer">
          <div className="text-center space-y-3">
            <Skeleton className="w-12 h-12 rounded-2xl mx-auto" />
            <Skeleton className="h-7 w-48 mx-auto rounded-xl" />
            <Skeleton className="h-4 w-64 mx-auto rounded-lg" />
          </div>
          <div className="space-y-4 pt-2">
            <SkeletonButton size="lg" className="w-full" />
            <div className="relative py-2">
              <Skeleton className="h-0.5 w-full" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            </div>
            <SkeletonButton size="lg" className="w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ─── 3. Docs Skeleton ──────────────────────────────────────────────
  if (type === "docs") {
    return (
      <div className={cn("min-h-screen bg-background p-8 max-w-7xl mx-auto pt-24 grid grid-cols-1 lg:grid-cols-12 gap-8", className)}>
        {/* Docs Sidebar Skeleton */}
        <div className="lg:col-span-3 space-y-4 border-r border-border/50 pr-6 hidden lg:block">
          <Skeleton className="h-9 w-full rounded-xl" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-5/6 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Docs Content Skeleton */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-10 w-2/3 rounded-xl" />
          <SkeletonText lines={4} />
          <Skeleton className="h-56 w-full rounded-2xl" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // ─── 4. Table / List Skeleton (Customers, Businesses, Bookings, Calls) ───
  if (type === "list" || type === "table") {
    return (
      <div className={cn("space-y-6 p-6 max-w-7xl mx-auto", className)}>
        {/* Top Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-44 rounded-xl" />
            <SkeletonButton size="md" />
          </div>
        </div>

        {/* Data Table Skeleton */}
        <SkeletonTable rows={7} columns={5} />
      </div>
    );
  }

  // ─── 5. Grid Skeleton (Agents, Chatbots, Integrations) ──────────────
  if (type === "grid") {
    return (
      <div className={cn("space-y-6 p-6 max-w-7xl mx-auto", className)}>
        {/* Header & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52 rounded-xl" />
            <Skeleton className="h-4 w-72 rounded-lg" />
          </div>
          <SkeletonButton size="md" />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ─── 6. Form / Settings Skeleton ──────────────────────────────────
  if (type === "form" || type === "settings") {
    return (
      <div className={cn("space-y-6 p-6 max-w-5xl mx-auto", className)}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>

        {/* Nav Tabs Skeleton */}
        <div className="flex gap-3 border-b border-border/60 pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28 rounded-lg" />
          ))}
        </div>

        <SkeletonForm fields={6} />
      </div>
    );
  }

  // ─── 7. Chat / Copilot Skeleton ────────────────────────────────────
  if (type === "chat" || type === "copilot") {
    return (
      <div className={cn("p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)]", className)}>
        {/* Chat Sidebar */}
        <div className="lg:col-span-4 border border-border/60 rounded-2xl p-4 bg-card/30 space-y-4 hidden lg:block">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/40 flex items-center gap-3">
                <SkeletonAvatar size="sm" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Feed */}
        <div className="lg:col-span-8 h-full">
          <SkeletonChat className="h-full" />
        </div>
      </div>
    );
  }

  // ─── 8. Pricing Skeleton ───────────────────────────────────────────
  if (type === "pricing") {
    return (
      <div className={cn("min-h-screen bg-background p-6 space-y-12 max-w-7xl mx-auto pt-24", className)}>
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <SkeletonBadge className="mx-auto h-7 w-32" />
          <Skeleton className="h-12 w-3/4 mx-auto rounded-2xl" />
          <Skeleton className="h-4 w-1/2 mx-auto rounded-lg" />
          {/* Toggle button */}
          <Skeleton className="h-11 w-48 mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "p-8 rounded-3xl border border-border/60 bg-card/40 space-y-6 shadow-xs backdrop-blur-xs animate-skeleton-shimmer",
                i === 1 && "border-amber-500/30 bg-amber-500/5"
              )}
            >
              <Skeleton className="h-6 w-28 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-xl" />
              <SkeletonText lines={2} />
              <SkeletonButton size="lg" className="w-full" />
              <div className="space-y-3 pt-4 border-t border-border/50">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <Skeleton className="h-4 flex-1 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── 9. Analytics Skeleton ─────────────────────────────────────────
  if (type === "analytics") {
    return (
      <div className={cn("space-y-8 p-6 max-w-7xl mx-auto", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <SkeletonButton size="md" />
          </div>
        </div>

        <StatGridSkeleton count={4} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonChart type="line" />
          </div>
          <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4 animate-skeleton-shimmer">
            <Skeleton className="h-6 w-36 rounded-xl" />
            <div className="space-y-4 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                  <div className="flex items-center gap-3">
                    <SkeletonAvatar size="sm" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-12 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── 10. Partner Portal Skeleton ────────────────────────────────────
  if (type === "partners") {
    return (
      <div className={cn("space-y-8 p-6 max-w-7xl mx-auto", className)}>
        <div className="p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-card to-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-skeleton-shimmer">
          <div className="space-y-3">
            <SkeletonBadge />
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 rounded-lg" />
          </div>
          <SkeletonButton size="lg" />
        </div>

        <StatGridSkeleton count={4} />
        <SkeletonTable rows={5} columns={4} />
      </div>
    );
  }

  // ─── Default Dashboard Skeleton ─────────────────────────────────────
  return (
    <div className={cn("space-y-8 p-6 max-w-7xl mx-auto", className)}>
      {/* Top Bar Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-52 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-40 rounded-xl" />
          <SkeletonButton size="md" />
        </div>
      </div>

      {/* KPI Stats */}
      <StatGridSkeleton count={4} />

      {/* Main Chart and Recent List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonChart type="line" />
        </div>
        <div className="p-6 rounded-2xl border border-border/60 bg-card/40 space-y-4 animate-skeleton-shimmer">
          <Skeleton className="h-6 w-36 rounded-xl" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size="sm" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
                <SkeletonBadge />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
