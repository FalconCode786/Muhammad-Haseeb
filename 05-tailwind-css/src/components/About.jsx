import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Palette,
  Cpu,
  Award,
  Calendar,
  MapPin,
  Briefcase,
  ChevronRight,
  Sparkles,
  Rocket,
  Target,
  Eye
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('journey');
  const [imageErrors, setImageErrors] = useState({});
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const journey = [
    {
      year: '2023',
      title: 'Started Learning',
      description: 'Began my journey into UI/UX design and web development through online platforms.',
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2024',
      title: 'NAVTTC Certification',
      description: 'Completed professional UI/UX Design certification from NAVTTC.',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    },
    {
      year: '2024',
      title: 'Scrimba Full Stack',
      description: 'Earned Full Stack Developer certification from Scrimba.',
      icon: Code2,
      color: 'from-purple-500 to-pink-500'
    },
    {
      year: 'Present',
      title: 'AI Automation',
      description: 'Specializing in AI automation solutions and building intelligent applications.',
      icon: Cpu,
      color: 'from-red-500 to-orange-500'
    }
  ];

  // Tools with external image URLs
  const tools = [
    {
      name: 'Figma',
      expertise: 95,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/figma/figma-icon.svg',
      category: 'Design'
    },
    {
      name: 'React',
      expertise: 90,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg',
      category: 'Frontend'
    },
    {
      name: 'Node.js',
      expertise: 88,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg',
      category: 'Backend'
    },
    {
      name: 'Python',
      expertise: 85,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/python/python-icon.svg',
      category: 'AI/Backend'
    },
    {
      name: 'MongoDB',
      expertise: 82,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg',
      category: 'Database'
    },
    {
      name: 'TypeScript',
      expertise: 87,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-icon.svg',
      category: 'Frontend'
    },
    {
      name: 'Tailwind',
      expertise: 92,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      fallback: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg',
      category: 'Design'
    },
    {
      name: 'Git',
      expertise: 90,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg',
      category: 'DevOps'
    },
    {
      name: 'Next.js',
      expertise: 85,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/nextjs/nextjs-icon.svg',
      category: 'Frontend'
    },
    {
      name: 'OpenAI',
      expertise: 80,
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      fallback: 'https://www.vectorlogo.zone/logos/openai/openai-icon.svg',
      category: 'AI'
    },
    {
      name: 'PostgreSQL',
      expertise: 78,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      fallback: 'https://www.vectorlogo.zone/logos/postgresql/postgresql-icon.svg',
      category: 'Database'
    },
    {
      name: 'Adobe XD',
      expertise: 88,
      image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg',
      fallback: 'https://www.vectorlogo.zone/logos/adobe_xd/adobe_xd-icon.svg',
      category: 'Design'
    }
  ];

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const stats = [
    { label: 'Projects', value: '50+', icon: Briefcase },
    { label: 'Certifications', value: '3', icon: Award },
    { label: 'Experience', value: '2+', icon: Calendar },
    { label: 'Clients', value: '30+', icon: Target }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-neutral-950 overflow-hidden"
    >
      {/* Hero Polygon Section */}
      <div className="relative min-h-[60vh] flex items-center">
        <div
          className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-neutral-900 to-neutral-950"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 70% 100%, 0 90%)' }}
        />

        <div
          className={`absolute top-20 right-10 w-96 h-96 bg-red-600/20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', animation: 'float 6s ease-in-out infinite' }}
        />

        <div
          className={`absolute bottom-20 left-10 w-64 h-64 bg-purple-600/10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', animation: 'float 8s ease-in-out infinite reverse' }}
        />

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
                <Eye className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-400 font-medium">About Me</span>
              </div>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Crafting Digital
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                  Experiences
                </span>
              </h2>

              <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-xl">
                NAVTTC Certified UI/UX Designer & Scrimba Certified Full Stack Developer.
                I blend creativity with technical expertise to build solutions that matter.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`relative p-4 bg-white/5 border border-white/10 transition-all duration-500 hover:bg-red-600/10 hover:border-red-500/30 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms`, clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                  >
                    <stat.icon className="w-5 h-5 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-neutral-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative flex justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
              <div
                className="relative w-80 h-80 sm:w-96 sm:h-96"
                style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', background: 'linear-gradient(135deg, rgba(220,38,38,0.3) 0%, rgba(147,51,234,0.3) 100%)' }}
              >
                <div className="absolute inset-4 bg-neutral-900 flex items-center justify-center" style={{ clipPath: 'inherit' }}>
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                      <Rocket className="w-10 h-10 text-red-500 animate-bounce" />
                    </div>
                    <p className="text-white font-bold text-xl">Ready to Launch</p>
                    <p className="text-neutral-400 text-sm mt-2">Your next project</p>
                  </div>
                </div>

                <div className="absolute -inset-4 animate-spin-slow" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-0 left-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" style={{ transform: 'translateX(-50%)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-neutral-900/50" style={{ clipPath: 'polygon(0 5%, 100% 0%, 100% 95%, 0% 100%)' }} />

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28">
          <div className={`flex justify-center gap-4 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {['journey', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-8 py-3 font-medium capitalize transition-all duration-300 ${activeTab === tab ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)', background: activeTab === tab ? 'linear-gradient(90deg, #dc2626, #b91c1c)' : 'rgba(255,255,255,0.05)' }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'journey' && (
            <div className="space-y-8">
              {journey.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-start gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br ${item.color} shadow-lg`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    {index !== journey.length - 1 && <div className="w-0.5 h-24 bg-gradient-to-b from-red-500/50 to-transparent mt-2" />}
                  </div>

                  <div className="flex-1 p-6 bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300 group" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}>
                    <span className={`inline-block px-3 py-1 text-xs font-bold text-white bg-gradient-to-r ${item.color} mb-2`} style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{item.title}</h3>
                    <p className="text-neutral-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tools Tab - ELLIPSE CARDS WITH EXTERNAL IMAGES */}
          {activeTab === 'tools' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`group relative transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Ellipse Card */}
                  <div
                    className="relative flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-600/5 transition-all duration-300"
                    style={{ borderRadius: '50% / 30%', aspectRatio: '1 / 1.3' }}
                  >
                    {/* Tool Image from External URL */}
                    <div className="relative w-16 h-16 mb-3 rounded-full bg-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      {!imageErrors[index] ? (
                        <img
                          src={tool.image}
                          alt={tool.name}
                          className="w-10 h-10 object-contain"
                          onError={() => handleImageError(index)}
                        />
                      ) : (
                        <img
                          src={tool.fallback}
                          alt={tool.name}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                          }}
                        />
                      )}
                      {/* Fallback Icon */}
                      <div className="fallback-icon hidden w-full h-full items-center justify-center bg-red-600/20">
                        <Code2 className="w-8 h-8 text-red-500" />
                      </div>
                    </div>

                    {/* Tool Name */}
                    <h4 className="text-white font-semibold text-sm text-center mb-1 group-hover:text-red-400 transition-colors">
                      {tool.name}
                    </h4>

                    {/* Category */}
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3">
                      {tool.category}
                    </span>

                    {/* Expertise Percentage */}
                    <div className="w-full px-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-neutral-400">Expertise</span>
                        <span className="text-red-400 font-bold">{tool.expertise}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000 group-hover:from-red-500 group-hover:to-red-300"
                          style={{ width: isVisible ? `${tool.expertise}%` : '0%', transitionDelay: `${index * 50 + 300}ms` }}
                        />
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ borderRadius: 'inherit', boxShadow: 'inset 0 0 30px rgba(220,38,38,0.1), 0 0 30px rgba(220,38,38,0.1)' }}
                    />
                  </div>

                  {/* Orbiting Dot */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderRadius: '50% / 30%' }}>
                    <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-spin" style={{ animationDuration: '3s', top: '10%', left: '50%', transformOrigin: '0 150%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-purple-900/20" style={{ clipPath: 'polygon(0 20%, 100% 0%, 100% 80%, 0% 100%)' }} />

        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28">
          <div className={`p-12 bg-white/5 border border-white/10 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)' }}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Let's Build Something Amazing</h3>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Based in Pakistan, working globally. Ready to bring your ideas to life with cutting-edge technology and creative design.
                </p>
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" />Pakistan</span>
                  <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-red-500" />Available Worldwide</span>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <a href="#contact" className="group relative px-8 py-4 bg-red-600 text-white font-semibold overflow-hidden transition-all hover:scale-105" style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}>
                  <span className="relative z-10 flex items-center gap-2">Start a Project<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300" style={{ clipPath: 'inherit' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </section>
  );
};

export default About;