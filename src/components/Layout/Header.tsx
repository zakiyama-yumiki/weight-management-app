import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default Header;