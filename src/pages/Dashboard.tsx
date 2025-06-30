import React from 'react';
import { useWeight } from '../contexts/WeightContext';

const Dashboard: React.FC = () => {
  const { weightRecords, weightGoal, getLatestRecord, loading } = useWeight();
  
  const latestRecord = getLatestRecord();
  
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return '低体重';
    if (bmi < 25) return '普通体重';
    if (bmi < 30) return '肥満(1度)';
    return '肥満(2度以上)';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">ダッシュボード</h2>
        <p className="text-gray-600">
          体重管理の概要を表示します。グラフや統計情報が表示される予定です。
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">現在の体重</h3>
          <p className="text-3xl font-bold text-blue-600">
            {latestRecord ? `${latestRecord.weight.toFixed(1)} kg` : '-- kg'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {latestRecord ? `最新記録 (${formatDate(latestRecord.date)})` : '記録なし'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">目標体重</h3>
          <p className="text-3xl font-bold text-green-600">
            {weightGoal ? `${weightGoal.targetWeight.toFixed(1)} kg` : '-- kg'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {weightGoal ? '設定済み目標' : '目標未設定'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">BMI</h3>
          <p className="text-3xl font-bold text-orange-600">
            {latestRecord ? latestRecord.bmi.toFixed(1) : '--'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {latestRecord ? getBMICategory(latestRecord.bmi) : '記録なし'}
          </p>
        </div>
      </div>

      {/* 進捗状況 */}
      {weightGoal && latestRecord && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">目標達成状況</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>現在の体重</span>
              <span>{latestRecord.weight.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>目標体重</span>
              <span>{weightGoal.targetWeight.toFixed(1)} kg</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>目標まで</span>
              <span className={`${
                latestRecord.weight > weightGoal.targetWeight ? 'text-red-600' : 'text-green-600'
              }`}>
                {Math.abs(latestRecord.weight - weightGoal.targetWeight).toFixed(1)} kg
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, 
                    ((weightGoal.currentWeight - latestRecord.weight) / 
                     (weightGoal.currentWeight - weightGoal.targetWeight)) * 100
                  ))}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 統計情報 */}
      {weightRecords.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">記録統計</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{weightRecords.length}</p>
              <p className="text-sm text-gray-500">総記録数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {(weightRecords.reduce((sum, r) => sum + r.weight, 0) / weightRecords.length).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">平均体重 (kg)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(...weightRecords.map(r => r.weight)).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">最大体重 (kg)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {Math.min(...weightRecords.map(r => r.weight)).toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">最小体重 (kg)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;