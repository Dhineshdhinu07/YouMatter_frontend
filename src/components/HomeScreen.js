import React, { useState, useEffect } from 'react';

const HomeScreen = ({ user }) => {
  const [greeting, setGreeting] = useState('');
  const [todayMood, setTodayMood] = useState(null);
  const [recentJournals, setRecentJournals] = useState([]);
  const [dailyAffirmation] = useState([
    "You are stronger than you think.",
    "Every day is a new opportunity to grow.",
    "Your feelings are valid and temporary.",
    "You deserve peace and happiness.",
    "Progress, not perfection, is the goal.",
    "You are worthy of love and care.",
    "Your mental health matters."
  ]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Load today's mood from localStorage
    const today = new Date().toDateString();
    const moods = JSON.parse(localStorage.getItem('youmatter_moods') || '[]');
    const todaysMood = moods.find(mood => new Date(mood.date).toDateString() === today);
    setTodayMood(todaysMood);

    // Load recent journal entries
    const journals = JSON.parse(localStorage.getItem('youmatter_journals') || '[]');
    setRecentJournals(journals.slice(-3).reverse());
  }, []);

  const getRandomAffirmation = () => {
    return dailyAffirmation[Math.floor(Math.random() * dailyAffirmation.length)];
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      calm: '😌',
      excited: '🤗',
      tired: '😴',
      stressed: '😵'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {greeting}, {user.name}! 👋
        </h1>
        <p className="text-gray-600">How are you feeling today?</p>
      </div>

      {/* Daily Affirmation Card */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-3 flex items-center">
          <span className="mr-2">✨</span>
          Daily Affirmation
        </h2>
        <p className="text-white text-lg italic">
          "{getRandomAffirmation()}"
        </p>
      </div>

      {/* Today's Mood Status */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💭</span>
          Today's Mood
        </h3>
        {todayMood ? (
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center">
              <span className="text-3xl mr-3">{getMoodEmoji(todayMood.mood)}</span>
              <div>
                <p className="font-medium text-gray-800 capitalize">{todayMood.mood}</p>
                <p className="text-sm text-gray-600">
                  {new Date(todayMood.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Recorded</p>
              <span className="text-green-500">✓</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl mb-3 block">🤔</span>
            <p className="text-gray-600 mb-3">Haven't tracked your mood today</p>
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition duration-200">
              Track Now
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="card-hover bg-blue-50 p-4 rounded-xl border border-blue-100 text-left">
            <span className="text-2xl block mb-2">📝</span>
            <p className="font-medium text-gray-800">Write Journal</p>
            <p className="text-sm text-gray-600">Express your thoughts</p>
          </button>
          <button className="card-hover bg-green-50 p-4 rounded-xl border border-green-100 text-left">
            <span className="text-2xl block mb-2">🧘</span>
            <p className="font-medium text-gray-800">Mindfulness</p>
            <p className="text-sm text-gray-600">Take a moment</p>
          </button>
        </div>
      </div>

      {/* Recent Journal Entries */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📚</span>
          Recent Thoughts
        </h3>
        {recentJournals.length > 0 ? (
          <div className="space-y-3">
            {recentJournals.map((journal, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-500">
                    {new Date(journal.date).toLocaleDateString()}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(journal.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {journal.content.length > 100 
                    ? journal.content.substring(0, 100) + '...' 
                    : journal.content
                  }
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl mb-3 block">📖</span>
            <p className="text-gray-600 mb-3">No journal entries yet</p>
            <p className="text-sm text-gray-500">Start writing to see your thoughts here</p>
          </div>
        )}
      </div>

      {/* Mental Health Resources */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🌱</span>
          Wellness Resources
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition duration-200 flex items-center">
            <span className="mr-3">🎧</span>
            <div>
              <p className="font-medium text-gray-800">Meditation Guide</p>
              <p className="text-sm text-gray-600">5-minute breathing exercise</p>
            </div>
          </button>
          <button className="w-full text-left p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition duration-200 flex items-center">
            <span className="mr-3">📞</span>
            <div>
              <p className="font-medium text-gray-800">Crisis Support</p>
              <p className="text-sm text-gray-600">24/7 mental health helpline</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;