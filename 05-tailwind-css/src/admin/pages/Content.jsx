import React, { useMemo, useState } from 'react';
import { FileText, Edit3, Save, X, Eye, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const storageKey = 'adminContentSections';
const localStorageNotice = 'Saved locally on this device only (no backend persistence).';

const getDefaultSections = () => {
  const getNowISOString = () => new Date().toISOString();
  return [
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Primary landing headline, subheading, and CTAs.',
      status: 'published',
      lastUpdated: getNowISOString(),
      previewPath: '/',
      fields: {
        headline: 'Build modern products with confidence.',
        subheadline: 'Showcase expertise, highlight wins, and convert new leads with a high-impact hero.',
        primaryCta: 'Book a Consultation',
        secondaryCta: 'View Portfolio'
      },
      fieldMeta: [
        { key: 'headline', label: 'Headline', type: 'text' },
        { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
        { key: 'primaryCta', label: 'Primary CTA', type: 'text' },
        { key: 'secondaryCta', label: 'Secondary CTA', type: 'text' }
      ]
    },
    {
      id: 'about',
      title: 'About Section',
      description: 'Founder story, expertise highlights, and credibility markers.',
      status: 'published',
      lastUpdated: getNowISOString(),
      previewPath: '/#about',
      fields: {
        summary: 'Strategic full-stack delivery with a focus on modern UX and scalable systems.',
        highlight: '12+ shipped products across SaaS, fintech, and AI.'
      },
      fieldMeta: [
        { key: 'summary', label: 'Summary', type: 'textarea' },
        { key: 'highlight', label: 'Key Highlight', type: 'text' }
      ]
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Packages, retainers, and custom engagement details.',
      status: 'draft',
      lastUpdated: getNowISOString(),
      previewPath: '/#services',
      fields: {
        intro: 'Launch-ready design, engineering, and product advisory.',
        featured: 'MVP builds, product audit, growth experiments.'
      },
      fieldMeta: [
        { key: 'intro', label: 'Intro Copy', type: 'textarea' },
        { key: 'featured', label: 'Featured Services', type: 'text' }
      ]
    },
    {
      id: 'projects',
      title: 'Portfolio Highlights',
      description: 'Case studies, featured products, and proof points.',
      status: 'published',
      lastUpdated: getNowISOString(),
      previewPath: '/#projects',
      fields: {
        intro: 'Curated case studies focused on outcomes and impact.',
        featuredProject: 'AI analytics dashboard overhaul for fintech startup.'
      },
      fieldMeta: [
        { key: 'intro', label: 'Intro Copy', type: 'textarea' },
        { key: 'featuredProject', label: 'Featured Project', type: 'text' }
      ]
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      description: 'Client quotes, success metrics, and brand social proof.',
      status: 'draft',
      lastUpdated: getNowISOString(),
      previewPath: '/#testimonials',
      fields: {
        quote: '“Consistently exceeded expectations and delivered ahead of schedule.”',
        totalReviews: '18 verified client reviews.'
      },
      fieldMeta: [
        { key: 'quote', label: 'Highlight Quote', type: 'textarea' },
        { key: 'totalReviews', label: 'Review Summary', type: 'text' }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Details',
      description: 'Lead capture settings and contact information.',
      status: 'published',
      lastUpdated: getNowISOString(),
      previewPath: '/#contact',
      fields: {
        email: 'hello@haseeb.dev',
        phone: '+92 300 000 0000',
        bookingLink: 'https://cal.com/muhammad-haseeb'
      },
      fieldMeta: [
        { key: 'email', label: 'Support Email', type: 'text' },
        { key: 'phone', label: 'Contact Phone', type: 'text' },
        { key: 'bookingLink', label: 'Booking Link', type: 'text' }
      ]
    }
  ];
};

const loadSections = () => {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to read content sections:', error);
  }
  return getDefaultSections();
};

const statusStyles = {
  published: 'bg-green-500/10 text-green-400 border-green-500/20',
  draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
};

const formatLastUpdated = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return format(date, 'PPP');
};

const ContentModal = ({ section, onClose, onSave }) => {
  const [form, setForm] = useState(section);
  const [saving, setSaving] = useState(false);

  if (!section) return null;

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      fields: { ...prev.fields, [key]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wide">Editing</p>
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/40"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {section.fieldMeta.map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-neutral-400 mb-2">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={form.fields[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500/40 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={form.fields[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500/40"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-yellow-400/90">{localStorageNotice}</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-70 text-sm"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Updates'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Content = () => {
  const [sections, setSections] = useState(loadSections);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);

  const statusSummary = useMemo(() => {
    const published = sections.filter((item) => item.status === 'published').length;
    return { published, total: sections.length };
  }, [sections]);

  const saveSections = (updated) => {
    setSections(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleSave = async (updatedSection) => {
    const next = sections.map((section) =>
      section.id === updatedSection.id
        ? { ...updatedSection, lastUpdated: new Date().toISOString() }
        : section
    );
    saveSections(next);
    setEditing(null);
    setToast('Content updated successfully.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg bg-green-600/20 border border-green-500/30 text-green-400">
          <CheckCircle2 className="w-4 h-4 inline mr-2" />
          {toast}
        </div>
      )}

      <ContentModal
        section={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Content Studio</h1>
            <p className="text-sm text-neutral-500">
              {statusSummary.published} of {statusSummary.total} sections published
            </p>
          </div>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-400">
          Autosave enabled
        </div>
      </div>

      <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-100">
        {localStorageNotice}
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sections.map((section) => (
          <div key={section.id} className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">{section.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[section.status]}`}>
                {section.status.toUpperCase()}
              </span>
            </div>

            <div className="rounded-xl bg-neutral-950/60 border border-white/5 p-4 text-sm text-neutral-300">
              <p className="text-xs uppercase text-neutral-500 mb-2">Preview</p>
              <p className="line-clamp-3">{Object.values(section.fields)[0]}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Last updated {formatLastUpdated(section.lastUpdated)}</span>
              <a
                href={section.previewPath}
                className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </a>
            </div>

            <button
              onClick={() => setEditing(section)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit Content
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
