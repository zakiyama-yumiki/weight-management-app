import React, { useState } from 'react';
import { useWeight } from '../contexts/WeightContext';
import WeightChart from '../components/Charts/WeightChart';
import { TimePeriod } from '../types';
import { 
  calculateStats, 
  calculateGoalProgress, 
  calculateRemainingWeight,
  calculateWeightTrend,
  formatDate as formatDateUtil
} from '../utils/calculations';

const Dashboard: React.FC = () => {
  const { weightRecords, weightGoal, getLatestRecord, loading } = useWeight();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  
  const latestRecord = getLatestRecord();
  const stats = weightRecords.length > 0 ? calculateStats(weightRecords, selectedPeriod) : null;
  const trend = weightRecords.length > 0 ? calculateWeightTrend(weightRecords) : 'stable';
  
  const goalProgress = weightGoal && latestRecord 
    ? calculateGoalProgress(latestRecord.weight, weightGoal.targetWeight, weightGoal.currentWeight)
    : 0;
  
  const remainingWeight = weightGoal && latestRecord
    ? calculateRemainingWeight(latestRecord.weight, weightGoal.targetWeight)
    : 0;
  
  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return '低体重';
    if (bmi < 25) return '普通体重';
    if (bmi < 30) return '肥満(1度)';
    return '肥満(2度以上)';
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
    }
  };
  
  const getTrendText = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing': return '増加傾向';
      case 'decreasing': return '減少傾向';
      case 'stable': return '安定';
    }
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
            {latestRecord ? `最新記録 (${formatDateUtil(latestRecord.date)})` : '記録なし'}
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
                weightGoal.isAchieved ? 'text-green-600' : 'text-blue-600'
              }`}>
                {weightGoal.isAchieved ? '達成済み！' : `あと ${remainingWeight} kg`}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>進捗率</span>
                <span>{Math.round(goalProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    goalProgress >= 100 ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, goalProgress))}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* グラフ表示 */}
      {weightRecords.length > 0 && (
        <div className="space-y-4">
          {/* 期間選択 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">グラフ表示期間</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'week' as TimePeriod, label: '1週間' },
                { value: 'month' as TimePeriod, label: '1ヶ月' },
                { value: 'halfYear' as TimePeriod, label: '6ヶ月' },
                { value: 'year' as TimePeriod, label: '1年' },
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* グラフコンポーネント */}
          <WeightChart 
            data={weightRecords} 
            period={selectedPeriod}
          />
        </div>
      )}

      {/* 統計情報 */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">期間別統計</h3>
            <span className="text-sm text-gray-500">
              {formatDateUtil(stats.startDate)} ~ {formatDateUtil(stats.endDate)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">記録数</p>
              <p className="text-xl font-bold text-blue-600">{stats.totalRecords}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">平均体重</p>
              <p className="text-xl font-bold text-green-600">{stats.averageWeight} kg</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">最大体重</p>
              <p className="text-xl font-bold text-orange-600">{stats.maxWeight} kg</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">最小体重</p>
              <p className="text-xl font-bold text-purple-600">{stats.minWeight} kg</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">変化量</p>
              <p className={`text-xl font-bold ${
                stats.weightChange > 0 ? 'text-red-600' : stats.weightChange < 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stats.weightChange > 0 ? '+' : ''}{stats.weightChange} kg
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">変化率</p>
              <p className={`text-xl font-bold ${
                stats.weightChangePercentage > 0 ? 'text-red-600' : stats.weightChangePercentage < 0 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {stats.weightChangePercentage > 0 ? '+' : ''}{stats.weightChangePercentage}%
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <span className="text-2xl">{getTrendIcon(trend)}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">現在の傾向</p>
              <p className="text-xs text-gray-600">{getTrendText(trend)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;