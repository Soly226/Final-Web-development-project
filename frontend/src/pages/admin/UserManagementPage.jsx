import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../lib/apiClient';
import { twMerge } from 'tailwind-merge';
import Skeleton from '../../components/ui/Skeleton';

const API_BASE = '/api';


// ─── Subcomponents ──────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon, color }) => (
  <Card className="flex items-center gap-4 p-5 border-white/5 bg-slate-900/50 backdrop-blur-md">
    <div className={twMerge('w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl shrink-0', color)}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
      <p className="text-2xl font-black text-white mt-0.5">{value}</p>
    </div>
  </Card>
);

const RoleBadge = ({ role }) => {
  const colors = {
    Admin: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    Instructor: 'bg-violet-500/15 text-violet-400 border border-violet-500/20',
    Student: 'bg-sky-500/15 text-sky-400 border border-sky-500/20',
  };
  return (
    <span className={twMerge('text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full', colors[role] || 'bg-slate-500/15 text-slate-400')}>
      {role}
    </span>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal Controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Add User Form State
  const [addForm, setAddForm] = useState({
    role: 'Student', // Student, Instructor, Admin
    full_name: '',
    username: '',
    email: '',
    password: '',
    department: '',
    level: 'Year 1',
    permissions: 'all',
    instructorRole: 'instructor'
  });

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    department: '',
    level: 'Year 1'
  });

  // ── Fetch Users ───────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.get(`${API_BASE}/admin/users`, {
        params: {
          search,
          role: roleFilter,
          page,
          limit: 8
        }
      });
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to retrieve users list.');
      showToast('Error loading users.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user, fetchUsers]);

  // ── Create User ────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = '';
      let payload = {
        full_name: addForm.full_name,
        username: addForm.username,
        email: addForm.email,
        password: addForm.password
      };

      if (addForm.role === 'Student') {
        endpoint = `${API_BASE}/admin/users/students`;
        payload.department = addForm.department;
        payload.level = addForm.level;
      } else if (addForm.role === 'Instructor') {
        endpoint = `${API_BASE}/admin/users/instructors`;
        payload.department = addForm.department;
        payload.role = addForm.instructorRole;
      } else if (addForm.role === 'Admin') {
        endpoint = `${API_BASE}/admin/users/admins`;
        payload.permissions = addForm.permissions.split(',').map(p => p.trim());
      }

      await apiClient.post(endpoint, payload);
      showToast('User created successfully!', 'success');
      setShowAddModal(false);
      setAddForm({
        role: 'Student',
        full_name: '',
        username: '',
        email: '',
        password: '',
        department: '',
        level: 'Year 1',
        permissions: 'all',
        instructorRole: 'instructor'
      });
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create user.', 'error');
    }
  };

  // ── Edit User ──────────────────────────────────────────────────────────────
  const handleEditClick = (u) => {
    setSelectedUser(u);
    setEditForm({
      full_name: u.name,
      email: u.email,
      department: u.department || '',
      level: u.level || 'Year 1'
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const type = selectedUser.role.toLowerCase();
      await apiClient.put(`${API_BASE}/admin/users/${type}/${selectedUser._id}`, editForm);
      showToast('User updated successfully!', 'success');
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update user.', 'error');
    }
  };

  // ── Delete User ────────────────────────────────────────────────────────────
  const handleDelete = async (u) => {
    if (!window.confirm(`Are you sure you want to delete ${u.name}?`)) return;
    try {
      const type = u.role.toLowerCase();
      await apiClient.delete(`${API_BASE}/admin/users/${type}/${u._id}`);
      showToast('User deleted successfully!', 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  return (
    <AdminLayout title="User Management">

      <div className="p-5 max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">User Governance</h2>
            <p className="text-sm text-slate-400 font-medium">Create, update, and manage LMS user permissions and roles.</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5">
            <span className="material-symbols-outlined">person_add</span>
            Add New User
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Accounts" value={total} icon="group" color="bg-primary/20 text-primary" />
          <StatCard title="Students" value={users.filter(u => u.role === 'Student').length || '-'} icon="school" color="bg-sky-500/20 text-sky-400" />
          <StatCard title="Faculty & Admins" value={users.filter(u => u.role !== 'Student').length || '-'} icon="shield" color="bg-amber-500/20 text-amber-400" />
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4 border-white/5 bg-slate-900/40 backdrop-blur-md flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-white/5 border border-white/10 focus:border-primary/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="w-full md:w-48 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary/40 outline-none"
            >
              <option>All Roles</option>
              <option>Student</option>
              <option>Instructor</option>
              <option>Admin</option>
            </select>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden border-white/5 bg-slate-900/40 backdrop-blur-md p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                  <Skeleton className="h-6 w-1/4 rounded-lg" />
                  <Skeleton className="h-6 w-1/5 rounded-lg" />
                  <Skeleton className="h-6 w-1/4 rounded-lg" />
                  <Skeleton className="h-6 w-12 rounded-lg ml-auto" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-20 text-center text-rose-400 font-bold">{error}</div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center text-slate-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-xs font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department / Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => {
                    const initials = u.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
                    return (
                      <tr key={u._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {u.role === 'Student' && (u.department ? `${u.department} (${u.level})` : 'General')}
                          {u.role === 'Instructor' && (u.department || 'Computer Science')}
                          {u.role === 'Admin' && 'System Access'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Edit User"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete User"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Footer */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-white/5">
                <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="py-1 px-3 text-xs"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    className="py-1 px-3 text-xs"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-white">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-lg font-black">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                >
                  <option>Student</option>
                  <option>Instructor</option>
                  <option>Admin</option>
                </select>
              </div>

              <Input
                label="Full Name"
                value={addForm.full_name}
                onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />

              <Input
                label="Username"
                value={addForm.username}
                onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />

              <Input
                label="Email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />

              <Input
                label="Password"
                type="password"
                value={addForm.password}
                onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />

              {addForm.role === 'Student' && (
                <>
                  <Input
                    label="Department"
                    value={addForm.department}
                    onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">Level/Year</label>
                    <select
                      value={addForm.level}
                      onChange={(e) => setAddForm({ ...addForm, level: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                    >
                      <option>Year 1</option>
                      <option>Year 2</option>
                      <option>Year 3</option>
                      <option>Year 4</option>
                    </select>
                  </div>
                </>
              )}

              {addForm.role === 'Instructor' && (
                <>
                  <Input
                    label="Department"
                    value={addForm.department}
                    onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">Type</label>
                    <select
                      value={addForm.instructorRole}
                      onChange={(e) => setAddForm({ ...addForm, instructorRole: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                    >
                      <option value="instructor">Instructor</option>
                      <option value="head_of_department">Head of Department</option>
                    </select>
                  </div>
                </>
              )}

              {addForm.role === 'Admin' && (
                <Input
                  label="Permissions (comma separated)"
                  value={addForm.permissions}
                  onChange={(e) => setAddForm({ ...addForm, permissions: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-white">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h3 className="text-lg font-black">Edit User ({selectedUser?.role})</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <Input
                label="Full Name"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />

              <Input
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
                className="bg-white/5 border-white/10"
              />

              {selectedUser?.role === 'Student' && (
                <>
                  <Input
                    label="Department"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase text-slate-400">Level/Year</label>
                    <select
                      value={editForm.level}
                      onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                    >
                      <option>Year 1</option>
                      <option>Year 2</option>
                      <option>Year 3</option>
                      <option>Year 4</option>
                    </select>
                  </div>
                </>
              )}

              {selectedUser?.role === 'Instructor' && (
                <Input
                  label="Department"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="bg-white/5 border-white/10"
                />
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
