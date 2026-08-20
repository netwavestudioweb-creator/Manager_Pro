import { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onLoadingComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, hsl(222 47% 11%) 0%, hsl(221 83% 20%) 50%, hsl(222 47% 11%) 100%)',
      }}
    >
      {/* Road */}
      <div className="relative w-full max-w-2xl h-32 overflow-hidden">
        {/* Road surface */}
        <div 
          className="absolute bottom-8 left-0 right-0 h-4 bg-muted-foreground/30 rounded-full animate-road"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 30px, hsl(var(--warning)) 30px, hsl(var(--warning)) 60px)',
            backgroundSize: '100px 2px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-x',
          }}
        />
        
        {/* Car SVG */}
        <div className="animate-drive absolute bottom-10">
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Car body */}
            <path
              d="M20 35 L30 35 L35 20 L75 20 L85 35 L100 35 L100 45 L20 45 Z"
              fill="hsl(var(--primary))"
              className="drop-shadow-lg"
            />
            {/* Car roof */}
            <path
              d="M38 20 L42 8 L68 8 L72 20"
              fill="hsl(var(--primary))"
            />
            {/* Windows */}
            <path
              d="M40 18 L43 10 L55 10 L55 18 Z"
              fill="hsl(var(--info) / 0.7)"
            />
            <path
              d="M57 10 L67 10 L70 18 L57 18 Z"
              fill="hsl(var(--info) / 0.7)"
            />
            {/* Headlight */}
            <rect x="95" y="36" width="6" height="4" rx="1" fill="hsl(var(--warning))" className="animate-pulse-glow" />
            {/* Tail light */}
            <rect x="18" y="36" width="4" height="4" rx="1" fill="hsl(var(--destructive))" />
            
            {/* Front wheel */}
            <g className="animate-wheel" style={{ transformOrigin: '85px 45px' }}>
              <circle cx="85" cy="45" r="10" fill="hsl(var(--foreground))" />
              <circle cx="85" cy="45" r="6" fill="hsl(var(--muted))" />
              <circle cx="85" cy="45" r="2" fill="hsl(var(--foreground))" />
              {/* Wheel spokes */}
              <line x1="85" y1="39" x2="85" y2="51" stroke="hsl(var(--foreground))" strokeWidth="1" />
              <line x1="79" y1="45" x2="91" y2="45" stroke="hsl(var(--foreground))" strokeWidth="1" />
            </g>
            
            {/* Rear wheel */}
            <g className="animate-wheel" style={{ transformOrigin: '35px 45px' }}>
              <circle cx="35" cy="45" r="10" fill="hsl(var(--foreground))" />
              <circle cx="35" cy="45" r="6" fill="hsl(var(--muted))" />
              <circle cx="35" cy="45" r="2" fill="hsl(var(--foreground))" />
              {/* Wheel spokes */}
              <line x1="35" y1="39" x2="35" y2="51" stroke="hsl(var(--foreground))" strokeWidth="1" />
              <line x1="29" y1="45" x2="41" y2="45" stroke="hsl(var(--foreground))" strokeWidth="1" />
            </g>
          </svg>
        </div>
      </div>

      {/* Logo and text */}
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-extrabold text-primary-foreground mb-2 tracking-tight">
          Manager<span className="text-primary font-light">Pro</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
          <span className="ml-2 text-sm">Chargement en cours</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
