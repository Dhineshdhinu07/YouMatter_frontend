import React, { useState, useEffect } from 'react';

const ProfileScreen = ({ user, onLogout }) => {
  const [userStats, setUserStats] = useState({
    totalMoods: 0,
    totalJournals: 0,
    joinedDays: 0,
    streak: 0
  });
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    dailyReminders: true,
    moodReminders: true,
    journalReminders: false,
    darkMode: false
  });

  useEffect(() => {
    // Calculate user statistics
    const moods = JSON.parse(localStorage.getItem('youmatter_moods') || '[]');
    const journals = JSON.parse(localStorage.getItem('youmatter_journals') || '[]');
    
    const joinedDate = new Date(user.joinedDate);
    const today = new Date();
    const joinedDays = Math.floor((today - joinedDate) / (1000 * 60 * 60 * 24));
    
    // Calculate streak (consecutive days with activity)
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    while (streak < 30) { // Check last 30 days max
      const dateStr = currentDate.toDateString();
      const hasActivity = moods.some(mood => 
        new Date(mood.date).toDateString() === dateStr
      ) || journals.some(journal => 
        new Date(journal.date).toDateString() === dateStr
      );
      
      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setUserStats({
      totalMoods: moods.length,
      totalJournals: journals.length,
      joinedDays: joinedDays,
      streak: streak
    });

    // Load settings
    const savedSettings = JSON.parse(localStorage.getItem('youmatter_settings') || '{}');
    setSettings(prev => ({ ...prev, ...savedSettings }));
  }, [user]);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem('youmatter_settings', JSON.stringify(newSettings));
  };

  const handleExportData = () => {
    const moods = JSON.parse(localStorage.getItem('youmatter_moods') || '[]');
    const journals = JSON.parse(localStorage.getItem('youmatter_journals') || '[]');
    
    const exportData = {
      user: user,
      exportDate: new Date().toISOString(),
      moods: moods,
      journals: journals,
      settings: settings
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `youmatter-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.removeItem('youmatter_moods');
      localStorage.removeItem('youmatter_journals');
      localStorage.removeItem('youmatter_settings');
      setUserStats({
        totalMoods: 0,
        totalJournals: 0,
        joinedDays: userStats.joinedDays,
        streak: 0
      });
      alert('All data has been cleared.');
    }
  };

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-purple-100">{user.email}</p>
            <p className="text-purple-100 text-sm">
              Member since {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Achievement Badge */}
        <div className="bg-white bg-opacity-20 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg mr-2">🔥</span>
              <div>
                <p className="font-semibold">Current Streak</p>
                <p className="text-sm text-purple-100">{userStats.streak} days active</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{userStats.streak}</p>
              <p className="text-xs text-purple-100">days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Your Journey
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-500">😊</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{userStats.totalMoods}</p>
            <p className="text-sm text-gray-600">Moods Tracked</p>
          </div>
          <div className="text-center">
            <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-500">📖</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{userStats.totalJournals}</p>
            <p className="text-sm text-gray-600">Journal Entries</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-500">📅</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{userStats.joinedDays}</p>
            <p className="text-sm text-gray-600">Days Since Joining</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-500">🎯</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{userStats.streak}</p>
            <p className="text-sm text-gray-600">Active Streak</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">⚙️</span>
            Settings
          </h3>
          <span className={`transform transition-transform duration-200 ${
            showSettings ? 'rotate-180' : ''
          }`}>
            ▼
          </span>
        </button>

        {showSettings && (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800">Daily Reminders</p>
                <p className="text-sm text-gray-600">Get reminded to check in daily</p>
              </div>
              <button
                onClick={() => handleSettingChange('dailyReminders', !settings.dailyReminders)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.dailyReminders ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.dailyReminders ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800">Mood Reminders</p>
                <p className="text-sm text-gray-600">Reminders to track your mood</p>
              </div>
              <button
                onClick={() => handleSettingChange('moodReminders', !settings.moodReminders)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.moodReminders ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.moodReminders ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-gray-800">Journal Reminders</p>
                <p className="text-sm text-gray-600">Reminders to write in your journal</p>
              </div>
              <button
                onClick={() => handleSettingChange('journalReminders', !settings.journalReminders)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.journalReminders ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  settings.journalReminders ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💾</span>
          Data Management
        </h3>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl text-left hover:bg-blue-100 transition duration-200"
          >
            <div className="flex items-center">
              <span className="mr-3">📤</span>
              <div>
                <p className="font-medium text-gray-800">Export Your Data</p>
                <p className="text-sm text-gray-600">Download all your moods and journal entries</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={handleClearData}
            className="w-full p-3 bg-red-50 border border-red-200 rounded-xl text-left hover:bg-red-100 transition duration-200"
          >
            <div className="flex items-center">
              <span className="mr-3">🗑️</span>
              <div>
                <p className="font-medium text-gray-800">Clear All Data</p>
                <p className="text-sm text-gray-600">Permanently delete all your data</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">ℹ️</span>
          About YouMatter
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          YouMatter is your personal mental health companion designed to help you track your emotional wellbeing, 
          reflect through journaling, and access support when you need it most.
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Version 1.0.0</p>
          <p>Built with care for your mental health</p>
          <p>Your data is stored locally and remains private</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition duration-200 flex items-center justify-center mx-auto"
        >
          <span className="mr-2">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;