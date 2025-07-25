import React, { useState } from 'react';

const EmergencyScreen = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  const emergencyContacts = [
    {
      id: 'suicide-prevention',
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7, free and confidential support',
      country: 'US',
      urgent: true
    },
    {
      id: 'crisis-text',
      name: 'Crisis Text Line',
      number: 'Text HOME to 741741',
      description: 'Free, 24/7 crisis support via text',
      country: 'US',
      urgent: true
    },
    {
      id: 'samhsa',
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information service',
      country: 'US',
      urgent: false
    },
    {
      id: 'emergency',
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate emergency assistance',
      country: 'US',
      urgent: true
    }
  ];

  const copingStrategies = [
    {
      title: 'Deep Breathing',
      description: 'Take slow, deep breaths for 2 minutes',
      icon: '🫁',
      steps: [
        'Sit comfortably and close your eyes',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat 5-10 times'
      ]
    },
    {
      title: '5-4-3-2-1 Grounding',
      description: 'Use your senses to stay present',
      icon: '🌟',
      steps: [
        'Name 5 things you can see',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste'
      ]
    },
    {
      title: 'Progressive Muscle Relaxation',
      description: 'Release physical tension',
      icon: '💪',
      steps: [
        'Start with your toes, tense for 5 seconds',
        'Release and notice the relaxation',
        'Move up to your calves, then thighs',
        'Continue with arms, shoulders, and face',
        'End with your whole body relaxed'
      ]
    }
  ];

  const handleCallNumber = (number) => {
    // In a real app, this would initiate a phone call
    if (number.includes('Text')) {
      alert(`Open your messaging app and text HOME to 741741`);
    } else {
      window.location.href = `tel:${number.replace(/[^0-9]/g, '')}`;
    }
  };

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="mr-3">🆘</span>
          Emergency Support
        </h1>
        <p className="text-gray-600">You're not alone. Help is available 24/7.</p>
      </div>

      {/* Crisis Warning */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
        <div className="flex items-start">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800 mb-2">If you're in immediate danger:</h3>
            <p className="text-red-700 text-sm mb-3">
              Call emergency services immediately or go to your nearest emergency room.
            </p>
            <button
              onClick={() => handleCallNumber('911')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition duration-200 emergency-pulse"
            >
              Call 911 Now
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📞</span>
          Crisis Support Hotlines
        </h2>
        <div className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                contact.urgent
                  ? 'bg-red-50 border-red-200 hover:border-red-300'
                  : 'bg-blue-50 border-blue-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                {contact.urgent && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    24/7
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">{contact.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-semibold text-gray-800">
                  {contact.number}
                </span>
                <button
                  onClick={() => handleCallNumber(contact.number)}
                  className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                    contact.urgent
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {contact.number.includes('Text') ? 'Send Text' : 'Call Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Coping Strategies */}
      <div className="mb-8">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🧘</span>
          Immediate Coping Strategies
        </h2>
        <div className="space-y-4">
          {copingStrategies.map((strategy, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setSelectedContact(selectedContact === index ? null : index)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl transition duration-200"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{strategy.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{strategy.title}</h3>
                    <p className="text-sm text-gray-600">{strategy.description}</p>
                  </div>
                </div>
                <span className={`transform transition-transform duration-200 ${
                  selectedContact === index ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              
              {selectedContact === index && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-3">Steps to follow:</h4>
                    <ol className="space-y-2">
                      {strategy.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-700 flex items-start">
                          <span className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safety Plan */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🛡️</span>
          Create a Safety Plan
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start">
            <span className="mr-3">1️⃣</span>
            <p>Identify your personal warning signs and triggers</p>
          </div>
          <div className="flex items-start">
            <span className="mr-3">2️⃣</span>
            <p>List coping strategies you can use on your own</p>
          </div>
          <div className="flex items-start">
            <span className="mr-3">3️⃣</span>
            <p>Identify trusted friends or family you can talk to</p>
          </div>
          <div className="flex items-start">
            <span className="mr-3">4️⃣</span>
            <p>Know professional contacts and crisis lines</p>
          </div>
          <div className="flex items-start">
            <span className="mr-3">5️⃣</span>
            <p>Remove potential means of harm from your environment</p>
          </div>
        </div>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition duration-200">
          Learn More About Safety Planning
        </button>
      </div>

      {/* Encouragement */}
      <div className="mt-8 text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
        <span className="text-3xl block mb-3">💙</span>
        <h3 className="font-semibold text-gray-800 mb-2">You Matter</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          Your life has value and meaning. Even in the darkest moments, there is hope for healing and recovery. 
          You are stronger than you know, and you don't have to face this alone.
        </p>
      </div>
    </div>
  );
};

export default EmergencyScreen;