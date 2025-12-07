import React, { useState, ErrorInfo, useEffect, Component } from 'react';
import { Screen, UserAccount, AppConfig, Testimonial, ChatHistoryItem } from './types';
import { MOCK_TESTIMONIALS } from './constants';
import BootSequence from './components/BootSequence';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Home from './screens/Home';
import Login from './screens/Login';
import Terminal from './screens/Terminal';
import AdminPanel from './screens/AdminPanel';
import Testimonials from './screens/Testimonials';
import About from './screens/About';
import History from './screens/History';
import { initializeGemini } from './services/geminiService';

// --- ERROR BOUNDARY COMPONENT ---
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null
    };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("App Crash:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 bg-black text-red-500 font-mono p-4 md:p-8 overflow-auto z-50 flex flex-col items-center justify-center text-center">
                    <div className="max-w-2xl w-full border border-red-800 p-6 bg-gray-900/90 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                        <h1 className="text-xl md:text-3xl font-bold mb-4 border-b border-red-500 pb-2 animate-pulse">SYSTEM FAILURE (CRITICAL)</h1>
                        <p className="mb-4 text-white text-sm md:text-base">The application has encountered a fatal exception.</p>
                        
                        <div className="bg-black border border-red-900/50 p-4 mb-4 whitespace-pre-wrap text-left text-[10px] md:text-xs font-mono text-red-400 overflow-x-auto">
                            {this.state.error?.toString()}
                        </div>
                        
                        {this.state.error?.stack && (
                            <details className="text-left mb-6">
                                <summary className="cursor-pointer text-gray-500 text-xs hover:text-white mb-2">[VIEW STACK TRACE]</summary>
                                <pre className="text-[10px] text-gray-600 overflow-auto max-h-40 p-2 bg-black/50 border border-gray-800">
                                    {this.state.error?.stack}
                                </pre>
                            </details>
                        )}
                        
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-2 px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 font-pixel text-xs border border-white"
                        >
                            REBOOT SYSTEM
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// --- MAIN APP CONTENT ---
const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.BOOT);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  
  // App Global State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  
  const [config, setConfig] = useState<AppConfig>({
    maintenanceMode: false,
    featureVoice: false,
    featureImage: true,
    geminiKeys: [], // Initialize with empty array
    deepseekKey: ''
  });

  // Sync config with services when it changes
  useEffect(() => {
    // Only initialize if we have keys or explicitly want to refresh
    initializeGemini(config.geminiKeys);
  }, [config.geminiKeys]);

  const handleBootComplete = () => {
    // Always go to Home after boot to ensure clean state
    setCurrentScreen(Screen.HOME);
  };

  const handleLogin = (user: UserAccount | 'ADMIN') => {
    if (user === 'ADMIN') {
        setCurrentUser(null); 
    } else {
        setCurrentUser(user);
    }
  };

  const addToHistory = (item: ChatHistoryItem) => {
    setChatHistory(prev => [item, ...prev]);
  };

  // Render View Switcher
  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.BOOT:
        return <BootSequence onComplete={handleBootComplete} />;
      case Screen.HOME:
        return <Home onNavigate={setCurrentScreen} />;
      case Screen.LOGIN:
        return <Login onNavigate={setCurrentScreen} onLogin={handleLogin} />;
      case Screen.TERMINAL:
        return (
            <Terminal 
                currentUser={currentUser} 
                onNavigate={setCurrentScreen} 
                config={config} 
                onAddToHistory={addToHistory}
            />
        );
      case Screen.ADMIN:
        return (
            <AdminPanel 
                onNavigate={setCurrentScreen} 
                config={config}
                setConfig={setConfig}
                testimonials={testimonials}
                setTestimonials={setTestimonials}
            />
        );
      case Screen.TESTIMONIALS:
        return <Testimonials onNavigate={setCurrentScreen} data={testimonials} />;
      case Screen.ABOUT:
        return <About onNavigate={setCurrentScreen} />;
      case Screen.HISTORY:
        return <History onNavigate={setCurrentScreen} history={chatHistory} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  if (currentScreen === Screen.BOOT) {
      return <BootSequence onComplete={handleBootComplete} />;
  }

  // Determine Custom Title for Navbar
  const navbarTitle = (currentScreen === Screen.TERMINAL && currentUser?.aiName) 
    ? currentUser.aiName 
    : undefined;

  return (
    <Background>
      {currentScreen !== Screen.LOGIN && (
        <Navbar 
            onNavigate={setCurrentScreen} 
            currentScreen={currentScreen} 
            customTitle={navbarTitle}
            isLoggedIn={!!currentUser}
        />
      )}
      <main className="flex-1 flex flex-col relative w-full">
        {renderScreen()}
      </main>
    </Background>
  );
};

// --- APP WRAPPER ---
const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
};

export default App;