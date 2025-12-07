import React from 'react';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative text-central-light font-sans selection:bg-central-accent selection:text-white">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{ backgroundImage: "url('https://neolabsofficial.my.id/img/IMG-20250717-WA0137.jpg')" }}
      />
      
      {/* Dark Overlay - slightly less opaque to show image better */}
      <div className="fixed inset-0 bg-central-dark/80 z-[-1]" />
      
      {/* Pixel Mesh Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[0] opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, #ff0000 1px, #ff0000 2px)`
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Background;