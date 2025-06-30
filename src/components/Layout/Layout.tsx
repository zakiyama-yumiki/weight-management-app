import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Navigation from './Navigation';
import { NavigationRoute } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  currentRoute: NavigationRoute;
  onRouteChange: (route: NavigationRoute) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  currentRoute,
  onRouteChange,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title={title} />
      <Navigation currentRoute={currentRoute} onRouteChange={onRouteChange} />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;