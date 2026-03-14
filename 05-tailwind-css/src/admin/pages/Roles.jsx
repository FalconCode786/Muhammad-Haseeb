import React, { useMemo, useState } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  Search,
  UserCog,
  X,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const roleStyles = {
  admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  superadmin: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
};

const statusStyles = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  inactive: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
};

const buildStats = (list) => {
  const total = list.length;
  const active = list.filter((item) => item.isActive).length;
  const admins = list.filter((item) => item.role === 'admin').length;
  const superadmins = list.filter((item) => item.role === 'superadmin').length;
  return { total, active, admins, superadmins };
};

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

const formatLoginDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return format(date, 'PPp');
};

const RoleModal = ({ user, onClose, onSave, disabled }) => {
  const [role, setRole] = useState(user?.role || 'admin');
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    await onSave(user._id, { role, isActive });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Update Role</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-sm text-neutral-400">
            <p className="font-medium text-white">{user.name}</p>
            <p>{user.email}</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={disabled}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/40 disabled:opacity-60"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Status</label>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              disabled={disabled}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${isActive
                ? 'bg-green-600/10 border-green-500/30 text-green-400'
                : 'bg-neutral-700/30 border-neutral-600/40 text-neutral-300'
                } disabled:opacity-60`}
            >
              {isActive ? 'Active' : 'Inactive'}
              <span className="text-xs">Toggle</span>
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving || disabled}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Roles = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ search: '', role: 'all', status: 'all' });
  const [editingUser, setEditingUser] = useState(null);

  const isSuperAdmin = currentUser?.role === 'superadmin';
  const currentUserId = currentUser?.id;
  const canEditUser = (item) => (
    isSuperAdmin
    && currentUserId
    && item?._id?.toString() !== currentUserId
  );
  const canEdit = canEditUser(editingUser);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      const nextUsers = res.data.data.users || [];
      setUsers(nextUsers);
      setStats(res.data.data.stats || buildStats(nextUsers));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === 'all' || item.role === filters.role;
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active' ? item.isActive : !item.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [filters, users]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (id, updates) => {
    try {
      const res = await api.patch(`/admin/users/${id}`, updates);
      const updatedUser = res.data.data;
      setUsers((prev) => {
        const next = prev.map((item) => (item._id === updatedUser._id ? updatedUser : item));
        setStats(buildStats(next));
        return next;
      });
      setEditingUser(null);
      showToast('User updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-neutral-400">{error}</p>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} />
      <RoleModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
        disabled={!canEdit}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white">Roles & Access</h1>
            <p className="text-sm text-neutral-500">Manage admin roles, access, and status.</p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {!isSuperAdmin && (
        <div className="rounded-2xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-sm text-yellow-200">
          You have view-only access. Ask a super admin to modify roles.
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-neutral-500">Total admins</p>
            <p className="text-2xl font-semibold text-white">{stats.total}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-neutral-500">Active</p>
            <p className="text-2xl font-semibold text-white">{stats.active}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-neutral-500">Admins</p>
            <p className="text-2xl font-semibold text-white">{stats.admins}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-neutral-500">Super admins</p>
            <p className="text-2xl font-semibold text-white">{stats.superadmins}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search by name or email"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-red-500/40"
          />
        </div>
        <select
          value={filters.role}
          onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/40"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500/40"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs uppercase text-neutral-500 border-b border-white/10">
          <span className="col-span-3">Admin</span>
          <span className="col-span-2">Role</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-3">Last Login</span>
          <span className="col-span-2 text-right">Action</span>
        </div>
        {filteredUsers.length === 0 ? (
          <p className="px-6 py-10 text-sm text-neutral-500 text-center">No admins match the filters.</p>
        ) : (
          filteredUsers.map((item) => (
            <div key={item._id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 last:border-0 items-center text-sm">
              <div className="col-span-3">
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-xs text-neutral-500">{item.email}</p>
              </div>
              <div className="col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleStyles[item.role]}`}>
                  {item.role}
                </span>
              </div>
              <div className="col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${item.isActive ? statusStyles.active : statusStyles.inactive}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="col-span-3 text-neutral-400 text-xs">
                {item.lastLogin ? formatLoginDate(item.lastLogin) : '—'}
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => setEditingUser(item)}
                  disabled={!canEditUser(item)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition-all text-xs disabled:opacity-50 disabled:hover:bg-white/5"
                >
                  <UserCog className="w-4 h-4" /> Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Roles;
