import React, { useState, useEffect } from 'react';
import { Linkedin, Github, ArrowDown, Sparkles, Code, Palette, Cpu } from 'lucide-react';
import profilePic from '../assets/profile.jpg';
import { useSiteContent } from '../hooks/useSiteContent';

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);

  const { content } = useSiteContent();
  const roles = content.hero.roles || [];
  const primaryRole = roles[currentRole] || roles[0] || content.hero.fallbackRole;

  useEffect(() => {
    if (roles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-neutral-950 pt-36 pb-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-6 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm text-neutral-300">{content.hero.badge}</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.05]">
              {content.hero.greeting}<br />
              <span className="text-red-600">{content.hero.firstName}</span><br />
              <span className="text-neutral-500">{content.hero.lastName}</span>
            </h1>

            {/* Role */}
            <div className="flex items-center">
              <span className="text-xl text-neutral-400">
                I am a <span className="text-white font-semibold">{primaryRole}</span>
                <span className="animate-pulse text-red-500">|</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-base text-neutral-400 leading-relaxed">
              {content.hero.description}
            </p>

            {/* Certifications */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-lg bg-blue-500">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">NAVTTC</p>
                  <p className="text-sm text-white font-medium">UI/UX Certified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-lg bg-purple-500">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">Scrimba</p>
                  <p className="text-sm text-white font-medium">Full Stack Certified</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-lg bg-orange-500">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase">Expert</p>
                  <p className="text-sm text-white font-medium">AI Automation</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-500">Connect:</span>
              <a href="https://www.linkedin.com/in/muhammad-haseeb-bb8582397" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-blue-500 transition-all text-sm">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a href="https://github.com/FalconCode786" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-purple-500 transition-all text-sm">
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-2">
              <a href="#work" className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/25">
                {content.hero.ctas.primaryLabel}
                <ArrowDown className="w-4 h-4" />
              </a>
              <a href="#contact" className="px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                {content.hero.ctas.secondaryLabel}
              </a>
            </div>
          </div>

          {/* Right Content - Profile Image with Animation */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Animated glowing rings */}
            <div className="absolute w-[500px] h-[500px] rounded-full border border-red-500/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[450px] h-[450px] rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />

            {/* Pulsing glow background */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-br from-red-600/40 via-purple-600/40 to-red-600/40 blur-3xl animate-pulse" />

            {/* Profile circle with hover animation */}
            <div className="relative w-[400px] h-[400px] rounded-full overflow-hidden border-2 border-white/10 group">
              {/* Image with scale animation on hover */}
              <img
                src={profilePic}
                alt="Muhammad Haseeb"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent" />

              {/* Rotating border gradient on hover */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow -z-10" style={{ animationDuration: '3s' }} />

              {/* Open to Work badge with bounce animation */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm animate-bounce">
                Open to Work
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
