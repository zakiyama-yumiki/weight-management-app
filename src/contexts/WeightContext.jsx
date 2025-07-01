import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loadData, 
  saveWeightRecord as saveRecord, 
  deleteWeightRecord as deleteRecord,
  saveWeightGoal as saveGoal,
  deleteWeightGoal as deleteGoal,
  updateSettings as updateSettingsData
} from '../utils/localStorage';
import { calculateBMI, generateId, getTodayString } from '../utils/calculations';

const WeightContext = createContext();

export const useWeight = () => {
  const context = useContext(WeightContext);
  if (!context) {
    throw new Error('useWeight must be used within a WeightProvider');
  }
  return context;
};

export const WeightProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
    setLoading(false);
  }, []);

  const addWeightRecord = (recordData) => {
    if (!data) return;

    const height = data.settings.height;
    const bmi = calculateBMI(parseFloat(recordData.weight), height);
    
    const newRecord = {
      id: generateId(),
      date: recordData.date,
      weight: parseFloat(recordData.weight),
      bodyFatPercentage: recordData.bodyFatPercentage ? parseFloat(recordData.bodyFatPercentage) : undefined,
      muscleMass: recordData.muscleMass ? parseFloat(recordData.muscleMass) : undefined,
      bmi: bmi,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveRecord(newRecord);
    
    const updatedData = loadData();
    setData(updatedData);
  };

  const updateWeightRecord = (recordId, recordData) => {
    if (!data) return;

    const height = data.settings.height;
    const bmi = calculateBMI(parseFloat(recordData.weight), height);
    
    const updatedRecord = {
      id: recordId,
      date: recordData.date,
      weight: parseFloat(recordData.weight),
      bodyFatPercentage: recordData.bodyFatPercentage ? parseFloat(recordData.bodyFatPercentage) : undefined,
      muscleMass: recordData.muscleMass ? parseFloat(recordData.muscleMass) : undefined,
      bmi: bmi,
      createdAt: data.weightRecords.find(r => r.id === recordId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveRecord(updatedRecord);
    
    const updatedData = loadData();
    setData(updatedData);
  };

  const removeWeightRecord = (recordId) => {
    deleteRecord(recordId);
    
    const updatedData = loadData();
    setData(updatedData);
  };

  const setWeightGoal = (goalData) => {
    let newGoal;
    
    if (goalData.id) {
      // 既存の目標を更新
      newGoal = {
        ...goalData,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 新規目標を作成
      newGoal = {
        id: generateId(),
        targetWeight: parseFloat(goalData.targetWeight),
        currentWeight: parseFloat(goalData.currentWeight),
        startDate: getTodayString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAchieved: false,
      };
    }

    saveGoal(newGoal);
    
    const updatedData = loadData();
    setData(updatedData);
  };

  const removeWeightGoal = () => {
    deleteGoal();
    
    const updatedData = loadData();
    setData(updatedData);
  };

  const updateSettings = (settings) => {
    updateSettingsData(settings);
    
    const updatedData = loadData();
    setData(updatedData);
  };

  const getLatestRecord = () => {
    if (!data || data.weightRecords.length === 0) return null;
    return data.weightRecords[0]; // データは既に日付順でソートされている
  };

  const value = {
    data,
    loading,
    weightRecords: data?.weightRecords || [],
    weightGoal: data?.weightGoal || null,
    settings: data?.settings || { theme: 'light', notifications: false, height: 170 },
    addWeightRecord,
    updateWeightRecord,
    removeWeightRecord,
    setWeightGoal,
    removeWeightGoal,
    updateSettings,
    getLatestRecord,
  };

  return (
    <WeightContext.Provider value={value}>
      {children}
    </WeightContext.Provider>
  );
};