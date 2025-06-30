import { WeightRecord, WeightStats, TimePeriod } from '../types';

// BMI計算
export const calculateBMI = (weight: number, height: number): number => {
  if (height <= 0 || weight <= 0) return 0;
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

// BMI判定
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return '低体重';
  if (bmi < 25) return '普通体重';
  if (bmi < 30) return '肥満(1度)';
  if (bmi < 35) return '肥満(2度)';
  return '肥満(3度)';
};

// 日付範囲の取得
export const getDateRange = (period: TimePeriod): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'halfYear':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
  }

  return { startDate, endDate };
};

// 期間内のレコードをフィルタリング
export const filterRecordsByPeriod = (
  records: WeightRecord[],
  period: TimePeriod
): WeightRecord[] => {
  const { startDate, endDate } = getDateRange(period);
  
  return records.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

// 統計情報を計算
export const calculateStats = (
  records: WeightRecord[],
  period: TimePeriod
): WeightStats => {
  const filteredRecords = filterRecordsByPeriod(records, period);
  const { startDate, endDate } = getDateRange(period);

  if (filteredRecords.length === 0) {
    return {
      period,
      averageWeight: 0,
      weightChange: 0,
      weightChangePercentage: 0,
      maxWeight: 0,
      minWeight: 0,
      totalRecords: 0,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  const weights = filteredRecords.map(r => r.weight);
  const averageWeight = Math.round((weights.reduce((sum, w) => sum + w, 0) / weights.length) * 10) / 10;
  const maxWeight = Math.max(...weights);
  const minWeight = Math.min(...weights);

  // 変化量の計算（最新 - 最古）
  const sortedRecords = [...filteredRecords].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const oldestWeight = sortedRecords[0]?.weight || 0;
  const newestWeight = sortedRecords[sortedRecords.length - 1]?.weight || 0;
  const weightChange = Math.round((newestWeight - oldestWeight) * 10) / 10;
  const weightChangePercentage = oldestWeight > 0 ? Math.round((weightChange / oldestWeight) * 1000) / 10 : 0;

  return {
    period,
    averageWeight,
    weightChange,
    weightChangePercentage,
    maxWeight,
    minWeight,
    totalRecords: filteredRecords.length,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

// 目標達成率の計算
export const calculateGoalProgress = (
  currentWeight: number,
  targetWeight: number,
  startWeight: number
): number => {
  if (startWeight === targetWeight) return 100;
  
  const totalChange = targetWeight - startWeight;
  const currentChange = currentWeight - startWeight;
  
  const progress = (currentChange / totalChange) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// 目標まであと何kg必要かを計算
export const calculateRemainingWeight = (
  currentWeight: number,
  targetWeight: number
): number => {
  return Math.round(Math.abs(targetWeight - currentWeight) * 10) / 10;
};

// 日付をフォーマット
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 今日の日付を取得（YYYY-MM-DD形式）
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// ユニークIDの生成
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 体重の変化傾向を計算
export const calculateWeightTrend = (records: WeightRecord[]): 'increasing' | 'decreasing' | 'stable' => {
  if (records.length < 2) return 'stable';
  
  const sortedRecords = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recentRecords = sortedRecords.slice(-5); // 最新5件で判定
  
  if (recentRecords.length < 2) return 'stable';
  
  const firstWeight = recentRecords[0].weight;
  const lastWeight = recentRecords[recentRecords.length - 1].weight;
  const difference = lastWeight - firstWeight;
  
  if (Math.abs(difference) < 0.5) return 'stable';
  return difference > 0 ? 'increasing' : 'decreasing';
};