import React from 'react';
import { NavigationRoute } from '../../types';

interface NavigationProps {
  currentRoute: NavigationRoute;
  onRouteChange: (route: NavigationRoute) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentRoute, onRouteChange }) => {
  const navItems = [
    { route: 'dashboard' as const, label: 'ダッシュボード', icon: '📊' },
    { route: 'input' as const, label: '記録入力', icon: '✏️' },
    { route: 'history' as const, label: '履歴', icon: '📋' },
    { route: 'goals' as const, label: '目標', icon: '🎯' },
    { route: 'settings' as const, label: '設定', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => onRouteChange(item.route)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                currentRoute === item.route
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;