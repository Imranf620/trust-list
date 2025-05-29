import Navbar from "@/components/Navbar";
import Service from "@/components/Service";
import Image from "next/image";


const RelianceCashoutLogo = ({ width = 800, height = 300, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 800 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Blue gradient for main text */}
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4A90E2', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#2E5BBA', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1E3A8A', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Darker blue for shadow */}
        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1E40AF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0F172A', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Light blue for highlights */}
        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#93C5FD', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Shadow layer */}
      <g transform="translate(8,8)" opacity="0.3">
        <text 
          x="50" 
          y="80" 
          fontFamily="Arial Black, sans-serif" 
          fontSize="160" 
          fontWeight="900" 
          fill="url(#shadowGradient)" 
          letterSpacing="2px"
        >
          RELIANCE
        </text>
        <text 
          x="50" 
          y="140" 
          fontFamily="Arial Black, sans-serif" 
          fontSize="60" 
          fontWeight="900" 
          fill="url(#shadowGradient)" 
          letterSpacing="8px"
        >
          CASHOUT
        </text>
      </g>
      
      {/* Main text layer */}
      <g>
        <text 
          x="50" 
          y="80" 
          fontFamily="Arial Black, sans-serif" 
          fontSize="60" 
          fontWeight="900" 
          fill="url(#blueGradient)" 
          letterSpacing="2px" 
          stroke="url(#highlightGradient)" 
          strokeWidth="1"
        >
          RELIANCE
        </text>
        <text 
          x="50" 
          y="140" 
          fontFamily="Arial Black, sans-serif" 
          fontSize="32" 
          fontWeight="900" 
          fill="url(#blueGradient)" 
          letterSpacing="8px" 
          stroke="url(#highlightGradient)" 
          strokeWidth="0.5"
        >
          CASHOUT
        </text>
      </g>
      
      {/* 3D effect top highlights */}
      <g opacity="0.6">
        <text 
          x="48" 
          y="78" 
          fontFamily="Arial Black, sans-serif" 
          fontSize="60" 
          fontWeight="900" 
          fill="url(#highlightGradient)" 
          letterSpacing="2px" 
          opacity="0.5"
        >
          RELIANCE
        </text>
        <text 
          x="48" 
          y="138" 
          fontFamily="Arial Black, sans-serif" 
          fontSize="32" 
          fontWeight="900" 
          fill="url(#highlightGradient)" 
          letterSpacing="8px" 
          opacity="0.5"
        >
          CASHOUT
        </text>
      </g>
      
      {/* Decorative lines */}
      <line x1="50" y1="95" x2="350" y2="95" stroke="url(#blueGradient)" strokeWidth="3" opacity="0.8"/>
      <line x1="50" y1="155" x2="280" y2="155" stroke="url(#blueGradient)" strokeWidth="2" opacity="0.8"/>
      
      {/* Additional 3D depth lines */}
      <line x1="52" y1="93" x2="352" y2="93" stroke="url(#highlightGradient)" strokeWidth="1" opacity="0.6"/>
      <line x1="52" y1="153" x2="282" y2="153" stroke="url(#highlightGradient)" strokeWidth="1" opacity="0.6"/>
    </svg>
  );
};


// app/page.js
export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 items-center">
    <Navbar/>
    <RelianceCashoutLogo  />
    
   <Service/>
    </div>
  );
}
