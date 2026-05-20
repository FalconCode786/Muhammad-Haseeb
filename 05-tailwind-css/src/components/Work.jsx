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
      className="relative w-full py-24 bg-neutral-950 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-96 h-96 bg-red-600/10 rounded-full blur-[150px] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-20 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-400 font-medium">Featured Work</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            My <span className="text-red-600">Projects</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
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
              <div className="relative h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-red-500/30 transition-all duration-500">

                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

                  {/* Live Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live
                  </div>

                  {/* Icon */}
                  <div className={`absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <project.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs text-neutral-300 bg-white/5 border border-white/10 rounded-md"
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
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-all group/btn"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                      title="View Code"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
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
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-red-500/30 transition-all"
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
