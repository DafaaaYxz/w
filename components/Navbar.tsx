
import React, { useState } from 'react';
import { Screen } from '../types';

interface NavbarProps {
  onNavigate: (screen: Screen) => void;
  currentScreen: Screen;
  customTitle?: string;
  isLoggedIn: boolean; // Prop to know if user is logged in
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentScreen, customTitle, isLoggedIn, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const renderLogo = () => {
    if (customTitle) {
        // Aesthetic logic: If name ends with "GPT", color "GPT" red.
        if (customTitle.toUpperCase().endsWith('GPT')) {
            const mainPart = customTitle.substring(0, customTitle.length - 3);
            return (
                <>
                    {mainPart}
                    <span className="text-central-accent">GPT</span>
                </>
            );
        }
        // Otherwise return full name
        return <span className="text-white hover:text-central-accent transition-colors">{customTitle}</span>;
    }
    // Default Logo
    return <>Central<span className="text-central-accent">GPT</span></>;
  };

  const handleMobileNav = (screen: Screen) => {
    handleNavigation(screen);
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (targetScreen: Screen) => {
    // Logic: If trying to access TERMINAL but not logged in, go to LOGIN
    if (targetScreen === Screen.TERMINAL && !isLoggedIn) {
        onNavigate(Screen.LOGIN);
    } else {
        onNavigate(targetScreen);
    }
  };

  const MobileNavLink: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-full text-left py-3 px-4 border-l-4 font-pixel text-xs transition-all ${
        active 
          ? 'bg-red-900/30 border-central-accent text-white' 
          : 'border-transparent text-gray-400 hover:bg-gray-900 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav className="sticky top-0 z-40 bg-central-glass backdrop-blur-md border-b-2 border-black shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <div 
          onClick={() => onNavigate(Screen.HOME)}
          className="font-pixel text-lg md:text-2xl text-white cursor-pointer transition-colors pixel-text-shadow z-50 relative"
        >
          {renderLogo()}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
           <button 
             onClick={() => onNavigate(Screen.HOME)}
             className={`text-xs md:text-sm font-bold font-pixel hover:text-central-accent transition-all ${currentScreen === Screen.HOME ? 'text-central-accent underline decoration-2 underline-offset-4' : 'text-gray-300'}`}
           >
             HOME
           </button>
           
           {/* TERMINAL BUTTON */}
           <button 
             onClick={() => handleNavigation(Screen.TERMINAL)}
             className={`text-xs md:text-sm font-bold font-pixel hover:text-central-accent transition-all ${currentScreen === Screen.TERMINAL ? 'text-central-accent underline decoration-2 underline-offset-4' : 'text-gray-300'}`}
           >
             TERMINAL
           </button>

           <button 
             onClick={() => onNavigate(Screen.HISTORY)}
             className={`text-xs md:text-sm font-bold font-pixel hover:text-central-accent transition-all ${currentScreen === Screen.HISTORY ? 'text-central-accent underline decoration-2 underline-offset-4' : 'text-gray-300'}`}
           >
             HISTORY
           </button>
           <button 
             onClick={() => onNavigate(Screen.ABOUT)}
             className={`text-xs md:text-sm font-bold font-pixel hover:text-central-accent transition-all ${currentScreen === Screen.ABOUT ? 'text-central-accent underline decoration-2 underline-offset-4' : 'text-gray-300'}`}
           >
             ABOUT
           </button>
           {isLoggedIn && onLogout && (
               <button 
                 onClick={onLogout}
                 className="text-xs md:text-sm font-bold font-pixel text-red-500 hover:text-red-400 transition-all border border-red-900 px-2"
               >
                 LOGOUT
               </button>
           )}
        </div>

        <div className="flex items-center gap-4 z-50 relative">
            <div className="hidden md:block text-[10px] font-mono text-red-500 bg-black/80 px-2 py-1 border border-red-900 rounded">
                UPTIME: 20.000 JAM
            </div>
            
            {/* Mobile Menu Trigger */}
            <button 
                className="md:hidden text-white text-2xl p-2 focus:outline-none transition-transform active:scale-90" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? 'X' : '≡'}
            </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 border-b-2 border-central-accent shadow-2xl animate-fade-in flex flex-col z-30">
            <MobileNavLink 
                label="HOME" 
                active={currentScreen === Screen.HOME} 
                onClick={() => handleMobileNav(Screen.HOME)} 
            />
            <MobileNavLink 
                label="TERMINAL / CHAT" 
                active={currentScreen === Screen.TERMINAL} 
                onClick={() => handleMobileNav(Screen.TERMINAL)} 
            />
            <MobileNavLink 
                label="HISTORY LOGS" 
                active={currentScreen === Screen.HISTORY} 
                onClick={() => handleMobileNav(Screen.HISTORY)} 
            />
            <MobileNavLink 
                label="ABOUT DEV" 
                active={currentScreen === Screen.ABOUT} 
                onClick={() => handleMobileNav(Screen.ABOUT)} 
            />
            <MobileNavLink 
                label="TESTIMONIALS" 
                active={currentScreen === Screen.TESTIMONIALS} 
                onClick={() => handleMobileNav(Screen.TESTIMONIALS)} 
            />
            {!isLoggedIn ? (
                 <MobileNavLink 
                    label="LOGIN SYSTEM" 
                    active={currentScreen === Screen.LOGIN} 
                    onClick={() => handleMobileNav(Screen.LOGIN)} 
                />
            ) : (
                <MobileNavLink 
                    label="LOGOUT" 
                    active={false} 
                    onClick={() => {
                        if(onLogout) onLogout();
                        setIsMobileMenuOpen(false);
                    }} 
                />
            )}
            
            <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                <span className="text-[10px] font-mono text-red-500">SYS.UPTIME: 20.000 JAM</span>
                <span className="text-[10px] font-mono text-gray-600">v2.0</span>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
