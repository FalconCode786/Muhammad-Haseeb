import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Briefcase
} from 'lucide-react';

const Consultation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    date: '',
    time: '',
    type: 'video',
    message: ''
  });

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

  const consultationTypes = [
    { id: 'video', label: 'Video Call', icon: Video, desc: 'Zoom/Google Meet' },
    { id: 'phone', label: 'Phone Call', icon: Phone, desc: 'Voice consultation' },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare, desc: 'Text-based chat' }
  ];

  const topics = [
    'UI/UX Design Project',
    'Full Stack Development',
    'AI Automation Solution',
    'Mobile App Development',
    'Database Architecture',
    'Performance Optimization',
    'General Inquiry',
    'Other'
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return formData.name && formData.email && formData.topic;
      case 2:
        return formData.date && formData.time && formData.type;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / 3) * 100;

  const inputClasses = "w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-400 mb-2";

  return (
    <section
      id="consultation"
      ref={sectionRef}
      className="relative w-full py-24 bg-slate-950 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-1/3 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[150px] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px] transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 mb-6">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-slate-200 font-medium">Book a Session</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Free <span className="text-sky-400">Consultation</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Schedule a 30-minute free consultation to discuss your project. No commitment required.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Benefits */}
          <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                What You'll Get
              </h3>
              <ul className="space-y-4">
                {[
                  'Project scope and requirements analysis',
                  'Technology stack recommendations',
                  'Timeline and budget estimation',
                  'Free project roadmap',
                  'No-obligation quote'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">30 Minutes</p>
                  <p className="text-slate-400 text-sm">Duration</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Video/Phone/Chat</p>
                  <p className="text-slate-400 text-sm">Your preference</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-200 italic mb-4">
                "Haseeb's consultation was incredibly helpful. He understood my requirements perfectly and provided a clear roadmap for my project."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Ahmed Khan</p>
                  <p className="text-slate-500 text-sm">Startup Founder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Booking Form */}
          <div className={`transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
              {bookingConfirmed ? (
                <div className="py-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-slate-300 mb-4">
                    We've sent a confirmation email to <span className="text-white">{formData.email}</span>
                  </p>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-left max-w-sm mx-auto">
                    <p className="text-sm text-slate-400 mb-1">Date & Time</p>
                    <p className="text-white font-medium mb-3">{formData.date} at {formData.time}</p>
                    <p className="text-sm text-slate-400 mb-1">Consultation Type</p>
                    <p className="text-white font-medium capitalize">{formData.type} Call</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                      <span>Step {step} of 3</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-4">
                      {[1, 2, 3].map((s) => (
                        <div key={s} className={`flex flex-col items-center gap-1 ${s <= step ? 'text-sky-400' : 'text-slate-600'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                          </div>
                          <span className="text-[10px] hidden sm:block">{s === 1 ? 'Details' : s === 2 ? 'Schedule' : 'Confirm'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {step === 1 && (
                      <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-semibold text-white mb-4">Your Information</h3>
                        
                        <div>
                          <label className={labelClasses}>
                            <User className="w-4 h-4 inline mr-1" />
                            Full Name
                          </label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClasses} />
                        </div>

                        <div>
                          <label className={labelClasses}>
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email Address
                          </label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className={inputClasses} />
                        </div>

                        <div>
                          <label className={labelClasses}>
                            <Briefcase className="w-4 h-4 inline mr-1" />
                            Consultation Topic
                          </label>
                          <select name="topic" value={formData.topic} onChange={handleChange} required className={`${inputClasses} appearance-none cursor-pointer`}>
                            <option value="" className="bg-slate-950">Select a topic</option>
                            {topics.map(t => <option key={t} value={t} className="bg-slate-950">{t}</option>)}
                          </select>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-semibold text-white mb-4">Schedule</h3>
                        
                        <div>
                          <label className={labelClasses}>
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Preferred Date
                          </label>
                          <input type="date" name="date" value={formData.date} onChange={handleChange} required className={inputClasses} />
                        </div>

                        <div>
                          <label className={labelClasses}>
                            <Clock className="w-4 h-4 inline mr-1" />
                            Time Slot
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map(time => (
                              <button
                                key={time}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, time }))}
                                className={`px-3 py-2 rounded-lg text-sm transition-all ${formData.time === time ? 'bg-sky-500 text-white' : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900'}`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={labelClasses}>Consultation Type</label>
                          <div className="grid grid-cols-3 gap-3">
                            {consultationTypes.map(type => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                                className={`p-3 rounded-xl border transition-all ${formData.type === type.id ? 'border-sky-500 bg-sky-500/10' : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'}`}
                              >
                                <type.icon className={`w-5 h-5 mx-auto mb-1 ${formData.type === type.id ? 'text-sky-400' : 'text-slate-400'}`} />
                                <p className={`text-xs font-medium ${formData.type === type.id ? 'text-white' : 'text-slate-400'}`}>{type.label}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
                        
                        <div>
                          <label className={labelClasses}>
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Project Brief (Optional)
                          </label>
                          <textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Tell me more about your project..." className={`${inputClasses} resize-none`} />
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <h4 className="text-sm font-medium text-white mb-3">Booking Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Name:</span>
                              <span className="text-white">{formData.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Topic:</span>
                              <span className="text-white">{formData.topic}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Date:</span>
                              <span className="text-white">{formData.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Time:</span>
                              <span className="text-white">{formData.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Type:</span>
                              <span className="text-white capitalize">{formData.type} Call</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex gap-3 mt-8">
                      {step > 1 && (
                        <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-900 transition-all">
                          Back
                        </button>
                      )}
                      
                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!isStepValid()}
                          className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 text-white font-medium hover:shadow-lg hover:shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                      >
                          Confirm Booking
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
