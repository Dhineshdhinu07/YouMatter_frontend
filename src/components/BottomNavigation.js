import React from 'react';

const BottomNavigation = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      activeColor: 'text-blue-500'
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: '😊',
      activeColor: 'text-purple-500'
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: '📖',
      activeColor: 'text-green-500'
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: '🆘',
      activeColor: 'text-red-500'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      activeColor: 'text-indigo-500'
    }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
              currentScreen === item.id
                ? `${item.activeColor} bg-gray-50 transform scale-105`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;