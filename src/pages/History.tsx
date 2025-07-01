import React, { useState } from 'react';
import { useWeight } from '../contexts/WeightContext';
import { WeightRecord } from '../types';

const History: React.FC = () => {
  const { weightRecords, removeWeightRecord, updateWeightRecord, loading } = useWeight();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
    date: ''
  });
  const [sortBy, setSortBy] = useState<'date' | 'weight'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const handleDelete = (id: string) => {
    if (window.confirm('この記録を削除しますか？')) {
      removeWeightRecord(id);
    }
  };

  const handleEdit = (record: WeightRecord) => {
    setEditingId(record.id);
    setEditForm({
      weight: record.weight.toString(),
      bodyFatPercentage: record.bodyFatPercentage?.toString() || '',
      muscleMass: record.muscleMass?.toString() || '',
      date: record.date
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    updateWeightRecord(editingId, {
      weight: editForm.weight,
      bodyFatPercentage: editForm.bodyFatPercentage,
      muscleMass: editForm.muscleMass,
      date: editForm.date
    });
    
    setEditingId(null);
    setEditForm({
      weight: '',
      bodyFatPercentage: '',
      muscleMass: '',
      date: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      weight: '',
      bodyFatPercentage: '',
      muscleMass: '',
      date: ''
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // フィルタリングとソート処理
  const getFilteredAndSortedRecords = () => {
    let filtered = [...weightRecords];

    // 日付フィルタ
    if (dateFilter.startDate) {
      filtered = filtered.filter(record => record.date >= dateFilter.startDate);
    }
    if (dateFilter.endDate) {
      filtered = filtered.filter(record => record.date <= dateFilter.endDate);
    }

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'weight') {
        comparison = a.weight - b.weight;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const filteredRecords = getFilteredAndSortedRecords();

  const handleSort = (field: 'date' | 'weight') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: 'date' | 'weight') => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
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
        <h2 className="text-xl font-semibold mb-4">記録履歴</h2>
        <p className="text-gray-600 mb-4">
          過去の体重記録の履歴を表示します。
        </p>
        
        {/* フィルタ・ソートコントロール */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ソート項目</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'weight')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="date">日付</option>
              <option value="weight">体重</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ソート順</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="desc">降順</option>
              <option value="asc">昇順</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  日付 {getSortIcon('date')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('weight')}
                >
                  体重 (kg) {getSortIcon('weight')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  体脂肪率 (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  筋肉量 (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BMI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {weightRecords.length === 0 ? '記録データがありません' : 'フィルタ条件に一致するデータがありません'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    {editingId === record.id ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.weight}
                            onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.bodyFatPercentage}
                            onChange={(e) => setEditForm({...editForm, bodyFatPercentage: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            placeholder="未入力"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            step="0.1"
                            value={editForm.muscleMass}
                            onChange={(e) => setEditForm({...editForm, muscleMass: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            placeholder="未入力"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.bmi.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-900"
                          >
                            保存
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            キャンセル
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.weight.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.bodyFatPercentage ? record.bodyFatPercentage.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.muscleMass ? record.muscleMass.toFixed(1) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.bmi.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(record)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            削除
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {weightRecords.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            総記録数: {weightRecords.length}件
            {filteredRecords.length !== weightRecords.length && (
              <span className="ml-2">（表示中: {filteredRecords.length}件）</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;