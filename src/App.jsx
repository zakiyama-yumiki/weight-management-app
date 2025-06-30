import React, { useState } from 'react';
import { WeightProvider } from './contexts/WeightContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import WeightInput from './pages/WeightInput';
import History from './pages/History';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import './styles/global.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  const getPageTitle = (route) => {
    switch (route) {
      case 'dashboard':
        return '体重管理アプリ - ダッシュボード';
      case 'input':
        return '体重管理アプリ - 記録入力';
      case 'history':
        return '体重管理アプリ - 履歴';
      case 'goals':
        return '体重管理アプリ - 目標';
      case 'settings':
        return '体重管理アプリ - 設定';
      default:
        return '体重管理アプリ';
    }
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'input':
        return <WeightInput />;
      case 'history':
        return <History />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WeightProvider>
      <Layout
        title={getPageTitle(currentRoute)}
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
      >
        {renderCurrentPage()}
      </Layout>
    </WeightProvider>
  );
}

export default App;
