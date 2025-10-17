import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTranslation, getSupportedLanguages } from './ChatBotTranslations';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(() => {
    // Load saved language from localStorage or default to 'en'
    return localStorage.getItem('chatbot-language') || 'en';
  });
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  // Get translations for current language
  const t = getTranslation(language);
  const supportedLanguages = getSupportedLanguages();

  // Initialize welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: t.welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, [language, t.welcomeMessage]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('chatbot-language', newLanguage);
    setShowLanguageMenu(false);
  };

  // Predefined responses based on common queries (with multi-language support)
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Course-related queries (supports multiple language keywords)
    if (message.includes('course') || message.includes('learn') || message.includes('curso') || 
        message.includes('cours') || message.includes('kurs') || message.includes('पाठ्यक्रम') || 
        message.includes('课程')) {
      return t.responses.courses;
    }
    
    if (message.includes('subscription') || message.includes('pricing') || message.includes('price') ||
        message.includes('suscripción') || message.includes('abonnement') || message.includes('सदस्यता') ||
        message.includes('订阅')) {
      return t.responses.subscription;
    }

    if (message.includes('certificate') || message.includes('certification') || message.includes('certificado') ||
        message.includes('certificat') || message.includes('zertifikat') || message.includes('प्रमाणपत्र') ||
        message.includes('证书')) {
      return t.responses.certificate;
    }

    // Technical support
    if (message.includes('login') || message.includes('sign in') || message.includes('password') ||
        message.includes('iniciar sesión') || message.includes('connexion') || message.includes('लॉगिन') ||
        message.includes('登录')) {
      return t.responses.login;
    }

    if (message.includes('payment') || message.includes('billing') || message.includes('pago') ||
        message.includes('paiement') || message.includes('zahlung') || message.includes('भुगतान') ||
        message.includes('付款')) {
      return t.responses.payment;
    }

    // Platform features
    if (message.includes('live class') || message.includes('live session') || message.includes('clase en vivo') ||
        message.includes('cours en direct') || message.includes('लाइव कक्षा') || message.includes('直播课程')) {
      return t.responses.liveClass;
    }

    if (message.includes('recording') || message.includes('recorded') || message.includes('grabación') ||
        message.includes('enregistrement') || message.includes('रिकॉर्डिंग') || message.includes('录像')) {
      return t.responses.recording;
    }

    if (message.includes('internship') || message.includes('pasantía') || message.includes('stage') ||
        message.includes('praktikum') || message.includes('इंटर्नशिप') || message.includes('实习')) {
      return t.responses.internship;
    }

    if (message.includes('wallet') || message.includes('coin') || message.includes('reward') ||
        message.includes('billetera') || message.includes('portefeuille') || message.includes('वॉलेट') ||
        message.includes('钱包')) {
      return t.responses.wallet;
    }

    if (message.includes('refer') || message.includes('referral') || message.includes('referir') ||
        message.includes('parrainage') || message.includes('रेफर') || message.includes('推荐')) {
      return t.responses.referral;
    }

    // Learning support
    if (message.includes('help') || message.includes('support') || message.includes('assist') ||
        message.includes('ayuda') || message.includes('aide') || message.includes('hilfe') ||
        message.includes('सहायता') || message.includes('帮助')) {
      return t.responses.help;
    }

    if (message.includes('progress') || message.includes('track') || message.includes('progreso') ||
        message.includes('progrès') || message.includes('प्रगति') || message.includes('进度')) {
      return t.responses.progress;
    }

    // Greetings (multi-language)
    if (message.includes('hi') || message.includes('hello') || message.includes('hey') ||
        message.includes('hola') || message.includes('bonjour') || message.includes('hallo') ||
        message.includes('नमस्ते') || message.includes('你好')) {
      const userName = user ? (user.firstName || user.email?.split('@')[0]) : null;
      return typeof t.responses.greeting === 'function' 
        ? t.responses.greeting(userName)
        : t.responses.greeting;
    }

    if (message.includes('thank') || message.includes('thanks') || message.includes('gracias') ||
        message.includes('merci') || message.includes('danke') || message.includes('धन्यवाद') ||
        message.includes('谢谢')) {
      return t.responses.thanks;
    }

    if (message.includes('bye') || message.includes('goodbye') || message.includes('adiós') ||
        message.includes('au revoir') || message.includes('auf wiedersehen') || message.includes('अलविदा') ||
        message.includes('再见')) {
      return t.responses.goodbye;
    }

    // Default response
    return t.responses.default;
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action buttons (from translations)
  const quickActions = t.quickActionButtons;

  const handleQuickAction = (message) => {
    setInputValue(message);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-glow transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open chat"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="card-premium h-full flex flex-col shadow-2xl animate-slide-in-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{t.assistant}</h3>
                <p className="text-xs text-green-400">{t.online}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 text-lg"
                  aria-label="Select language"
                  title={t.selectLanguage}
                >
                  {t.flag}
                </button>
                
                {/* Language Dropdown */}
                {showLanguageMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[160px]">
                    <div className="py-1">
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/10 transition-colors ${
                            language === lang.code ? 'bg-white/20 text-white' : 'text-white/80'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Close chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-300"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions (shown when no messages) */}
            {messages.length === 1 && !isTyping && (
              <div className="space-y-2">
                <p className="text-xs text-white/60 text-center mb-3">{t.quickActions}</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.message)}
                      className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white transition-all duration-200 hover:scale-105"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.typePlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-200 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={inputValue.trim() === ''}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-white/40 text-center mt-2">
              {t.poweredBy}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 640px) {
          .w-\[380px\] {
            width: calc(100vw - 2rem);
          }
          .h-\[600px\] {
            height: calc(100vh - 2rem);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.25rem);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </>
  );
};

export default ChatBot;

