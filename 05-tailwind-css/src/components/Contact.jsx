import React, { useState } from 'react';
import {
  Send,
  Mail,
  CheckCircle,
  Loader2,
  Briefcase,
  Clock,
  Database,
  Code2,
  Link as LinkIcon,
  User,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check
} from 'lucide-react';

const Contact = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    projectType: '',
    projectName: '',
    duration: '',
    uiLink: '',
    database: '',
    technologies: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const projectTypes = [
    'UI/UX Design',
    'Full Stack Web App',
    'AI Automation',
    'Mobile App',
    'Database Design',
    'Other'
  ];

  const databases = [
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Firebase',
    'Supabase',
    'Not Sure Yet'
  ];

  const durations = [
    'Less than 1 week',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    '3+ months',
    'Ongoing'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim() !== '' && formData.contactNumber.trim() !== '';
      default:
        return true;
    }
  };

  const progress = (step / 4) * 100;

  const inputClasses = "w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-all";
  const labelClasses = "block text-sm font-medium text-slate-400 mb-2";
  const requiredClasses = "text-sky-400 ml-1";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-sky-400" />
              Personal Information <span className="text-sm text-slate-500 font-normal">(Required)</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>
                  Full Name<span className={requiredClasses}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  Contact Number<span className={requiredClasses}>*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  placeholder="+92 300 1234567"
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputClasses}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-sky-400" />
              Project Basics
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Project Type</label>
                <select name="projectType" value={formData.projectType} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                  <option value="" className="bg-slate-950">Select type</option>
                  {projectTypes.map(t => <option key={t} value={t} className="bg-slate-950">{t}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClasses}>Project Name</label>
                <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="My Awesome Project" className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Project Duration</label>
              <select name="duration" value={formData.duration} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                <option value="" className="bg-slate-950">Select duration</option>
                {durations.map(d => <option key={d} value={d} className="bg-slate-950">{d}</option>)}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              Technical Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClasses}>Database</label>
                <select name="database" value={formData.database} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                  <option value="" className="bg-slate-950">Select database</option>
                  {databases.map(db => <option key={db} value={db} className="bg-slate-950">{db}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClasses}>UI/Design Link</label>
                <input type="url" name="uiLink" value={formData.uiLink} onChange={handleChange} placeholder="https://figma.com/..." className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Technologies Required</label>
              <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, Python..." className={inputClasses} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              Project Details
            </h3>

            <div>
              <label className={labelClasses}>Tell me about your project</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={6} placeholder="Describe your project requirements, goals, budget, and any specific details..." className={`${inputClasses} resize-none`} />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <h4 className="text-sm font-medium text-white mb-3">Quick Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p className="text-slate-400">Name: <span className="text-white">{formData.fullName || '-'}</span></p>
                <p className="text-slate-400">Type: <span className="text-white">{formData.projectType || '-'}</span></p>
                <p className="text-slate-400">Duration: <span className="text-white">{formData.duration || '-'}</span></p>
                <p className="text-slate-400">Database: <span className="text-white">{formData.database || '-'}</span></p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="contact" className="relative w-full py-20 bg-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 mb-6">
            <Mail className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-slate-200 font-medium">Start Your Project</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Let's Work <span className="text-sky-400">Together</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Tell me about your project and I'll get back to you within 24 hours.
          </p>
        </div>

        {/* Full Width Form */}
        <div className="max-w-4xl mx-auto">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
            {isSubmitted ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-slate-300">I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Step {step} of 4</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex justify-between mt-4">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`flex flex-col items-center gap-1 ${s <= step ? 'text-sky-400' : 'text-slate-600'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${s < step ? 'bg-emerald-500 text-white' : s === step ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                          {s < step ? <Check className="w-4 h-4" /> : s}
                        </div>
                        <span className="text-[10px] hidden sm:block">{s === 1 ? 'Personal' : s === 2 ? 'Project' : s === 3 ? 'Tech' : 'Details'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit}>
                  {renderStep()}

                  {/* Navigation */}
                  <div className="flex gap-3 mt-8">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 rounded-xl border border-slate-700 text-white hover:bg-slate-900 transition-all flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-400 text-white font-medium hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Request
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
