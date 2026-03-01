import React, { useState } from 'react';
import {
  Users, Search, Filter, RefreshCw, X, ChevronLeft,
  ChevronRight, Mail, Phone, ExternalLink, Trash2, Edit3,
  CheckCircle2, AlertCircle, Clock, XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useContacts } from '../hooks/useContacts';
import ContactTable from '../components/contacts/ContactTable';
import StatusBadge from '../components/contacts/StatusBadge';

/* ─── Detail Modal ─────────────────────────────────────────── */
const ViewModal = ({ contact, onClose }) => {
  if (!contact) return null;
  const rows = [
    ['Full Name', contact.fullName],
    ['Email', contact.email || '—'],
    ['Phone', contact.contactNumber],
    ['Project Type', contact.projectType || '—'],
    ['Project Name', contact.projectName || '—'],
    ['Duration', contact.duration || '—'],
    ['Database', contact.database || '—'],
    ['Technologies', contact.technologies || '—'],
    ['UI Link', contact.uiLink || '—'],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Contact Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 font-semibold text-lg">
              {contact.fullName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{contact.fullName}</p>
              <StatusBadge status={contact.status} />
            </div>
          </div>
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-neutral-500 w-32 shrink-0">{label}</span>
              <span className="text-white text-right">{value}</span>
            </div>
          ))}
          {contact.message && (
            <div className="pt-2 border-t border-white/10">
              <p className="text-neutral-500 text-sm mb-1">Message</p>
              <p className="text-white text-sm whitespace-pre-wrap">{contact.message}</p>
            </div>
          )}
          <div className="pt-2 border-t border-white/10 text-xs text-neutral-500">
            Submitted {format(new Date(contact.createdAt), 'PPPp')}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Edit Status Modal ────────────────────────────────────── */
const EditModal = ({ contact, onClose, onSave }) => {
  const [status, setStatus] = useState(contact?.status || 'new');
  const [saving, setSaving] = useState(false);

  const statuses = [
    { value: 'new', label: 'New', color: 'text-blue-400' },
    { value: 'in-progress', label: 'In Progress', color: 'text-yellow-400' },
    { value: 'responded', label: 'Responded', color: 'text-green-400' },
    { value: 'closed', label: 'Closed', color: 'text-neutral-400' },
  ];

  const handleSave = async () => {
    setSaving(true);
    await onSave(contact._id, { status });
    setSaving(false);
    onClose();
  };

  if (!contact) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Update Status</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-neutral-400 mb-4">Contact: <span className="text-white">{contact.fullName}</span></p>
          {statuses.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${status === value
                ? 'bg-red-600/10 border-red-500/30 text-white'
                : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <span className={`w-2 h-2 rounded-full bg-current ${color}`} />
              <span className={color}>{label}</span>
              {status === value && <CheckCircle2 className="w-4 h-4 text-red-400 ml-auto" />}
            </button>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Confirm Modal ─────────────────────────────────── */
const DeleteModal = ({ contact, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);
  if (!contact) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">Delete Contact</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Are you sure you want to delete <span className="text-white">{contact.fullName}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all">
            Cancel
          </button>
          <button
            onClick={async () => { setDeleting(true); await onConfirm(contact._id); setDeleting(false); onClose(); }}
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

/* ─── Main Contacts Page ───────────────────────────────────── */
const Contacts = () => {
  const {
    contacts, loading, error,
    pagination, filters,
    setFilters, setPagination,
    updateContact, deleteContact,
    refresh
  } = useContacts();

  const [viewContact, setViewContact] = useState(null);
  const [editContact, setEditContact] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setFilters(f => ({ ...f, status }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleSaveStatus = async (id, data) => {
    const res = await updateContact(id, data);
    if (res.success) showToast('Status updated successfully');
    else showToast(res.message, 'error');
  };

  const handleDelete = async (id) => {
    const res = await deleteContact(id);
    if (res.success) showToast('Contact deleted');
    else showToast(res.message, 'error');
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'responded', label: 'Responded' },
    { value: 'closed', label: 'Closed' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'fullName', label: 'Name A–Z' },
    { value: '-fullName', label: 'Name Z–A' },
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

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
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
        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 min-w-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, email, project..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/50 transition-all"
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setFilters(f => ({ ...f, search: '' })); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20 transition-all text-sm">
            Search
          </button>
        </form>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={e => handleStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
        >
          {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-neutral-900">{o.label}</option>)}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
        >
          {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-neutral-900">{o.label}</option>)}
        </select>
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
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users className="w-10 h-10 text-neutral-600" />
            <p className="text-neutral-400">No contacts found</p>
            {(filters.search || filters.status) && (
              <button
                onClick={() => { setFilters({ status: '', search: '', sort: '-createdAt' }); setSearchInput(''); }}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ContactTable
            contacts={contacts}
            onView={setViewContact}
            onEdit={setEditContact}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Page {pagination.page} of {pagination.pages} — {pagination.total} contacts
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
      <ViewModal contact={viewContact} onClose={() => setViewContact(null)} />
      <EditModal contact={editContact} onClose={() => setEditContact(null)} onSave={handleSaveStatus} />
      <DeleteModal contact={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
    </div>
  );
};

export default Contacts;
