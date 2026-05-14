import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Calendar, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  AlertCircle, XCircle, RefreshCw, Activity
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';

const StatusDot = ({ status, type }) => {
  const contactColors = {
    new: 'bg-blue-400',
    'in-progress': 'bg-yellow-400',
    responded: 'bg-green-400',
    closed: 'bg-slate-400',
  };
  const consultColors = {
    pending: 'bg-yellow-400',
    confirmed: 'bg-blue-400',
    completed: 'bg-green-400',
    cancelled: 'bg-red-400',
    'no-show': 'bg-slate-400',
  };
  const colors = type === 'consultation' ? consultColors : contactColors;
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-slate-400'}`} />;
};

const StatCard = ({ label, value, sub, icon, color, trend }) => {
  const Icon = icon;
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
        <p className="text-sm text-slate-400 mt-1">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-slate-300">{error}</p>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const { overview, contacts, consultations, recentActivity } = stats;

  const statCards = [
    {
      label: 'Total Contacts',
      value: overview.totalContacts,
      sub: `+${overview.newContactsToday} today`,
      icon: Users,
      color: 'bg-sky-500/10 text-sky-300',
      trend: overview.newContactsThisWeek,
    },
    {
      label: 'Total Consultations',
      value: overview.totalConsultations,
      sub: `${overview.consultationsToday} today`,
      icon: Calendar,
      color: 'bg-indigo-500/10 text-indigo-300',
      trend: consultations.thisWeek,
    },
    {
      label: 'Upcoming Bookings',
      value: overview.upcomingConsultations,
      sub: 'Pending & confirmed',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-300',
    },
    {
      label: 'New This Month',
      value: contacts.thisMonth,
      sub: 'Contact requests',
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-300',
    },
  ];

  const contactStatusLabels = { new: 'New', 'in-progress': 'In Progress', responded: 'Responded', closed: 'Closed' };
  const consultStatusLabels = { pending: 'Pending', confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', 'no-show': 'No Show' };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-sky-400" />
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Status Breakdowns + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Contact Status Breakdown */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" /> Contact Status
          </h3>
          <div className="space-y-3">
            {Object.entries(contactStatusLabels).map(([key, label]) => {
              const count = contacts.byStatus[key] || 0;
              const total = overview.totalContacts || 1;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultation Status Breakdown */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Consultation Status
          </h3>
          <div className="space-y-3">
            {Object.entries(consultStatusLabels).map(([key, label]) => {
              const count = consultations.byStatus[key] || 0;
              const total = overview.totalConsultations || 1;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Recent Activity
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-60">
            {[
              ...recentActivity.contacts.map(c => ({ type: 'contact', name: c.fullName, sub: c.projectType || 'Contact', status: c.status, date: c.createdAt })),
              ...recentActivity.consultations.map(c => ({ type: 'consultation', name: c.name, sub: c.topic, status: c.status, date: c.date })),
            ]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 8)
              .map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <StatusDot status={item.status} type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500 truncate">{item.sub}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {format(new Date(item.date), 'MMM d')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Contacts & Consultations Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Contacts */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Recent Contacts</h3>
            <a href="/admin/contacts" className="text-xs text-sky-300 hover:text-sky-200 transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-slate-800">
            {recentActivity.contacts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500 text-center">No contacts yet</p>
            ) : recentActivity.contacts.map((c) => (
              <div key={c._id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-900 transition-colors">
                <div>
                  <p className="text-sm text-white font-medium">{c.fullName}</p>
                  <p className="text-xs text-slate-500">{c.projectType || 'General'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{format(new Date(c.createdAt), 'MMM d')}</span>
                  <StatusDot status={c.status} type="contact" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">Upcoming Consultations</h3>
            <a href="/admin/consultations" className="text-xs text-sky-300 hover:text-sky-200 transition-colors">View all →</a>
          </div>
          <div className="divide-y divide-slate-800">
            {recentActivity.consultations.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-500 text-center">No consultations scheduled</p>
            ) : recentActivity.consultations.map((c) => (
              <div key={c._id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-900 transition-colors">
                <div>
                  <p className="text-sm text-white font-medium">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate max-w-45">{c.topic}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white">{format(new Date(c.date), 'MMM d, yyyy')}</p>
                  <p className="text-xs text-slate-500">{c.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
