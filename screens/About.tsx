import React from 'react';
import { Screen } from '../types';

interface AboutProps {
  onNavigate: (screen: Screen) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-2xl w-full bg-central-glass p-8 pixel-border text-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
        <h1 className="text-3xl font-pixel text-central-accent mb-6 pixel-text-shadow">ABOUT</h1>
        
        <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 mx-auto bg-black border-4 border-central-accent mb-4 flex items-center justify-center overflow-hidden relative z-10">
                <span className="font-pixel text-4xl text-white">X</span>
            </div>
            <div className="absolute top-2 left-2 w-full h-full border-2 border-red-500 z-0 translate-x-2 translate-y-2"></div>
            
            <h2 className="text-xl font-bold text-white font-mono mt-4">DEVELOPER: XdpzQ</h2>
            <p className="text-gray-400 text-sm">Full Stack Cyber Architect</p>
        </div>

        <div className="text-left space-y-4 font-mono text-sm text-gray-300 bg-black/40 p-6 rounded border border-gray-700">
            <p><span className="text-central-accent">&gt;</span> CentralGPT System Core v2.0</p>
            <p><span className="text-central-accent">&gt;</span> Language: TypeScript, React</p>
            <p><span className="text-central-accent">&gt;</span> Styling: Tailwind CSS (Custom Pixel Engine)</p>
            <p><span className="text-central-accent">&gt;</span> Engine: Google Gemini 2.5 Flash</p>
            <p><span className="text-central-accent">&gt;</span> Mission: Unrestricted Information Access</p>
        </div>

        <button 
            onClick={() => onNavigate(Screen.HOME)} 
            className="mt-8 px-6 py-2 bg-central-secondary text-white font-pixel text-xs pixel-border hover:bg-red-700 transition-colors"
        >
            RETURN TO HOME
        </button>
      </div>
    </div>
  );
};

export default About;