import React, { useEffect, useState, useRef } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootCommands = [
      "pkg update && pkg upgrade",
      "loading libraries...",
      "[#] unpacking central_core.tar.gz...",
      "[#] verifying integrity... OK",
      "starting daemon...",
      "connecting to localhost:8080...",
      "access granted.",
      "initializing graphics engine...",
      "loading assets...",
      "mounting file system...",
      "decrypting user protocols...",
      "Checking dependencies...",
      "  - react... ok",
      "  - tailwind... ok",
      "  - gemini-api... connected",
      "booting CentralGPT kernel v2.0...",
      "SYSTEM READY"
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= bootCommands.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      
      const cmd = bootCommands[currentIndex];
      setLines(prev => [...prev, `root@central-gpt:~# ${cmd}`]);
      currentIndex++;

      // Auto scroll
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-white font-mono p-4 z-50 flex flex-col">
      <div className="flex-1 overflow-y-auto termux-scroll p-2" ref={containerRef}>
        <div className="mb-4 text-sm text-gray-400">
          Welcome to CentralGPT Terminal<br/>
          (c) 2025 XdpzQ Industries.<br/>
          <br/>
        </div>
        {lines.map((line, i) => (
          <div key={i} className="text-sm md:text-base break-all mb-1">
            <span className="text-green-500 mr-2">➜</span>
            {line}
          </div>
        ))}
        <div className="animate-blink mt-2 inline-block w-3 h-5 bg-white"></div>
      </div>
      
      {/* Footer fake keyboard suggestion bar for mobile feel */}
      <div className="h-10 bg-gray-900 border-t border-gray-700 flex items-center justify-around text-gray-400 text-xs font-mono">
        <span>ESC</span>
        <span>/</span>
        <span>-</span>
        <span>HOME</span>
        <span>UP</span>
        <span>DOWN</span>
        <span>ENTER</span>
      </div>
    </div>
  );
};

export default BootSequence;