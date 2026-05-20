import React, { useCallback, useEffect, useState } from 'react';
import { Shield, RefreshCw, CheckCircle2, AlertCircle, UserCog } from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const sampleUsers = [
  {
    _id: 'demo-1',
    name: 'Muhammad Haseeb',
    email: 'admin@haseeb.dev',
    role: 'superadmin',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-2',
    name: 'Ayesha Khan',
    email: 'ayesha@haseeb.dev',
    role: 'admin',
    isActive: true,
    lastLogin: new Date(Date.now() - MS_PER_DAY).toISOString(),
    createdAt: new Date(Date.now() - MS_PER_DAY * 30).toISOString()
  }
];

const StatusBadge = ({ active }) => (
  <span className={`px-2 py-1 rounded-full text-xs border ${active
    ? 'bg-green-500/10 border-green-500/30 text-green-300'
    : 'bg-red-500/10 border-red-500/30 text-red-300'
    }`}>
    {active ? 'Active' : 'Inactive'}
  </span>
);

const RoleBadge = ({ role }) => (
  <span className={`px-2 py-1 rounded-full text-xs border ${role === 'superadmin'
    ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
    }`}>
    {role}
  </span>
);

const Roles = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [edits, setEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [usingSample, setUsingSample] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
      setUsingSample(false);
    } catch (err) {
      setUsers(sampleUsers);
      setUsingSample(true);
      showToast(err.response?.data?.message || 'Unable to load users. Showing demo data.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const canEdit = user?.role === 'superadmin';

  const handleEditChange = (id, key, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value
      }
    }));
  };

  const handleSave = async (id) => {
    const existing = edits[id];
    const baseUser = users.find((item) => item._id === id);
    if (!baseUser) {
      showToast('User not found', 'error');
      return;
    }
    const changes = {};
    if (existing?.role !== undefined && existing.role !== baseUser.role) {
      changes.role = existing.role;
    }
    if (existing?.isActive !== undefined && existing.isActive !== baseUser.isActive) {
      changes.isActive = existing.isActive;
    }
    if (Object.keys(changes).length === 0) {
      showToast('No changes to save', 'error');
      return;
    }
    try {
      setSavingId(id);
      const res = await api.put(`/admin/users/${id}`, changes);
      setUsers((prev) => prev.map((item) => (item._id === id ? res.data.data : item)));
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      showToast('User updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`rounded-xl px-4 py-3 text-sm border ${toast.type === 'error'
          ? 'bg-red-600/10 border-red-500/30 text-red-300'
          : 'bg-green-600/10 border-green-500/30 text-green-300'
          }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 inline mr-2" /> : <CheckCircle2 className="w-4 h-4 inline mr-2" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Roles & Access</h1>
            <p className="text-sm text-neutral-500">Manage admin roles and account status.</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {usingSample && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Demo data is displayed because the live users API is unavailable.
        </div>
      )}

      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2 text-sm text-neutral-400">
          <UserCog className="w-4 h-4 text-red-400" />
          <span>{users.length} admin accounts</span>
        </div>
        <div className="divide-y divide-white/5">
          {users.map((account) => {
            const draft = edits[account._id]
              ? {
                  role: edits[account._id].role ?? account.role,
                  isActive: edits[account._id].isActive ?? account.isActive
                }
              : { role: account.role, isActive: account.isActive };
            return (
              <div key={account._id} className="px-6 py-4 grid lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 items-center">
                <div>
                  <p className="text-sm font-medium text-white">{account.name}</p>
                  <p className="text-xs text-neutral-500">{account.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-500">Role</label>
                  {canEdit ? (
                    <select
                      value={draft.role}
                      onChange={(event) => handleEditChange(account._id, 'role', event.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white"
                    >
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  ) : (
                    <RoleBadge role={account.role} />
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-500">Status</label>
                  {canEdit ? (
                    <button
                      type="button"
                      onClick={() => handleEditChange(account._id, 'isActive', !draft.isActive)}
                      className={`px-3 py-1 rounded-full text-xs border ${draft.isActive
                        ? 'bg-green-500/10 border-green-500/30 text-green-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                        }`}
                    >
                      {draft.isActive ? 'Active' : 'Inactive'}
                    </button>
                  ) : (
                    <StatusBadge active={account.isActive} />
                  )}
                </div>
                <div className="text-xs text-neutral-500">
                  <p>Last login</p>
                  <p className="text-white">{account.lastLogin ? format(new Date(account.lastLogin), 'PP') : '—'}</p>
                </div>
                <div>
                  {canEdit && (
                    <button
                      onClick={() => handleSave(account._id)}
                      disabled={savingId === account._id}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 transition-all disabled:opacity-70"
                    >
                      {savingId === account._id ? 'Saving...' : 'Save'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roles;
