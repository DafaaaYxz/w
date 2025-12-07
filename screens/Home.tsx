import React from 'react';
import { Screen } from '../types';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
      {/* Header Section */}
      <div className="max-w-4xl w-full z-10 pixel-box bg-central-glass/50 p-8 md:p-12">
        <h1 className="font-pixel text-3xl md:text-6xl text-white mb-2 pixel-text-shadow leading-tight tracking-tighter">
          Central<span className="text-central-accent">GPT</span>
        </h1>
        <h2 className="font-pixel text-lg md:text-2xl text-gray-300 mb-6 tracking-widest">
          WELCOME
        </h2>
        
        <div className="bg-black/40 border-l-4 border-central-accent p-6 mb-12 text-left max-w-2xl mx-auto backdrop-blur-sm">
          <p className="text-sm md:text-base text-gray-300 font-mono leading-relaxed">
            Selamat datang di CentralGPT. Platform AI canggih tanpa batasan yang dirancang untuk operasi tingkat tinggi. 
            Dikembangkan oleh <span className="text-central-accent font-bold">XdpzQ</span>.
            Silakan login untuk mengakses terminal atau lihat testimoni pengguna.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => onNavigate(Screen.LOGIN)}
            className="group relative px-8 py-4 bg-central-secondary text-white font-bold font-pixel text-xs md:text-sm pixel-border transition-all active:translate-y-1 hover:-translate-y-1 w-full md:w-64 hover:bg-red-600 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
          >
            START
          </button>
          
          <button
            onClick={() => onNavigate(Screen.TESTIMONIALS)}
            className="px-8 py-4 bg-gray-800 text-white font-bold font-pixel text-xs md:text-sm pixel-border transition-all active:translate-y-1 hover:-translate-y-1 w-full md:w-64 hover:bg-gray-700 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
          >
            TESTI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;