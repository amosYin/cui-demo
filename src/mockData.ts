
import dayjs from 'dayjs';

// Generate dates for the last 3 months
const generateDates = (count: number) => {
  const dates = [];
  for (let i = count; i >= 0; i--) {
    dates.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return dates;
};

const dates = generateDates(90);

export const mockNetValueData = dates.map((date, index) => {
  const base = 1.0;
  const trend = index * 0.002;
  const noise = (Math.random() - 0.5) * 0.05;
  const nv = base + trend + noise;
  const benchmarkBase = 1.0;
  const benchmarkTrend = index * 0.0015;
  const benchmarkNoise = (Math.random() - 0.5) * 0.03;
  const bnv = benchmarkBase + benchmarkTrend + benchmarkNoise;
  
  return {
    date,
    netValue: nv.toFixed(4),
    cumulativeReturn: ((nv - 1) * 100).toFixed(2),
    benchmarkNetValue: bnv.toFixed(4),
    benchmarkReturn: ((bnv - 1) * 100).toFixed(2),
  };
});

export const mockAssetAllocation = [
  { type: '现金', value: 15000000, percentage: 15 },
  { type: '股票', value: 45000000, percentage: 45 },
  { type: '债券', value: 30000000, percentage: 30 },
  { type: '基金', value: 10000000, percentage: 10 },
];

export const mockPerformanceAttribution = [
  { category: '股票', allocationEffect: 0.45, selectionEffect: 1.2, interactionEffect: 0.1 },
  { category: '债券', allocationEffect: 0.2, selectionEffect: 0.3, interactionEffect: -0.05 },
  { category: '基金', allocationEffect: -0.1, selectionEffect: 0.5, interactionEffect: 0.02 },
  { category: '现金', allocationEffect: 0.05, selectionEffect: 0, interactionEffect: 0 },
];

export const mockRiskIndicators = [
  { name: '杠杆率', value: 125.4, threshold: 140, unit: '%' },
  { name: '前十大集中度', value: 42.5, threshold: 50, unit: '%' },
  { name: '组合久期', value: 3.2, threshold: 5, unit: '年' },
  { name: '前五大行业占比', value: 35.8, threshold: 45, unit: '%' },
];

export const mockStockIndustry = [
  { industry: '食品饮料', weight: 12.5, benchmarkWeight: 10.2, allocation: 0.25, selection: 0.45 },
  { industry: '医药生物', weight: 15.2, benchmarkWeight: 12.5, allocation: 0.3, selection: -0.15 },
  { industry: '电子', weight: 10.8, benchmarkWeight: 11.5, allocation: -0.1, selection: 0.6 },
  { industry: '电力设备', weight: 8.5, benchmarkWeight: 9.2, allocation: -0.05, selection: 0.2 },
  { industry: '计算机', weight: 7.2, benchmarkWeight: 6.5, allocation: 0.15, selection: 0.35 },
  { industry: '银行', weight: 5.5, benchmarkWeight: 8.2, allocation: -0.4, selection: 0.1 },
];

export const mockBondTypes = [
  { type: '国债', value: 8000000, percentage: 26.7 },
  { type: '金融债', value: 12000000, percentage: 40.0 },
  { type: '次级债', value: 5000000, percentage: 16.7 },
  { type: '可转债', value: 3000000, percentage: 10.0 },
  { type: '其他', value: 2000000, percentage: 6.6 },
];

export const mockReports = [
  { id: 1, title: '组合日报 - 20260324', date: '2026-03-24', type: '日报' },
  { id: 2, title: '组合周报 - 2026W12', date: '2026-03-22', type: '周报' },
  { id: 3, title: '组合月报 - 202602', date: '2026-02-28', type: '月报' },
  { id: 4, title: '组合季报 - 2025Q4', date: '2025-12-31', type: '季报' },
];
