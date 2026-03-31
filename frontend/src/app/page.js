"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Splash() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reveal text smoothly
    const fadeTimer = setTimeout(() => {
      setVisible(true);
    }, 100);

    // Auto redirect after 2s
    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div 
      className="h-[100vh] w-full flex flex-col items-center justify-center p-5 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden cursor-pointer"
      onClick={() => router.push('/login')}
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-primary blur-[100px] opacity-20 rounded-full"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-primary blur-[100px] opacity-15 rounded-full"></div>

      <div 
        className={`splash-container flex flex-col justify-center items-center max-w-[600px] mx-auto text-center z-10 
          transform transition-all duration-1000 ease-in-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-6 bg-white/5 p-4 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          {/* Splash Logo with Soft Glow */}
          <svg className="w-14 h-14 text-primary drop-shadow-[0_0_15px_rgba(255,56,92,0.6)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        
        <h1 className="text-[28px] md:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Streamline your <br/><span className="text-primary">Digital Talent</span>
        </h1>
        
        <p className="mt-4 text-[15px] leading-relaxed text-gray-400 font-medium px-4">
          The modern platform to recruit, manage, <br className="hidden md:block"/> and empower your workforce
        </p>
        
        <div className="mt-10">
          <Button 
            className="w-[180px] md:w-[220px] h-[50px] rounded-xl flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); router.push('/login'); }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
