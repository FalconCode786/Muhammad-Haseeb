import React, { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  Github,
  ArrowRight,
  Sparkles,
  Code2,
  FileText,
  Search,
  ChevronRight
} from 'lucide-react';

const Work = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const projects = [
    {
      id: 1,
      title: 'News Scrapper',
      description: 'Automated news aggregation platform that scrapes and categorizes latest news from multiple sources with real-time updates and clean UI.',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      liveUrl: 'https://news-scrapper-xi.vercel.app/',
      githubUrl: 'https://github.com/FalconCode786',
      icon: Search,
      tags: ['Web Scraping', 'React', 'Node.js', 'API'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Notes Generator',
      description: 'AI-powered note-taking application that automatically generates structured notes from various inputs with smart organization features.',
      image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80',
      liveUrl: 'https://notes-generator-mu.vercel.app/',
      githubUrl: 'https://github.com/FalconCode786',
      icon: FileText,
      tags: ['AI/ML', 'React', 'OpenAI API', 'Full Stack'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Turnitin Alternative',
      description: 'Plagiarism detection and content originality checking tool with advanced algorithms and detailed similarity reports.',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80',
      liveUrl: 'https://turnitin-alternative.vercel.app/',
      githubUrl: 'https://github.com/FalconCode786',
      icon: Code2,
      tags: ['NLP', 'Document Analysis', 'React', 'Python'],
      color: 'from-red-500 to-orange-500'
    }
  ];

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full py-24 bg-slate-950 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-96 h-96 bg-sky-500/10 rounded-full blur-[150px] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 mb-6">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-slate-200 font-medium">Featured Work</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            My <span className="text-sky-400">Projects</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Explore my latest work. Real-world applications built with modern technologies and best practices.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Card Container */}
              <div className="relative h-full rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-slate-600 transition-all duration-500">

                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                  {/* Live Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <project.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs text-slate-300 bg-slate-900/60 border border-slate-800 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-400 transition-all group/btn"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 transition-all"
                      title="View Code"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <a
            href="https://github.com/FalconCode786"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900/60 border border-slate-800 text-white font-medium hover:bg-slate-900 hover:border-slate-600 transition-all"
          >
            <Github className="w-5 h-5" />
            View More on GitHub
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Work;
