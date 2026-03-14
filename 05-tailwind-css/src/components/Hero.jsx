import React, { useState, useEffect } from 'react';
import { Linkedin, Github, ArrowDown, Sparkles, Code, Palette, Cpu } from 'lucide-react';
import profilePic from '../assets/profile.jpg';

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const roles = ['UI/UX Designer', 'Full Stack Developer', 'AI Automation Specialist'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section id="home" className="relative w-full overflow-hidden bg-slate-950 pt-28 pb-16">
      <div className="absolute inset-0">
        <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-[160px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-sky-400" />
              Enterprise-ready digital solutions
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Building refined digital experiences for ambitious teams.
            </h1>

            <p className="text-base text-slate-300 sm:text-lg">
              I'm Muhammad Haseeb, a UI/UX designer and full stack developer delivering
              reliable, design-led products. I help founders and enterprise teams ship
              modern platforms with clarity and speed.
            </p>

            <div className="text-sm text-slate-400">
              Current focus: <span className="font-semibold text-slate-100">{roles[currentRole]}</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/30 transition-all hover:bg-sky-400"
              >
                View Case Studies
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:text-white"
              >
                Schedule a Consultation
              </a>
            </div>

            <div className="grid gap-3 pt-4 sm:grid-cols-3">
              {[
                { icon: Palette, title: 'Design Strategy', desc: 'Research-led UI/UX' },
                { icon: Code, title: 'Engineering', desc: 'Full stack delivery' },
                { icon: Cpu, title: 'Automation', desc: 'AI-driven workflows' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <item.icon className="h-5 w-5 text-sky-400" />
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-slate-400">
              <span>Connect:</span>
              <a
                href="https://www.linkedin.com/in/muhammad-haseeb-bb8582397"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://github.com/FalconCode786"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-2 text-slate-300 transition-all hover:border-slate-600 hover:text-white"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
              <div className="overflow-hidden rounded-2xl border border-slate-800">
                <img src={profilePic} alt="Muhammad Haseeb" className="h-full w-full object-cover" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Projects Delivered', value: '50+' },
                  { label: 'Client Satisfaction', value: '98%' },
                  { label: 'Certifications', value: '3' },
                  { label: 'Response Time', value: '< 24h' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-sm font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
