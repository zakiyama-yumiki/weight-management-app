import React from 'react';

const Goals: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">目標設定</h2>
        <p className="text-gray-600 mb-6">
          体重目標を設定して進捗を管理しましょう。
        </p>
        
        <div className="space-y-4">
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
              placeholder="例: 60.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              placeholder="例: 65.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            目標を設定
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">進捗状況</h3>
        <div className="text-center text-gray-500">
          目標が設定されていません
        </div>
      </div>
    </div>
  );
};

export default Goals;