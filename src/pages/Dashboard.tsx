import React from 'react';

const Dashboard: React.FC = () => {
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
          <p className="text-3xl font-bold text-blue-600">-- kg</p>
          <p className="text-sm text-gray-500 mt-1">最新記録</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">目標体重</h3>
          <p className="text-3xl font-bold text-green-600">-- kg</p>
          <p className="text-sm text-gray-500 mt-1">設定済み目標</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">BMI</h3>
          <p className="text-3xl font-bold text-orange-600">--</p>
          <p className="text-sm text-gray-500 mt-1">現在のBMI</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;