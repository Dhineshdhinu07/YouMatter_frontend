import React, { useState, useEffect } from 'react';

const MoodTrackerScreen = ({ user }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-100 border-blue-300' },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-orange-100 border-orange-300' },
    { id: 'angry', label: 'Angry', emoji: '😠', color: 'bg-red-100 border-red-300' },
    { id: 'calm', label: 'Calm', emoji: '😌', color: 'bg-green-100 border-green-300' },
    { id: 'excited', label: 'Excited', emoji: '🤗', color: 'bg-pink-100 border-pink-300' },
    { id: 'tired', label: 'Tired', emoji: '😴', color: 'bg-gray-100 border-gray-300' },
    { id: 'stressed', label: 'Stressed', emoji: '😵', color: 'bg-purple-100 border-purple-300' }
  ];

  useEffect(() => {
    // Load mood history from localStorage
    const savedMoods = JSON.parse(localStorage.getItem('youmatter_moods') || '[]');
    setMoodHistory(savedMoods);
  }, []);

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    const moodEntry = {
      id: Date.now(),
      mood: selectedMood,
      notes: notes,
      date: new Date().toISOString(),
      userId: user.id
    };

    // Save to localStorage
    const existingMoods = JSON.parse(localStorage.getItem('youmatter_moods') || '[]');
    const updatedMoods = [...existingMoods, moodEntry];
    localStorage.setItem('youmatter_moods', JSON.stringify(updatedMoods));
    
    // Update local state
    setMoodHistory(updatedMoods);
    
    // Reset form
    setTimeout(() => {
      setIsSubmitting(false);
      setSelectedMood('');
      setNotes('');
      // Show success message or navigate
    }, 1000);
  };

  const getMoodStats = () => {
    const last7Days = moodHistory.filter(mood => {
      const moodDate = new Date(mood.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate >= weekAgo;
    });

    const moodCounts = {};
    last7Days.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    const mostCommon = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'happy'
    );

    return { last7Days: last7Days.length, mostCommon };
  };

  const stats = getMoodStats();

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Mood Tracker</h1>
        <p className="text-gray-600">How are you feeling right now?</p>
      </div>

      {/* Mood Selection */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">😊</span>
          Select Your Mood
        </h2>
        <div className="grid grid-cols-2 gap-4 mood-grid">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`mood-option p-4 border-2 rounded-xl transition-all duration-200 ${
                selectedMood === mood.id 
                  ? `${mood.color} selected border-2 shadow-lg` 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl block mb-2">{mood.emoji}</span>
              <p className="font-medium text-gray-700">{mood.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      {selectedMood && (
        <div className="mb-8">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📝</span>
            Add Notes (Optional)
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="journal-textarea w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows="4"
            placeholder="What's on your mind? Describe what's contributing to this mood..."
          />
        </div>
      )}

      {/* Submit Button */}
      {selectedMood && (
        <div className="mb-8">
          <button
            onClick={handleMoodSubmit}
            disabled={isSubmitting}
            className="btn-primary w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : null}
            {isSubmitting ? 'Saving...' : 'Save Mood'}
          </button>
        </div>
      )}

      {/* Mood Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Your Mood Journey
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.last7Days}</p>
            <p className="text-sm text-gray-600">Moods tracked</p>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl">{moods.find(m => m.id === stats.mostCommon)?.emoji || '😊'}</p>
            <p className="text-sm text-gray-600">Most common</p>
            <p className="text-xs text-gray-500">This week</p>
          </div>
        </div>
      </div>

      {/* Mood History Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition duration-200 flex items-center justify-between"
        >
          <span className="font-medium text-gray-800 flex items-center">
            <span className="mr-2">📈</span>
            View Mood History
          </span>
          <span className={`transform transition-transform duration-200 ${showHistory ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Mood History */}
      {showHistory && (
        <div className="space-y-3">
          {moodHistory.slice(-10).reverse().map((mood) => (
            <div key={mood.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {moods.find(m => m.id === mood.mood)?.emoji}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{mood.mood}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(mood.date).toLocaleDateString()} at{' '}
                      {new Date(mood.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              </div>
              {mood.notes && (
                <p className="text-gray-600 text-sm mt-2 pl-11">{mood.notes}</p>
              )}
            </div>
          ))}
          {moodHistory.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
              <span className="text-4xl mb-3 block">📊</span>
              <p className="text-gray-600">No mood history yet</p>
              <p className="text-sm text-gray-500">Start tracking to see your patterns</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTrackerScreen;