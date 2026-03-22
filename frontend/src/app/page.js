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
      className="flex-1 flex flex-col items-center justify-center px-8 bg-[#1a1a1a] relative overflow-hidden text-center cursor-pointer"
      onClick={() => router.push('/login')}
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary blur-[80px] opacity-30 rounded-full"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-primary blur-[80px] opacity-20 rounded-full"></div>

      <div 
        className={`w-full transform transition-all duration-1000 ease-in-out flex flex-col items-center z-10 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="mb-8 bg-white/10 p-5 rounded-3xl backdrop-blur-md shadow-2xl">
          {/* Splash Logo */}
          <svg className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(255,56,92,0.8)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
          Streamline your <br/><span className="text-primary">Digital Talent</span>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-gray-400 font-medium">
          The modern platform to recruit, manage, and empower your workforce
        </p>
        
        <div className="mt-12 w-full">
          <Button fullWidth onClick={(e) => { e.stopPropagation(); router.push('/login'); }}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
