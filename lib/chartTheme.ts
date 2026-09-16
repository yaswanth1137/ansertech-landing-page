/**
 * Shared Recharts theme configuration for consistent dark-mode chart styling.
 *
 * Usage:
 *   import { chartColors, axisStyle, gridStyle, ChartTooltipContent } from '@/lib/chartTheme';
 *
 *   <XAxis {...axisStyle} />
 *   <CartesianGrid {...gridStyle} />
 *   <Tooltip content={<ChartTooltipContent />} />
 */

// ─── Color palette (matches CSS token --chart-1 … --chart-5) ────────

export const chartColors = {
  yellow:  '#F5CA3C',
  sky:     '#38BDF8',
  emerald: '#34D399',
  rose:    '#FB7185',
  violet:  '#A78BFA',
  amber:   '#F59E0B',
  cyan:    '#22D3EE',
} as const;

/** Ordered palette for multi-series charts */
export const palette = [
  chartColors.yellow,
  chartColors.sky,
  chartColors.emerald,
  chartColors.rose,
  chartColors.violet,
] as const;

// ─── Shared axis props ──────────────────────────────────────────────

export const axisStyle = {
  stroke: 'transparent',
  tick: { fill: '#71717A', fontSize: 11, fontFamily: 'Inter, sans-serif' },
  tickLine: false as const,
  axisLine: false as const,
};

// ─── Grid ───────────────────────────────────────────────────────────

export const gridStyle = {
  strokeDasharray: '3 3',
  stroke: '#1C1C1F',
  vertical: false as const,
};

// ─── Gradient helper ────────────────────────────────────────────────

export function areaGradientId(key: string) {
  return `gradient-${key}`;
}

/** SVG <defs> gradient stops for area charts */
export function areaGradientStops(color: string, opacity = 0.25) {
  return [
    { offset: '0%', stopColor: color, stopOpacity: opacity },
    { offset: '100%', stopColor: color, stopOpacity: 0 },
  ];
}
