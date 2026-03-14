import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = ({ onLetsTalk }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  // Smooth scroll function
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveLink(href === '#home' ? '' : href.replace('#', ''));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
        ? 'bg-slate-950/90 border-slate-800 shadow-lg shadow-black/20'
        : 'bg-slate-950/70 border-transparent'
        } backdrop-blur`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3"
          onClick={() => scrollToSection('#home')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="block text-base font-semibold text-white">Freelance.io</span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Portfolio</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeLink === link.href.replace('#', '')
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => onLetsTalk && onLetsTalk()}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-sky-400"
          >
            Let's Talk
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-200 transition-all hover:text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-1 border-t border-slate-800 bg-slate-950/95 px-4 py-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                scrollToSection(link.href);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition-all hover:bg-slate-900 hover:text-white"
            >
              <span>{link.name}</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          ))}

          <div className="pt-3">
            <button
              onClick={() => {
                onLetsTalk && onLetsTalk();
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-500/20 transition-all hover:bg-sky-400"
            >
              <Sparkles className="w-4 h-4" />
              Let's Talk
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
