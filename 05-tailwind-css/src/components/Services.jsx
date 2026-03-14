import React, { useState, useEffect, useRef } from 'react';
import {
  Palette,
  Code2,
  Cpu,
  Smartphone,
  Database,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const sectionRef = useRef(null);
  const { content } = useSiteContent();
  const titleMain = content.services.titleMain || '';
  const titleHighlight = content.services.titleHighlight || 'Services';

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

  const services = [
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Creating intuitive, visually stunning interfaces that delight users and drive engagement. From wireframes to high-fidelity prototypes.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing']
    },
    {
      icon: Code2,
      title: 'Full Stack Development',
      description: 'End-to-end web application development with modern technologies. Scalable, secure, and performant solutions tailored to your needs.',
      features: ['React/Next.js', 'Node.js/Express', 'REST/GraphQL APIs', 'Authentication', 'Deployment']
    },
    {
      icon: Cpu,
      title: 'AI Automation',
      description: 'Leveraging artificial intelligence to automate workflows, analyze data, and create intelligent applications that work for you 24/7.',
      features: ['Chatbots', 'Process Automation', 'Data Analysis', 'ML Integration', 'AI Consulting']
    },
    {
      icon: Smartphone,
      title: 'Mobile Development',
      description: 'Cross-platform mobile applications that provide native-like experiences. Reach your audience on every device they use.',
      features: ['React Native', 'Responsive Design', 'App Store Deploy', 'Push Notifications', 'Offline Support']
    },
    {
      icon: Database,
      title: 'Database Design',
      description: 'Optimized database architecture for performance and scalability. From schema design to complex queries and optimization.',
      features: ['Schema Design', 'MongoDB/PostgreSQL', 'Data Modeling', 'Performance Tuning', 'Migration']
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Speed up your existing applications with advanced optimization techniques. Better performance means better user experience.',
      features: ['Code Splitting', 'Lazy Loading', 'Caching Strategies', 'SEO Optimization', 'Core Web Vitals']
    }
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full py-24 bg-neutral-950 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-20 right-20 w-96 h-96 bg-red-600/10 rounded-full blur-[150px] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-20 left-20 w-96 h-96 bg-red-900/10 rounded-full blur-[150px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-20 xl:px-28">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-6">
            <Zap className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-400 font-medium">{content.services.eyebrow}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {titleMain && `${titleMain} `}
            <span className="text-red-600">{titleHighlight}</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {content.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setActiveService(index)}
              onMouseLeave={() => setActiveService(null)}
              onClick={scrollToContact}
            >
              {/* Hover gradient background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />

              {/* Icon - RED ONLY */}
              <div className="relative w-14 h-14 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-600/20 transition-all duration-300">
                <service.icon className="w-7 h-7 text-red-500 group-hover:text-red-400 transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2 mb-4">
                {service.features.map((feature, i) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-2 text-sm transition-all duration-300 ${activeService === index ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className={`flex items-center gap-2 text-sm font-medium text-white group-hover:text-red-400 transition-all duration-300 ${activeService === index ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-red-500" />
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-600 opacity-0 group-hover:opacity-10 rounded-bl-[100px] transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-neutral-400 mb-6">Have a unique project in mind?</p>
          <button
            onClick={scrollToContact}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            Discuss Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
