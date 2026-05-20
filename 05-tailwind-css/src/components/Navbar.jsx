import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import logoPng from '../assets/logo.png';
import logoWebp from '../assets/logo.webp';

const Navbar = ({ onLetsTalk }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const navRef = useRef(null);

  // Smooth scroll function
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveLink(href === '#home' ? '' : href.replace('#', ''));
  };

  // Magnetic effect for buttons
  const handleMouseMove = (e) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translate(0, 0)';
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
    <nav className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Full-width wrapper with padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
        <div
          ref={navRef}
          className={`
            relative w-full
            rounded-[60px] 
            border border-white/10 
            transition-all duration-500 ease-out
            ${scrolled ? 'bg-neutral-900/95 backdrop-blur-xl shadow-2xl shadow-red-900/20' : 'bg-neutral-900/60 backdrop-blur-md'}
          `}
        >
          <div className="flex items-center justify-between px-6 py-4 md:px-10 md:py-5 lg:px-12">

            {/* Logo - Links to Hero/Home */}
            <div
              className="flex-shrink-0 flex items-center gap-4 cursor-pointer group"
              style={{ perspective: '1000px' }}
              onClick={() => scrollToSection('#home')}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                e.currentTarget.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotateY(0) rotateX(0) scale(1)';
              }}
            >
              <div
                className="relative w-14 h-14 overflow-hidden rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(220,38,38,0.2) 0%, rgba(127,29,29,0.2) 100%)',
                  boxShadow: '0 0 0 rgba(220,38,38,0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(220,38,38,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(220,38,38,0)';
                }}
              >
                <div className="absolute inset-0 bg-red-600/20 animate-pulse rounded-full" />
                <picture>
                  <source srcSet={logoWebp} type="image/webp" />
                  <img
                    src={logoPng}
                    alt="Logo"
                    width="40"
                    height="40"
                    decoding="async"
                    className="w-10 h-10 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.8))' }}
                  />
                </picture>
                <div className="absolute inset-0 rounded-full border border-red-500/30 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500" />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-xl tracking-tight block group-hover:text-red-500 transition-colors duration-300">
                  Freelance<span className="text-red-600 group-hover:text-white transition-colors duration-300">.io</span>
                </span>
                <span className="text-neutral-500 text-xs tracking-widest uppercase">Portfolio</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-1 bg-white/5 rounded-full p-1.5 border border-white/5">
                {navLinks.map((link, index) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="relative px-6 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-300 group overflow-hidden rounded-full"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transition: 'transform 0.2s ease-out, color 0.3s' }}
                  >
                    <span className={`absolute inset-0 bg-red-600/20 rounded-full transition-all duration-300 ${activeLink === link.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-red-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ boxShadow: '0 0 10px rgba(220,38,38,1)' }}
                    />
                    <span className="relative inline-block">
                      <span className="relative z-10">{link.name}</span>
                      <span className="absolute inset-0 text-red-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 animate-pulse">
                        {link.name}
                      </span>
                      <span className="absolute inset-0 text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 delay-75">
                        {link.name}
                      </span>
                    </span>
                    <span className="absolute -top-1 -right-1 text-[8px] text-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono">
                      0{index + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button - Opens CONSULTATION */}
            <div className="hidden md:block">
              <button
                onClick={() => onLetsTalk && onLetsTalk()}
                className="relative group overflow-hidden rounded-full"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transition: 'transform 0.2s ease-out' }}
              >
                <span className="absolute inset-0 rounded-full opacity-100 blur-sm group-hover:blur-md transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, #dc2626, #ef4444, #dc2626)',
                    backgroundSize: '200% 100%',
                    animation: 'gradient-rotate 3s linear infinite'
                  }}
                />
                <span className="relative flex items-center gap-2 bg-neutral-900 hover:bg-red-600 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 border border-red-500/50 group-hover:border-red-400 m-[1px]">
                  <span className="relative z-10 flex items-center gap-2">
                    Let's Talk
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                </span>
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="absolute w-1 h-1 bg-red-400 rounded-full top-1/2 left-1/2"
                      style={{
                        transform: `rotate(${i * 60}deg) translateY(-20px)`,
                        opacity: 0,
                        animation: `particle 0.6s ease-out ${i * 0.1}s forwards`
                      }}
                    />
                  ))}
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-12 h-12 flex items-center justify-center text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-all duration-300 overflow-hidden group"
              >
                <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`}>
                  <Menu className="w-6 h-6" />
                </span>
                <span className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}`}>
                  <X className="w-6 h-6 text-red-500" />
                </span>
                <span className={`absolute inset-0 rounded-full bg-red-500/20 scale-0 group-active:scale-100 transition-transform duration-300 ${isOpen ? 'scale-100' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-500 ease-out rounded-b-[40px]
              ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-6 pb-6 pt-2 space-y-1 bg-neutral-900/95 backdrop-blur-xl border-t border-white/5">
              {navLinks.map((link, index) => (
                <button
                  key={link.name}
                  onClick={() => {
                    scrollToSection(link.href);
                    setIsOpen(false);
                  }}
                  className="w-full text-left group flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-300"
                  style={{
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: isOpen ? 1 : 0,
                    transitionDelay: `${index * 75}ms`
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-500 text-xs font-mono group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      0{index + 1}
                    </span>
                    {link.name}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-red-500" />
                </button>
              ))}

              {/* Mobile Let's Talk - Also goes to Consultation */}
              <div className="pt-4 mt-4 border-t border-white/10" style={{ transitionDelay: '300ms' }}>
                <button
                  onClick={() => {
                    onLetsTalk && onLetsTalk();
                    setIsOpen(false);
                  }}
                  className="w-full group flex justify-center items-center gap-2 text-white px-5 py-4 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
                    boxShadow: '0 10px 25px -5px rgba(220,38,38,0.4)'
                  }}
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Let's Talk
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes particle {
          0% {
            transform: rotate(var(--rotation, 0deg)) translateY(-20px) scale(0);
            opacity: 1;
          }
          100% {
            transform: rotate(var(--rotation, 0deg)) translateY(-40px) scale(1);
            opacity: 0;
          }
        }
        
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
