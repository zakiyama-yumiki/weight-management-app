import { LocalStorageData, WeightRecord, WeightGoal } from '../types';

const STORAGE_KEY = 'weight-management-app';
const CURRENT_VERSION = '1.0.0';

// デフォルトデータ
const getDefaultData = (): LocalStorageData => ({
  weightRecords: [],
  weightGoal: null,
  settings: {
    theme: 'light',
    notifications: false,
    height: 170, // デフォルト身長
  },
  version: CURRENT_VERSION,
});

// LocalStorageからデータを読み込み
export const loadData = (): LocalStorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getDefaultData();
    }

    const data = JSON.parse(stored) as LocalStorageData;
    
    // バージョンチェック（将来的なマイグレーション用）
    if (data.version !== CURRENT_VERSION) {
      console.warn('Data version mismatch. Using default data.');
      return getDefaultData();
    }

    return data;
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return getDefaultData();
  }
};

// LocalStorageにデータを保存
export const saveData = (data: LocalStorageData): void => {
  try {
    const dataToSave = {
      ...data,
      version: CURRENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    throw new Error('データの保存に失敗しました');
  }
};

// 体重記録を保存
export const saveWeightRecord = (record: WeightRecord): void => {
  const data = loadData();
  const existingIndex = data.weightRecords.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    // 既存レコードを更新
    data.weightRecords[existingIndex] = record;
  } else {
    // 新規レコードを追加
    data.weightRecords.push(record);
  }
  
  // 日付順でソート（新しい順）
  data.weightRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  saveData(data);
};

// 体重記録を削除
export const deleteWeightRecord = (recordId: string): void => {
  const data = loadData();
  data.weightRecords = data.weightRecords.filter(r => r.id !== recordId);
  saveData(data);
};

// 目標を保存
export const saveWeightGoal = (goal: WeightGoal): void => {
  const data = loadData();
  data.weightGoal = goal;
  saveData(data);
};

// 目標を削除
export const deleteWeightGoal = (): void => {
  const data = loadData();
  data.weightGoal = null;
  saveData(data);
};

// 設定を更新
export const updateSettings = (settings: Partial<LocalStorageData['settings']>): void => {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
};

// データをクリア（デバッグ用）
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
};

// データをエクスポート（将来的な機能用）
export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};

// データをインポート（将来的な機能用）
export const importData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData) as LocalStorageData;
    saveData(data);
  } catch (error) {
    console.error('Failed to import data:', error);
    throw new Error('無効なデータ形式です');
  }
};