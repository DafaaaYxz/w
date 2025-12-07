
import React from 'react';
import { Screen, Testimonial } from '../types';

interface TestimonialsProps {
  onNavigate: (screen: Screen) => void;
  data: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ onNavigate, data }) => {
  return (
    <div className="flex-1 container mx-auto p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-4xl font-pixel text-white pixel-text-shadow">TESTIMONI</h1>
            <button onClick={() => onNavigate(Screen.HOME)} className="bg-central-secondary px-4 py-2 font-pixel text-xs text-white pixel-border hover:bg-red-700">BACK</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(testi => (
                <div key={testi.id} className="bg-central-glass border border-gray-800 p-4 pixel-border hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                    {testi.imageData ? (
                        <div className="mb-4 rounded-sm overflow-hidden border border-gray-700 bg-black">
                             <img src={testi.imageData} alt="proof" className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition-opacity" />
                        </div>
                    ) : (
                        <div className="mb-4 h-48 bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-600 font-mono text-xs">
                            [NO IMAGE DATA]
                        </div>
                    )}
                    <div className="flex-1 bg-black/40 p-3 border-l-2 border-central-accent">
                        <p className="text-gray-300 text-sm font-mono italic">"{testi.text}"</p>
                    </div>
                </div>
            ))}
        </div>
        
        {data.length === 0 && (
            <div className="text-center text-gray-500 font-mono mt-10">
                NO TESTIMONIALS UPLOADED YET.
            </div>
        )}
    </div>
  );
};

export default Testimonials;
