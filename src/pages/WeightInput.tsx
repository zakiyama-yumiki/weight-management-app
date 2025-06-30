import React, { useState } from 'react';
import { useWeight } from '../contexts/WeightContext';
import { getTodayString } from '../utils/calculations';

const WeightInput = () => {
  const { addWeightRecord } = useWeight();
  const [formData, setFormData] = useState({
    weight: '',
    bodyFatPercentage: '',
    muscleMass: '',
    date: getTodayString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (!formData.weight || parseFloat(formData.weight) <= 0) {
        throw new Error('体重を正しく入力してください');
      }

      addWeightRecord(formData);
      
      setMessage('記録を保存しました！');
      setFormData({
        weight: '',
        bodyFatPercentage: '',
        muscleMass: '',
        date: getTodayString(),
      });
    } catch (error) {
      setMessage(error.message || '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">体重記録入力</h2>
        
        {message && (
          <div className={`p-4 rounded-md mb-4 ${
            message.includes('失敗') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              日付 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              体重 (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="300"
              required
              placeholder="例: 65.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="bodyFatPercentage" className="block text-sm font-medium text-gray-700 mb-2">
              体脂肪率 (%)
            </label>
            <input
              type="number"
              id="bodyFatPercentage"
              name="bodyFatPercentage"
              value={formData.bodyFatPercentage}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="100"
              placeholder="例: 20.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="muscleMass" className="block text-sm font-medium text-gray-700 mb-2">
              筋肉量 (kg)
            </label>
            <input
              type="number"
              id="muscleMass"
              name="muscleMass"
              value={formData.muscleMass}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="100"
              placeholder="例: 45.2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '保存中...' : '記録を保存'}
            </button>
            <button
              type="button"
              onClick={() => setFormData({
                weight: '',
                bodyFatPercentage: '',
                muscleMass: '',
                date: getTodayString(),
              })}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              リセット
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WeightInput;