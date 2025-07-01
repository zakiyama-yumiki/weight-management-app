import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { WeightRecord, TimePeriod } from '../../types';

interface WeightChartProps {
  data: WeightRecord[];
  period: TimePeriod;
  height?: number;
}

const WeightChart: React.FC<WeightChartProps> = ({ 
  data, 
  period, 
  height = 400 
}) => {
  // データの期間フィルタリング
  const getFilteredData = () => {
    if (data.length === 0) return [];

    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'halfYear':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data
      .filter(record => new Date(record.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(record => ({
        ...record,
        dateFormatted: new Date(record.date).toLocaleDateString('ja-JP', {
          month: '2-digit',
          day: '2-digit'
        })
      }));
  };

  const filteredData = getFilteredData();

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{`日付: ${new Date(data.date).toLocaleDateString('ja-JP')}`}</p>
          <p className="text-blue-600">{`体重: ${data.weight.toFixed(1)}kg`}</p>
          {data.bodyFatPercentage && (
            <p className="text-orange-600">{`体脂肪率: ${data.bodyFatPercentage.toFixed(1)}%`}</p>
          )}
          {data.muscleMass && (
            <p className="text-green-600">{`筋肉量: ${data.muscleMass.toFixed(1)}kg`}</p>
          )}
          <p className="text-purple-600">{`BMI: ${data.bmi.toFixed(1)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (filteredData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">体重推移グラフ</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          選択した期間にデータがありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">体重推移グラフ</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateFormatted" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              name="体重 (kg)"
            />
            {filteredData.some(d => d.bodyFatPercentage) && (
              <Line
                type="monotone"
                dataKey="bodyFatPercentage"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
                name="体脂肪率 (%)"
                yAxisId="right"
              />
            )}
            {filteredData.some(d => d.muscleMass) && (
              <Line
                type="monotone"
                dataKey="muscleMass"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="筋肉量 (kg)"
              />
            )}
            <Line
              type="monotone"
              dataKey="bmi"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              name="BMI"
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* グラフの説明 */}
      <div className="mt-4 text-sm text-gray-600">
        <p>期間: {
          period === 'week' ? '過去1週間' :
          period === 'month' ? '過去1ヶ月' :
          period === 'halfYear' ? '過去6ヶ月' :
          '過去1年'
        }</p>
        <p>データ数: {filteredData.length}件</p>
      </div>
    </div>
  );
};

export default WeightChart;