import React, { useState, useEffect } from 'react';

const JournalScreen = ({ user }) => {
  const [journalContent, setJournalContent] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load journal entries from localStorage
    const savedJournals = JSON.parse(localStorage.getItem('youmatter_journals') || '[]');
    setJournalEntries(savedJournals);
  }, []);

  const handleSaveJournal = async () => {
    if (!journalContent.trim()) return;
    
    setIsSaving(true);
    
    const journalEntry = {
      id: Date.now(),
      content: journalContent.trim(),
      date: new Date().toISOString(),
      userId: user.id,
      wordCount: journalContent.trim().split(/\s+/).length
    };

    // Save to localStorage
    const existingJournals = JSON.parse(localStorage.getItem('youmatter_journals') || '[]');
    const updatedJournals = [...existingJournals, journalEntry];
    localStorage.setItem('youmatter_journals', JSON.stringify(updatedJournals));
    
    // Update local state
    setJournalEntries(updatedJournals);
    
    // Reset form
    setTimeout(() => {
      setIsSaving(false);
      setJournalContent('');
    }, 1000);
  };

  const handleDeleteEntry = (entryId) => {
    const updatedJournals = journalEntries.filter(entry => entry.id !== entryId);
    localStorage.setItem('youmatter_journals', JSON.stringify(updatedJournals));
    setJournalEntries(updatedJournals);
  };

  const filteredEntries = journalEntries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedEntries = showAllEntries ? filteredEntries : filteredEntries.slice(-5);

  const getJournalStats = () => {
    const totalEntries = journalEntries.length;
    const totalWords = journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const thisMonth = journalEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    }).length;

    return { totalEntries, totalWords, thisMonth };
  };

  const stats = getJournalStats();

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Journal</h1>
        <p className="text-gray-600">Express your thoughts and feelings</p>
      </div>

      {/* Journal Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Your Writing Journey
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.totalEntries}</p>
            <p className="text-xs text-gray-600">Total Entries</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalWords}</p>
            <p className="text-xs text-gray-600">Words Written</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.thisMonth}</p>
            <p className="text-xs text-gray-600">This Month</p>
          </div>
        </div>
      </div>

      {/* Writing Area */}
      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">✍️</span>
          Write Your Thoughts
        </h2>
        
        <div className="mb-4">
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            className="journal-textarea w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            rows="8"
            placeholder="What's on your mind today? Write about your thoughts, feelings, experiences, or anything that matters to you..."
          />
          
          {/* Word count */}
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>
              {journalContent.trim() ? journalContent.trim().split(/\s+/).length : 0} words
            </span>
            <span>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveJournal}
          disabled={!journalContent.trim() || isSaving}
          className="btn-primary w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <span className="mr-2">💾</span>
              Save Entry
            </>
          )}
        </button>
      </div>

      {/* Journal Entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📚</span>
            Your Entries
          </h3>
          {journalEntries.length > 5 && (
            <button
              onClick={() => setShowAllEntries(!showAllEntries)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              {showAllEntries ? 'Show Recent' : 'Show All'}
            </button>
          )}
        </div>

        {/* Search */}
        {journalEntries.length > 3 && (
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Search your entries..."
            />
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4 journal-scroll max-h-96 overflow-y-auto">
          {displayedEntries.reverse().map((entry) => (
            <div key={entry.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm card-hover">
              <div className="flex justify-between items-start mb-3">
                <div className="text-sm text-gray-500">
                  <span>{new Date(entry.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="mx-2">•</span>
                  <span>{entry.wordCount} words</span>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-400 hover:text-red-600 transition-colors duration-200"
                  title="Delete entry"
                >
                  🗑️
                </button>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                {entry.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {journalEntries.length === 0 && (
          <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl mb-4 block">📖</span>
            <h4 className="font-medium text-gray-800 mb-2">Start Your Journal</h4>
            <p className="text-gray-600 mb-4">Writing helps you process thoughts and emotions</p>
            <div className="text-sm text-gray-500">
              <p>✨ Express yourself freely</p>
              <p>🔒 Your entries are private</p>
              <p>💭 Reflect on your day</p>
            </div>
          </div>
        )}

        {/* Filtered results empty state */}
        {journalEntries.length > 0 && filteredEntries.length === 0 && searchTerm && (
          <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-2xl mb-3 block">🔍</span>
            <p className="text-gray-600">No entries found for "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-500 text-sm mt-2 hover:text-blue-600"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Writing Tips */}
      {journalEntries.length < 3 && (
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Writing Tips
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Write about what you're grateful for today</li>
            <li>• Describe a challenge you faced and how you handled it</li>
            <li>• Record your emotions without judgment</li>
            <li>• Set intentions for tomorrow</li>
            <li>• Note patterns in your thoughts and feelings</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JournalScreen;