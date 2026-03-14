import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  PieChart as PieIcon,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell
} from 'recharts';
import api from '../utils/api';

const chartColors = ['#ef4444', '#8b5cf6', '#22c55e', '#f59e0b', '#06b6d4', '#ec4899'];

const sampleAnalytics = {
  project: {
    projectTypes: [
      { _id: 'Web Apps', count: 14 },
      { _id: 'UI/UX', count: 9 },
      { _id: 'Automation', count: 6 }
    ],
    databases: [
      { _id: 'MongoDB', count: 11 },
      { _id: 'PostgreSQL', count: 7 },
      { _id: 'Firebase', count: 5 }
    ],
    durations: [
      { _id: '1-2 weeks', count: 8 },
      { _id: '3-4 weeks', count: 12 },
      { _id: '1+ months', count: 6 }
    ]
  },
  consultations: {
    byTopic: [
      { _id: 'AI Automation', count: 10 },
      { _id: 'Design Review', count: 7 },
      { _id: 'Development', count: 5 }
    ],
    byType: [
      { _id: 'video', count: 12 },
      { _id: 'phone', count: 6 },
      { _id: 'chat', count: 4 }
    ],
    conversion: { total: 22, confirmed: 14, completed: 9 },
    popularTimes: [
      { _id: '10:00 AM', count: 5 },
      { _id: '2:00 PM', count: 4 },
      { _id: '4:30 PM', count: 3 }
    ]
  }
};

const StatCard = ({ icon, label, value, helper }) => {
  const IconComponent = icon;
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-400">
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-white">{value}</p>
        <p className="text-sm text-neutral-400">{label}</p>
        {helper && <p className="text-xs text-neutral-500 mt-1">{helper}</p>}
      </div>
    </div>
  );
};

const Analytics = () => {
  const [projectData, setProjectData] = useState(null);
  const [consultationData, setConsultationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [projectRes, consultationRes] = await Promise.all([
        api.get('/admin/analytics/projects'),
        api.get('/admin/analytics/consultations')
      ]);
      setProjectData(projectRes.data.data);
      setConsultationData(consultationRes.data.data);
      setUsingSample(false);
      setError(null);
    } catch (err) {
      setProjectData(sampleAnalytics.project);
      setConsultationData(sampleAnalytics.consultations);
      setUsingSample(true);
      setError(err.response?.data?.message || 'Unable to load live analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const projectTypes = projectData?.projectTypes || [];
  const databases = projectData?.databases || [];
  const durations = projectData?.durations || [];
  const consultationTopics = consultationData?.byTopic || [];
  const consultationTypes = consultationData?.byType || [];
  const popularTimes = consultationData?.popularTimes || [];
  const conversion = consultationData?.conversion || { total: 0, confirmed: 0, completed: 0 };

  const totals = {
    projectTotal: projectTypes.reduce((sum, item) => sum + item.count, 0),
    consultationTotal: conversion.total || consultationTopics.reduce((sum, item) => sum + item.count, 0),
    conversionRate: conversion.total
      ? Math.round((conversion.confirmed / conversion.total) * 100)
      : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-neutral-500">Insights across projects and consultations.</p>
          </div>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {usingSample && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error} Showing sample analytics instead.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Project Requests"
          value={totals.projectTotal}
          helper="Tracked by project type"
        />
        <StatCard
          icon={CheckCircle2}
          label="Consultations"
          value={totals.consultationTotal}
          helper={`Confirmed ${conversion.confirmed} of ${conversion.total}`}
        />
        <StatCard
          icon={PieIcon}
          label="Conversion Rate"
          value={`${totals.conversionRate}%`}
          helper="Confirmed vs total consultations"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Top Project Types</h2>
          {projectTypes.length === 0 ? (
            <p className="text-sm text-neutral-500">No project data yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectTypes.map((item) => ({ name: item._id, value: item.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="name" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
                  <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Consultation Topics</h2>
          {consultationTopics.length === 0 ? (
            <p className="text-sm text-neutral-500">No consultation data yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consultationTopics.map((item) => ({ name: item._id, value: item.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="name" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Preferred Databases</h2>
          {databases.length === 0 ? (
            <p className="text-sm text-neutral-500">No database preferences yet.</p>
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={databases.map((item) => ({ name: item._id, value: item.count }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {databases.map((_, index) => (
                      <Cell key={index} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white">Consultation Types</h2>
          {consultationTypes.length === 0 ? (
            <p className="text-sm text-neutral-500">No consultation type data yet.</p>
          ) : (
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={consultationTypes.map((item) => ({ name: item._id, value: item.count }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                  >
                    {consultationTypes.map((_, index) => (
                      <Cell key={index} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-400" /> Popular Times
          </h2>
          {popularTimes.length === 0 ? (
            <p className="text-sm text-neutral-500">No scheduling insights yet.</p>
          ) : (
            <ul className="space-y-3">
              {popularTimes.map((slot) => (
                <li key={slot._id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">{slot._id}</span>
                  <span className="text-white font-medium">{slot.count} bookings</span>
                </li>
              ))}
            </ul>
          )}
          <div className="pt-3 border-t border-white/5 text-xs text-neutral-500">
            {durations.length
              ? `Most common project duration: ${durations[0]._id}`
              : 'Project timelines are still being captured.'}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
