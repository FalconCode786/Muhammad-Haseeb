import React, { useState } from 'react';
import {
  Settings as SettingsIcon, User, Lock, Bell, Shield,
  Save, Eye, EyeOff, CheckCircle2, AlertCircle, LogOut, Trash2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

/* ─── Section Wrapper ──────────────────────────────────────── */
const Section = ({ title, icon, children }) => {
  const IconComp = icon;
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
        <IconComp className="w-5 h-5 text-sky-400" />
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

/* ─── Toast ────────────────────────────────────────────────── */
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${toast.type === 'error'
      ? 'bg-red-600/20 border border-red-500/30 text-red-400'
      : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
      }`}>
      {toast.type === 'error'
        ? <AlertCircle className="w-4 h-4 inline mr-2" />
        : <CheckCircle2 className="w-4 h-4 inline mr-2" />}
      {toast.msg}
    </div>
  );
};

/* ─── Profile Section ──────────────────────────────────────── */
const ProfileSection = ({ user, showToast }) => {
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', form);
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Profile" icon={User}>
      <div className="space-y-4 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-300 text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-semibold text-white text-lg">{user?.name || 'Admin'}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
              {user?.role || 'Administrator'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-all"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-all disabled:opacity-70 text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </Section>
  );
};

/* ─── Security Section ─────────────────────────────────────── */
const SecuritySection = ({ showToast }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    if (form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (form.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
    { key: 'newPassword', label: 'New Password', showKey: 'new' },
    { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
  ];

  return (
    <Section title="Security" icon={Lock}>
      <div className="space-y-4 max-w-md">
        {fields.map(({ key, label, showKey }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
            <div className="relative">
              <input
                type={show[showKey] ? 'text' : 'password'}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-4 pr-12 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}

        <div className="pt-1">
          <p className="text-xs text-slate-500 mb-3">Password must be at least 8 characters long.</p>
          <button
            onClick={handleChange}
            disabled={saving || !form.currentPassword || !form.newPassword || !form.confirmPassword}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-all disabled:opacity-70 text-sm"
          >
            <Shield className="w-4 h-4" />
            {saving ? 'Updating...' : 'Change Password'}
          </button>
        </div>
      </div>
    </Section>
  );
};

/* ─── Notifications Section ────────────────────────────────── */
const NotificationsSection = ({ showToast }) => {
  const storageKey = 'adminNotifPrefs';
  const savedPrefs = (() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; }
  })();

  const [prefs, setPrefs] = useState({
    newContact: savedPrefs.newContact ?? true,
    newConsultation: savedPrefs.newConsultation ?? true,
    statusUpdates: savedPrefs.statusUpdates ?? false,
    weeklyDigest: savedPrefs.weeklyDigest ?? false,
  });

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const savePrefs = () => {
    localStorage.setItem(storageKey, JSON.stringify(prefs));
    showToast('Notification preferences saved');
  };

  const entries = [
    { key: 'newContact', label: 'New Contact Submissions', desc: 'Get notified when someone fills out the contact form' },
    { key: 'newConsultation', label: 'New Consultation Bookings', desc: 'Get notified when a consultation is booked' },
    { key: 'statusUpdates', label: 'Status Change Alerts', desc: 'Notify when contact or consultation status changes' },
    { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of contacts and consultations' },
  ];

  return (
    <Section title="Notifications" icon={Bell}>
      <div className="space-y-4 max-w-lg">
        {entries.map(({ key, label, desc }) => (
          <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-slate-800 last:border-0">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${prefs[key] ? 'bg-sky-500' : 'bg-slate-800'
                }`}
              role="switch"
              aria-checked={prefs[key]}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prefs[key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        ))}
        <button
          onClick={savePrefs}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-all text-sm mt-2"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </Section>
  );
};

/* ─── Danger Zone ──────────────────────────────────────────── */
const DangerZone = ({ logout }) => (
  <Section title="Session" icon={Shield}>
    <div className="flex flex-wrap gap-3">
      <button
        onClick={logout}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white transition-all text-sm"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  </Section>
);

/* ─── Main Settings Page ───────────────────────────────────── */
const Settings = () => {
  const { user, logout } = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} />

      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-sky-400" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      {/* Sections */}
      <ProfileSection user={user} showToast={showToast} />
      <SecuritySection showToast={showToast} />
      <NotificationsSection showToast={showToast} />
      <DangerZone logout={logout} />
    </div>
  );
};

export default Settings;
