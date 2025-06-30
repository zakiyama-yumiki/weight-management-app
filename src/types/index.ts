// 体重記録データの型定義
export interface WeightRecord {
  id: string;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  weight: number; // kg
  bodyFatPercentage?: number; // %
  muscleMass?: number; // kg
  bmi: number; // 自動計算
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

// 目標設定データの型定義
export interface WeightGoal {
  id: string;
  targetWeight: number; // kg
  currentWeight: number; // kg
  startDate: string; // ISO 8601 format
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  isAchieved: boolean;
  achievedAt?: string; // ISO 8601 format
}

// 統計情報の型定義
export interface WeightStats {
  period: 'week' | 'month' | 'halfYear' | 'year';
  averageWeight: number;
  weightChange: number; // 変化量 (kg)
  weightChangePercentage: number; // 変化率 (%)
  maxWeight: number;
  minWeight: number;
  totalRecords: number;
  startDate: string;
  endDate: string;
}

// グラフ表示用のデータ型
export interface ChartDataPoint {
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  bmi: number;
}

// LocalStorage用のデータ構造
export interface LocalStorageData {
  weightRecords: WeightRecord[];
  weightGoal: WeightGoal | null;
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
    height: number; // cm - BMI計算用
  };
  version: string; // データ構造のバージョン管理用
}

// フォーム入力用の型定義
export interface WeightRecordForm {
  weight: string;
  bodyFatPercentage: string;
  muscleMass: string;
  date: string;
}

export interface WeightGoalForm {
  targetWeight: string;
  currentWeight: string;
}

// APIレスポンス用の型定義（将来的な拡張用）
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// エラー処理用の型定義
export interface AppError {
  code: string;
  message: string;
  details?: string;
}

// 期間選択用の型定義
export type TimePeriod = 'week' | 'month' | 'halfYear' | 'year';

// ナビゲーション用の型定義
export type NavigationRoute = 'dashboard' | 'input' | 'history' | 'goals' | 'settings';