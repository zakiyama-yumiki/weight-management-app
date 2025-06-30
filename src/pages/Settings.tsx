import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">設定</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">基本設定</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  身長 (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  min="100"
                  max="250"
                  defaultValue="170"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">BMI計算に使用されます</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">表示設定</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                  ダークモード（開発予定）
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">データ管理</h3>
            <div className="space-y-4">
              <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                データをエクスポート（開発予定）
              </button>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                全データを削除（開発予定）
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;