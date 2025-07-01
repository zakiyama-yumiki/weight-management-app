import React, { useState, useEffect } from 'react';
import { useWeight } from '../contexts/WeightContext';
import { calculateGoalProgress, calculateRemainingWeight, formatDate } from '../utils/calculations';

const Goals: React.FC = () => {
  const { weightGoal, getLatestRecord, setWeightGoal, removeWeightGoal } = useWeight();
  const [targetWeight, setTargetWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const latestRecord = getLatestRecord();

  useEffect(() => {
    if (latestRecord) {
      setCurrentWeight(latestRecord.weight.toString());
    }
    if (weightGoal) {
      setTargetWeight(weightGoal.targetWeight.toString());
    }
  }, [latestRecord, weightGoal]);

  useEffect(() => {
    // 目標達成チェック
    if (weightGoal && latestRecord && !weightGoal.isAchieved) {
      const isAchieved = 
        (weightGoal.targetWeight > weightGoal.currentWeight && latestRecord.weight >= weightGoal.targetWeight) ||
        (weightGoal.targetWeight < weightGoal.currentWeight && latestRecord.weight <= weightGoal.targetWeight);
      
      if (isAchieved) {
        setShowSuccess(true);
        // 達成状態を更新
        const updatedGoal = {
          ...weightGoal,
          isAchieved: true,
          achievedAt: new Date().toISOString()
        };
        setWeightGoal(updatedGoal);
      }
    }
  }, [latestRecord, weightGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetWeight || !currentWeight) {
      alert('目標体重と現在の体重を入力してください。');
      return;
    }

    const target = parseFloat(targetWeight);
    const current = parseFloat(currentWeight);

    if (target === current) {
      alert('目標体重と現在の体重が同じです。');
      return;
    }

    setWeightGoal({
      targetWeight: target.toString(),
      currentWeight: current.toString()
    });
  };

  const handleDelete = () => {
    if (window.confirm('目標を削除してもよろしいですか？')) {
      removeWeightGoal();
      setTargetWeight('');
      setCurrentWeight('');
    }
  };

  const progress = weightGoal && latestRecord 
    ? calculateGoalProgress(latestRecord.weight, weightGoal.targetWeight, weightGoal.currentWeight)
    : 0;

  const remaining = weightGoal && latestRecord
    ? calculateRemainingWeight(latestRecord.weight, weightGoal.targetWeight)
    : 0;

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-scale-up">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">おめでとうございます！</h2>
              <p className="text-gray-700 mb-6">目標体重を達成しました！</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {!weightGoal ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">目標設定</h2>
          <p className="text-gray-600 mb-6">
            体重目標を設定して進捗を管理しましょう。
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-2">
                目標体重 (kg)
              </label>
              <input
                type="number"
                id="targetWeight"
                step="0.1"
                min="0"
                max="300"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="例: 60.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700 mb-2">
                現在の体重 (kg)
              </label>
              <input
                type="number"
                id="currentWeight"
                step="0.1"
                min="0"
                max="300"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="例: 65.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              目標を設定
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">現在の目標</h2>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-sm underline"
              >
                目標を削除
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">開始体重</p>
                <p className="text-2xl font-bold">{weightGoal.currentWeight} kg</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">目標体重</p>
                <p className="text-2xl font-bold text-blue-600">{weightGoal.targetWeight} kg</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">現在の体重</p>
                <p className="text-2xl font-bold text-green-600">
                  {latestRecord ? `${latestRecord.weight} kg` : '-- kg'}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">開始日</p>
              <p className="text-gray-800">{formatDate(weightGoal.startDate)}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">進捗状況</h3>
            
            {latestRecord ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">進捗率</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">目標まで</p>
                    <p className="text-xl font-bold">
                      {weightGoal.isAchieved ? '達成済み！' : `あと ${remaining} kg`}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">変化量</p>
                    <p className="text-xl font-bold">
                      {(latestRecord.weight - weightGoal.currentWeight).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                体重データがありません。体重を記録してください。
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Goals;