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
      className="relative w-full bg-slate-950 overflow-hidden"
    >
      {/* Hero Polygon Section */}
      <div className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 rounded-b-[80px] bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950" />

        <div
          className={`absolute top-16 right-6 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />

        <div
          className={`absolute bottom-10 left-6 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
          style={{ animation: 'float 10s ease-in-out infinite reverse' }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 mb-6">
                <Eye className="w-4 h-4 text-sky-400" />
                <span className="text-sm text-slate-200 font-medium">About Me</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
                Crafting digital experiences
                <span className="block text-sky-400">that feel enterprise-ready.</span>
              </h2>

              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                NAVTTC Certified UI/UX Designer & Scrimba Certified Full Stack Developer.
                I blend creativity with technical expertise to build solutions that matter.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`relative rounded-2xl p-4 bg-slate-900/60 border border-slate-800 transition-all duration-500 hover:bg-slate-900/80 hover:border-slate-600 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <stat.icon className="w-5 h-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative flex justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
              <div className="relative w-80 sm:w-96 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-center shadow-xl shadow-black/30">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-sky-500/10 flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-sky-400" />
                </div>
                <p className="text-white font-semibold text-xl">Ready to Launch</p>
                <p className="text-slate-400 text-sm mt-2">Strategic partner for your next release</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 text-left">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-sm font-semibold text-white">Global delivery</p>
                    <p className="text-xs text-slate-400">Remote-first collaboration</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-sm font-semibold text-white">Design systems</p>
                    <p className="text-xs text-slate-400">Consistent brand UX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-slate-900/40" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`flex justify-center gap-4 mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {['journey', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-2.5 text-sm font-medium capitalize transition-all duration-300 ${activeTab === tab
                  ? 'bg-sky-500/20 text-white border border-sky-500/40'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'journey' && (
            <div className="space-y-8">
              {journey.map((item, index) => (
                <div
                  key={`${item.year}-${item.title}`}
                  className={`relative flex items-start gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-900/60 border border-slate-800">
                      <item.icon className="w-6 h-6 text-sky-400" />
                    </div>
                    {index !== journey.length - 1 && <div className="w-0.5 h-24 bg-gradient-to-b from-slate-700 to-transparent mt-2" />}
                  </div>

                  <div className="flex-1 rounded-2xl p-6 bg-slate-900/60 border border-slate-800 hover:border-slate-600 transition-all duration-300 group">
                    <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-200 mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-sky-300 transition-colors">{item.title}</h3>
                    <p className="text-slate-300">{item.description}</p>
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
                  <div
                    className="relative flex flex-col items-center justify-center rounded-2xl p-6 bg-slate-900/60 border border-slate-800 hover:border-slate-600 hover:bg-slate-900/80 transition-all duration-300 aspect-[3/4]"
                  >
                    {/* Tool Image from External URL */}
                    <div className="relative w-16 h-16 mb-3 rounded-full bg-slate-950/70 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 border border-slate-800">
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
                      <div className="fallback-icon hidden w-full h-full items-center justify-center bg-slate-900/60">
                        <Code2 className="w-8 h-8 text-sky-400" />
                      </div>
                    </div>

                    {/* Tool Name */}
                    <h4 className="text-white font-semibold text-sm text-center mb-1 group-hover:text-sky-300 transition-colors">
                      {tool.name}
                    </h4>

                    {/* Category */}
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-3">
                      {tool.category}
                    </span>

                    {/* Expertise Percentage */}
                    <div className="w-full px-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Expertise</span>
                        <span className="text-sky-400 font-bold">{tool.expertise}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-1000 group-hover:from-sky-400 group-hover:to-sky-300"
                          style={{ width: isVisible ? `${tool.expertise}%` : '0%', transitionDelay: `${index * 50 + 300}ms` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-950" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className={`rounded-3xl p-12 bg-slate-900/60 border border-slate-800 transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-4">Let's Build Something Amazing</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Based in Pakistan, working globally. Ready to bring your ideas to life with cutting-edge technology and creative design.
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" />Pakistan</span>
                  <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-400" />Available Worldwide</span>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-sky-500 px-8 py-4 text-white font-semibold transition-all hover:bg-sky-400">
                  Start a Project
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
      `}</style>
    </section>
  );
};

export default About;
