import React, { useState } from 'react';
import {
  Calendar, RefreshCw, X, ChevronLeft, ChevronRight,
  Clock, CheckCircle2, AlertCircle, XCircle, Video,
  Phone, MessageSquare, Trash2, Edit3, ExternalLink, User
} from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { useConsultations } from '../hooks/useConsultations';

/* ─── Status Badge ─────────────────────────────────────────── */
const ConsultationBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    'no-show': 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
};

/* ─── Type Icon ────────────────────────────────────────────── */
const TypeIcon = ({ type }) => {
  if (type === 'video') return <Video className="w-4 h-4 text-purple-400" />;
  if (type === 'phone') return <Phone className="w-4 h-4 text-blue-400" />;
  return <MessageSquare className="w-4 h-4 text-green-400" />;
};

/* ─── View Modal ───────────────────────────────────────────── */
const ViewModal = ({ consultation: c, onClose }) => {
  if (!c) return null;
  const rows = [
    ['Name', c.name],
    ['Email', c.email],
    ['Topic', c.topic],
    ['Type', c.type],
    ['Date', format(new Date(c.date), 'PPP')],
    ['Time', c.time],
    ['Meeting Link', c.meetingLink || '—'],
    ['Status', c.status],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Consultation Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-semibold text-lg">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">{c.name}</p>
              <ConsultationBadge status={c.status} />
            </div>
          </div>
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-neutral-500 w-32 shrink-0">{label}</span>
              <span className="text-white text-right capitalize">{value}</span>
            </div>
          ))}
          {c.message && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-neutral-500 text-sm mb-1">Message</p>
              <p className="text-white text-sm whitespace-pre-wrap">{c.message}</p>
            </div>
          )}
          {c.adminNotes && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-neutral-500 text-sm mb-1">Admin Notes</p>
              <p className="text-white text-sm whitespace-pre-wrap">{c.adminNotes}</p>
            </div>
          )}
          <div className="pt-2 border-t border-white/10 text-xs text-neutral-500">
            Booked {format(new Date(c.createdAt), 'PPPp')}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Edit Modal ───────────────────────────────────────────── */
const EditModal = ({ consultation, onClose, onSave }) => {
  const [form, setForm] = useState({
    status: consultation?.status || 'pending',
    meetingLink: consultation?.meetingLink || '',
    adminNotes: consultation?.adminNotes || '',
  });
  const [saving, setSaving] = useState(false);

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-400' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-blue-400' },
    { value: 'completed', label: 'Completed', color: 'text-green-400' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-400' },
    { value: 'no-show', label: 'No Show', color: 'text-neutral-400' },
  ];

  const handleSave = async () => {
    setSaving(true);
    await onSave(consultation._id, form);
    setSaving(false);
    onClose();
  };

  if (!consultation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Edit Consultation</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Status */}
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setForm(f => ({ ...f, status: value }))}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${form.status === value
                    ? 'bg-red-600/10 border-red-500/30 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                >
                  <span className={color}>{label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Meeting Link */}
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Meeting Link</label>
            <input
              type="url"
              value={form.meetingLink}
              onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))}
              placeholder="https://meet.google.com/..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
          {/* Admin Notes */}
          <div>
            <label className="text-sm text-neutral-400 block mb-2">Admin Notes</label>
            <textarea
              value={form.adminNotes}
              onChange={e => setForm(f => ({ ...f, adminNotes: e.target.value }))}
              rows={3}
              placeholder="Internal notes..."
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 transition-all resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Modal ─────────────────────────────────────────── */
const DeleteModal = ({ consultation, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  if (!consultation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">Delete Consultation</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Delete <span className="text-white">{consultation.name}'s</span> booking? This cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all">
            Cancel
          </button>
          <button
            onClick={async () => { setDeleting(true); await onConfirm(consultation._id); setDeleting(false); onClose(); }}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-70"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Consultations Page ──────────────────────────────── */
const Consultations = () => {
  const {
    consultations, loading, error,
    pagination, filters,
    setFilters, setPagination,
    updateConsultation, deleteConsultation,
    refresh
  } = useConsultations();

  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (id, data) => {
    const res = await updateConsultation(id, data);
    if (res.success) showToast('Consultation updated');
    else showToast(res.message, 'error');
  };

  const handleDelete = async (id) => {
    const res = await deleteConsultation(id);
    if (res.success) showToast('Consultation deleted');
    else showToast(res.message, 'error');
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === 'error' ? 'bg-red-600/20 border border-red-500/30 text-red-400' : 'bg-green-600/20 border border-green-500/30 text-green-400'
          }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Consultations</h1>
          {!loading && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-400">
              {pagination.total ?? 0} total
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.status}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPagination(p => ({ ...p, page: 1 })); }}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
        >
          {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-neutral-900">{o.label}</option>)}
        </select>

        <button
          onClick={() => { setFilters(f => ({ ...f, upcoming: !f.upcoming })); setPagination(p => ({ ...p, page: 1 })); }}
          className={`px-4 py-2.5 rounded-xl text-sm border transition-all ${filters.upcoming
            ? 'bg-red-600/10 border-red-500/30 text-red-400'
            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
            }`}
        >
          {filters.upcoming ? '✓ Upcoming Only' : 'Show Upcoming'}
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-neutral-400 text-sm">{error}</p>
            <button onClick={refresh} className="text-sm text-red-400 hover:text-red-300">Try again</button>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Calendar className="w-10 h-10 text-neutral-600" />
            <p className="text-neutral-400">No consultations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Topic</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Schedule</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => {
                  const dateObj = new Date(c.date);
                  const dateLabel = isToday(dateObj)
                    ? 'Today'
                    : isPast(dateObj)
                      ? format(dateObj, 'MMM d, yyyy')
                      : format(dateObj, 'MMM d, yyyy');
                  return (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{c.name}</p>
                          <p className="text-xs text-neutral-500">{c.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-white max-w-45 truncate">{c.topic}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className={`text-sm ${isToday(dateObj) ? 'text-yellow-400 font-medium' : 'text-white'}`}>
                          {dateLabel}
                        </p>
                        <p className="text-xs text-neutral-500">{c.time}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon type={c.type} />
                          <span className="text-sm text-neutral-400 capitalize">{c.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <ConsultationBadge status={c.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewItem(c)}
                            className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-all"
                            title="View Details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditItem(c)}
                            className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-blue-600/20 hover:text-blue-400 transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:bg-red-600/20 hover:text-red-400 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {pagination.page} of {pagination.pages} — {pagination.total} bookings
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setPagination(p => ({ ...p, page }))}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${pagination.page === page
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewModal consultation={viewItem} onClose={() => setViewItem(null)} />
      <EditModal consultation={editItem} onClose={() => setEditItem(null)} onSave={handleSave} />
      <DeleteModal consultation={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default Consultations;
