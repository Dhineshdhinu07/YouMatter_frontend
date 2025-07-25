import React, { useState, useEffect } from 'react';
import './App.css';

// Component imports
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import HomeScreen from './components/HomeScreen';
import MoodTrackerScreen from './components/MoodTrackerScreen';
import JournalScreen from './components/JournalScreen';
import EmergencyScreen from './components/EmergencyScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNavigation from './components/BottomNavigation';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [showSignup, setShowSignup] = useState(false);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('youmatter_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentScreen('home');
    }
  }, []);

  // Handle user login
  const handleLogin = (email, password) => {
    // Mock authentication - in real app, this would validate against backend
    const user = {
      id: Date.now(),
      email: email,
      name: email.split('@')[0],
      joinedDate: new Date().toISOString()
    };
    
    localStorage.setItem('youmatter_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentScreen('home');
  };

  // Handle user signup
  const handleSignup = (email, password, name) => {
    // Mock signup - in real app, this would create account in backend
    const user = {
      id: Date.now(),
      email: email,
      name: name,
      joinedDate: new Date().toISOString()
    };
    
    localStorage.setItem('youmatter_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentScreen('home');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('youmatter_user');
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  // Render authentication screens
  if (!currentUser) {
    if (showSignup) {
      return (
        <SignupScreen 
          onSignup={handleSignup}
          onSwitchToLogin={() => setShowSignup(false)}
        />
      );
    }
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // Render main app screens
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen user={currentUser} />;
      case 'mood':
        return <MoodTrackerScreen user={currentUser} />;
      case 'journal':
        return <JournalScreen user={currentUser} />;
      case 'emergency':
        return <EmergencyScreen />;
      case 'profile':
        return <ProfileScreen user={currentUser} onLogout={handleLogout} />;
      default:
        return <HomeScreen user={currentUser} />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {/* Main content area */}
        <div className="pb-20">
          {renderCurrentScreen()}
        </div>
        
        {/* Bottom navigation */}
        <BottomNavigation 
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />
      </div>
    </div>
  );
}

export default App;