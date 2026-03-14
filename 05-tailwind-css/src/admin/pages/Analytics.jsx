import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  PieChart as PieIcon,
  Timer
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../utils/api';

const chartColors = ['#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#8b5cf6'];

const Card = ({ title, icon, children }) => {
  const Icon = icon;
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Icon className="w-4 h-4 text-red-400" /> {title}
      </div>
      {children}
    </div>
  );
};

const StatPill = ({ label, value, icon }) => {
  const Icon = icon;
  return (
    <div className="rounded-xl bg-neutral-950/60 border border-white/5 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-400 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-semibold text-white">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </div>
  );
};

const ChartEmpty = ({ message }) => (
  <div className="flex items-center justify-center h-48 text-sm text-neutral-500">
    {message}
  </div>
);

const Analytics = () => {
  const [projectAnalytics, setProjectAnalytics] = useState(null);
  const [consultationAnalytics, setConsultationAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [projectRes, consultRes] = await Promise.all([
        api.get('/admin/analytics/projects'),
        api.get('/admin/analytics/consultations')
      ]);
      setProjectAnalytics(projectRes.data.data);
      setConsultationAnalytics(consultRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = useMemo(() => {
    if (!projectAnalytics || !consultationAnalytics) return null;
    return {
      projectTypes: projectAnalytics.projectTypes?.length || 0,
      topics: consultationAnalytics.byTopic?.length || 0,
      topSlot: consultationAnalytics.popularTimes?.[0]?._id || '—',
      topSlotCount: consultationAnalytics.popularTimes?.[0]?.count || 0
    };
  }, [projectAnalytics, consultationAnalytics]);

  const topSlotValue = summary?.topSlot && summary.topSlot !== '—'
    ? `${summary.topSlot} (${summary.topSlotCount})`
    : '—';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-neutral-400">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const projectTypeData = projectAnalytics?.projectTypes?.map((item) => ({
    name: item._id || 'Unknown',
    count: item.count
  })) || [];

  const databaseData = projectAnalytics?.databases?.map((item) => ({
    name: item._id || 'Unknown',
    count: item.count
  })) || [];

  const durationData = projectAnalytics?.durations?.map((item) => ({
    name: item._id || 'Unknown',
    count: item.count
  })) || [];

  const topicData = consultationAnalytics?.byTopic?.map((item) => ({
    name: item._id || 'Unknown',
    count: item.count
  })) || [];

  const typeData = consultationAnalytics?.byType?.map((item) => ({
    name: item._id || 'Unknown',
    count: item.count
  })) || [];

  const conversion = consultationAnalytics?.conversion || { total: 0, confirmed: 0, completed: 0 };
  const confirmedRate = conversion.total
    ? ((conversion.confirmed / conversion.total) * 100).toFixed(1)
    : '0.0';
  const completedRate = conversion.total
    ? ((conversion.completed / conversion.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-neutral-500">Insights across content demand and consultation performance.</p>
          </div>
        </div>
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatPill label="Project types tracked" value={summary.projectTypes} icon={TrendingUp} />
          <StatPill label="Consultation topics" value={summary.topics} icon={PieIcon} />
          <StatPill label="Top time slot" value={topSlotValue} icon={Timer} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Project Types" icon={TrendingUp}>
          {projectTypeData.length === 0 ? (
            <ChartEmpty message="No project type data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={projectTypeData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Preferred Databases" icon={PieIcon}>
          {databaseData.length === 0 ? (
            <ChartEmpty message="No database selections yet." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={databaseData} dataKey="count" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {databaseData.map((entry, index) => (
                    <Cell key={`db-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Project Duration Mix" icon={TrendingUp}>
          {durationData.length === 0 ? (
            <ChartEmpty message="No duration data yet." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={durationData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Consultation Topics" icon={PieIcon}>
          {topicData.length === 0 ? (
            <ChartEmpty message="No consultation topics yet." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Consultation Types" icon={PieIcon}>
          {typeData.length === 0 ? (
            <ChartEmpty message="No consultation types yet." />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeData} dataKey="count" nameKey="name" innerRadius={45} outerRadius={85} paddingAngle={4}>
                  {typeData.map((entry, index) => (
                    <Cell key={`type-${entry.name}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card title="Conversion Rate" icon={TrendingUp}>
          <div className="space-y-4 text-sm text-neutral-400">
            <div className="flex items-center justify-between">
              <span>Total bookings</span>
              <span className="text-white font-medium">{conversion.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Confirmed rate</span>
              <span className="text-white font-medium">{confirmedRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Completed rate</span>
              <span className="text-white font-medium">{completedRate}%</span>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-neutral-500">
              Based on confirmations and completions logged in the system.
            </div>
          </div>
        </Card>

        <Card title="Popular Time Slots" icon={Timer}>
          {consultationAnalytics?.popularTimes?.length ? (
            <div className="space-y-3">
              {consultationAnalytics.popularTimes.map((slot) => (
                <div key={slot._id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">{slot._id}</span>
                  <span className="text-white font-medium">{slot.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <ChartEmpty message="No popular slots yet." />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
