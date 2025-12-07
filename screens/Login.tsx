
import React, { useState } from 'react';
import { Screen, UserAccount } from '../types';
import { ADMIN_KEY } from '../constants';
import { verifyUserKey, checkSupabaseConnection, saveSession } from '../services/supabaseClient';

interface LoginProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (user: UserAccount | 'ADMIN') => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Admin Bypass
    if (keyInput === ADMIN_KEY) {
        setTimeout(() => {
            setIsLoading(false);
            onLogin('ADMIN');
            onNavigate(Screen.ADMIN);
        }, 800);
        return;
    }

    try {
        // First check connection
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
            setError('FATAL: Database Config Missing or Unreachable');
            setIsLoading(false);
            return;
        }

        // Verify against Supabase
        const user = await verifyUserKey(keyInput);
        
        if (user) {
            // Save Session to LocalStorage (Real-time session)
            saveSession(user);
            
            onLogin(user);
            onNavigate(Screen.TERMINAL);
        } else {
            setError('ACCESS DENIED: Invalid Key Protocol');
        }
    } catch (err: any) {
        console.error("Login Error:", err);
        setError(`SYSTEM ERROR: ${err.message || "Unknown Failure"}`);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-central-dark/95 p-1 pixel-border shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="border border-red-900/50 p-8 flex flex-col gap-6">
            <div className="text-center">
                <div className="inline-block bg-central-accent text-white font-pixel text-[10px] px-2 py-1 mb-2">SECURE GATEWAY</div>
                <h2 className="text-2xl font-bold font-pixel text-white pixel-text-shadow">
                LOGIN SYSTEM
                </h2>
                <p className="text-xs text-gray-500 font-mono mt-2">Enter Client Key or Dev Console ID</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 mt-4">
            <div className="relative group">
                <label className="block text-[10px] font-pixel text-central-accent mb-2 tracking-widest">ACCESS KEY</label>
                <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-black border-2 border-gray-800 text-white p-4 font-mono text-center tracking-[0.5em] focus:border-central-accent focus:outline-none focus:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all placeholder:tracking-normal"
                placeholder="XXXX-XXXX-XXXX"
                autoFocus
                disabled={isLoading}
                />
            </div>

            {error && (
                <div className="bg-red-900/20 border-l-4 border-red-500 text-red-400 p-3 text-xs font-mono flex items-center gap-2 animate-pulse break-words">
                <span>[!]</span> {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-central-secondary py-4 text-white font-bold font-pixel text-xs pixel-border transition-all hover:bg-red-600 active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
            >
                {isLoading ? 'AUTHENTICATING...' : 'ESTABLISH CONNECTION'}
            </button>
            </form>
            
            <div className="text-center pt-4 border-t border-gray-800">
                <button 
                    onClick={() => onNavigate(Screen.HOME)}
                    className="text-gray-500 text-xs hover:text-white font-mono hover:underline"
                >
                    ABORT SESSION
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
