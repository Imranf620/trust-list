import Navbar from "@/components/Navbar";
import Service from "@/components/Service";
import Image from "next/image";


const RelianceCashoutLogo = ({ width = "100%", height = "100%", className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 800 150" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="50%" stopColor="#2E5BBA" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      <text 
        x="50" 
        y="100" 
        fontFamily="Arial Black, sans-serif" 
        fontSize="100" 
        fontWeight="900" 
        fill="url(#blueGradient)" 
        letterSpacing="4px"
      >
        RELIANCE
      </text>
    </svg>
  );
};


// app/page.js
export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 items-center">
    <Navbar/>
    <RelianceCashoutLogo className="w-[80%] h-auto max-w-screen" />

    
   <Service/>
    </div>
  );
}
