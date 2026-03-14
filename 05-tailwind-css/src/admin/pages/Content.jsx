import React, { useState } from 'react';
import { CheckCircle2, FileText, RefreshCw, Save, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useSiteContent } from '../../hooks/useSiteContent';

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${toast.type === 'error'
      ? 'bg-red-600/20 border border-red-500/30 text-red-400'
      : 'bg-green-600/20 border border-green-500/30 text-green-400'
      }`}>
      {toast.type === 'error'
        ? <AlertCircle className="w-4 h-4 inline mr-2" />
        : <CheckCircle2 className="w-4 h-4 inline mr-2" />}
      {toast.msg}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder }) => (
  <label className="block text-sm text-neutral-400 space-y-2">
    <span>{label}</span>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/40 transition-all"
    />
  </label>
);

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <label className="block text-sm text-neutral-400 space-y-2">
    <span>{label}</span>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/40 transition-all resize-none"
    />
  </label>
);

const Content = () => {
  const { content, saveContent, resetContent } = useSiteContent();
  const [draft, setDraft] = useState(content);
  const [roleInput, setRoleInput] = useState((content.hero.roles || []).join(', '));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const updateHero = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value
      }
    }));
  };

  const updateHeroCta = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        ctas: {
          ...prev.hero.ctas,
          [key]: value
        }
      }
    }));
  };

  const updateServices = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    setSaving(true);
    const roles = roleInput
      .split(',')
      .map((role) => role.trim())
      .filter((role) => role.length >= 2);
    const updated = {
      ...draft,
      hero: {
        ...draft.hero,
        roles: roles.length ? roles : draft.hero.roles
      }
    };
    const savedContent = saveContent(updated);
    setDraft(savedContent);
    setRoleInput((savedContent.hero.roles || []).join(', '));
    setSaving(false);
    showToast('Content updated successfully');
  };

  const handleReset = () => {
    const resetValue = resetContent();
    setDraft(resetValue);
    setRoleInput((resetValue.hero.roles || []).join(', '));
    showToast('Content reset to defaults');
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Content</h1>
            <p className="text-sm text-neutral-500">
              {content.meta.updatedAt
                ? `Last updated ${format(new Date(content.meta.updatedAt), 'PPpp')}`
                : 'No updates saved yet'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all text-sm disabled:opacity-70"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Hero Section</h2>
          <InputField
            label="Badge Text"
            value={draft.hero.badge}
            onChange={(event) => updateHero('badge', event.target.value)}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <InputField
              label="Greeting"
              value={draft.hero.greeting}
              onChange={(event) => updateHero('greeting', event.target.value)}
            />
            <InputField
              label="First Name"
              value={draft.hero.firstName}
              onChange={(event) => updateHero('firstName', event.target.value)}
            />
            <InputField
              label="Last Name"
              value={draft.hero.lastName}
              onChange={(event) => updateHero('lastName', event.target.value)}
            />
          </div>
          <TextAreaField
            label="Description"
            value={draft.hero.description}
            onChange={(event) => updateHero('description', event.target.value)}
          />
          <InputField
            label="Roles (comma-separated)"
            value={roleInput}
            onChange={(event) => setRoleInput(event.target.value)}
            placeholder="UI/UX Designer, Full Stack Developer, AI Automation Specialist"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              label="Primary CTA"
              value={draft.hero.ctas.primaryLabel}
              onChange={(event) => updateHeroCta('primaryLabel', event.target.value)}
            />
            <InputField
              label="Secondary CTA"
              value={draft.hero.ctas.secondaryLabel}
              onChange={(event) => updateHeroCta('secondaryLabel', event.target.value)}
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Services Section</h2>
          <InputField
            label="Eyebrow Label"
            value={draft.services.eyebrow}
            onChange={(event) => updateServices('eyebrow', event.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField
              label="Title (Main)"
              value={draft.services.titleMain || ''}
              onChange={(event) => updateServices('titleMain', event.target.value)}
            />
            <InputField
              label="Title (Highlight)"
              value={draft.services.titleHighlight || ''}
              onChange={(event) => updateServices('titleHighlight', event.target.value)}
            />
          </div>
          <TextAreaField
            label="Subtitle"
            value={draft.services.subtitle}
            onChange={(event) => updateServices('subtitle', event.target.value)}
          />
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-neutral-400">
            Changes update the hero and services sections on the public site in this browser.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Content;
