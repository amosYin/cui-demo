
export type Unit = 'CNY' | '10K' | '100M';

export interface GlobalFilters {
  dateRange: [string, string];
  benchmark: string;
  unit: Unit;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change?: number;
  unit?: string;
  status?: 'success' | 'error' | 'default';
}

export interface AssetAllocationItem {
  type: string;
  value: number;
  percentage: number;
}

export interface PerformanceAttributionItem {
  category: string;
  allocationEffect: number;
  selectionEffect: number;
  interactionEffect: number;
}

export interface RiskIndicator {
  name: string;
  value: number;
  threshold: number;
  unit: string;
}
