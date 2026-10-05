'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuthStore } from '@/store/useAuthStore';
import {
  apiGetAdminStats,
  apiGetAdminUsers,
  apiToggleBlockUser,
  apiGetAdminCategories,
  apiCreateCategory,
  apiDeleteCategory,
  apiGetAdminQuestions,
  apiDeleteQuestion,
  apiGetAdminReports,
  apiUpdateReport,
} from '@/services/userService';
import { AdminStats, AdminUser, AdminReport, BackendCategory } from '@/lib/types';
import {
  Users,
  FolderTree,
  HelpCircle,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const token = user?.token || '';

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'categories' | 'questions' | 'reports'>('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);

  // Add Category form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsData, usersData, categoriesData, questionsData, reportsData] = await Promise.all([
        apiGetAdminStats(token),
        apiGetAdminUsers(token),
        apiGetAdminCategories(token),
        apiGetAdminQuestions(token),
        apiGetAdminReports(token),
      ]);
      setStats(statsData);
      setUsers(usersData);
      setCategories(categoriesData);
      setQuestions(questionsData);
      setReports(reportsData);
    } catch (err: any) {
      showNotification(err.message || 'Error loading admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // User Actions
  const handleToggleBlock = async (userId: number, currentStatus: 'active' | 'blocked') => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    setActionLoading(true);
    try {
      await apiToggleBlockUser(token, userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
      showNotification(`User successfully marked as ${nextStatus}.`);
      // Update stats
      if (stats) {
        setStats({
          ...stats,
          active_users: nextStatus === 'active' ? stats.active_users + 1 : stats.active_users - 1,
          blocked_users: nextStatus === 'blocked' ? stats.blocked_users + 1 : stats.blocked_users - 1,
        });
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to update user status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Category Actions
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setActionLoading(true);
    try {
      await apiCreateCategory(token, newCatName.trim(), newCatDesc.trim());
      setNewCatName('');
      setNewCatDesc('');
      setShowAddCat(false);
      showNotification('Category created successfully.');
      const updatedCats = await apiGetAdminCategories(token);
      setCategories(updatedCats);
      if (stats) setStats({ ...stats, total_categories: updatedCats.length });
    } catch (err: any) {
      showNotification(err.message || 'Failed to create category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (catId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setActionLoading(true);
    try {
      await apiDeleteCategory(token, catId);
      setCategories((prev) => prev.filter((c) => c.id !== catId));
      showNotification('Category deleted successfully.');
      if (stats) setStats({ ...stats, total_categories: Math.max(0, stats.total_categories - 1) });
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Question Actions
  const handleDeleteQuestion = async (qId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setActionLoading(true);
    try {
      await apiDeleteQuestion(token, qId);
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
      showNotification('Question deleted.');
      if (stats) setStats({ ...stats, total_questions: Math.max(0, stats.total_questions - 1) });
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete question', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Report Actions
  const handleResolveReport = async (reportId: number, status: 'resolved' | 'reviewed') => {
    setActionLoading(true);
    try {
      await apiUpdateReport(token, reportId, status);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
      showNotification(`Report marked as ${status}.`);
      if (stats && status === 'resolved') {
        setStats({ ...stats, pending_reports: Math.max(0, stats.pending_reports - 1) });
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to update report', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Administrator Portal
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold mt-1">Platform Control Center</h1>
            <p className="text-sm muted mt-0.5">
              Live moderation, user management, and API metrics backed by MySQL database.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-muted flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`my-4 p-3 rounded-lg text-sm flex items-center justify-between ${
              feedback.type === 'error'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-xs opacity-70 hover:opacity-100 font-bold ml-4">
              ✕
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border my-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: `Users (${users.length})`, icon: Users },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
            { id: 'questions', label: `Questions (${questions.length})`, icon: HelpCircle },
            { id: 'reports', label: `Reports (${reports.filter((r) => r.status === 'pending').length} pending)`, icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-ink hover:border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs muted font-medium">Total Registered Users</div>
                <div className="text-2xl font-bold mt-1">{stats?.total_users ?? 0}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  {stats?.active_users ?? 0} active · {stats?.blocked_users ?? 0} blocked
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs muted font-medium">Categories</div>
                <div className="text-2xl font-bold mt-1">{stats?.total_categories ?? 0}</div>
                <div className="text-xs muted mt-1">Active content topics</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs muted font-medium">Questions & Answers</div>
                <div className="text-2xl font-bold mt-1">{stats?.total_questions ?? 0}</div>
                <div className="text-xs muted mt-1">{stats?.total_answers ?? 0} answers posted</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <div className="text-xs muted font-medium">Moderation Reports</div>
                <div className="text-2xl font-bold mt-1">{stats?.total_reports ?? 0}</div>
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {stats?.pending_reports ?? 0} pending review
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card/60">
              <h3 className="text-base font-semibold mb-2">Backend Architecture Notice</h3>
              <p className="text-sm muted leading-relaxed">
                The PHP backend server (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">http://localhost:8000</code>) is configured in headless JSON REST mode. All web traffic, authentication guards, and interface views are powered by the Next.js frontend with SSR route protection.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">User Accounts & Roles</h2>
              <span className="text-xs muted">Click to toggle active or suspended status</span>
            </div>

            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-xs uppercase font-medium text-muted-foreground">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Activity</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30">
                      <td className="p-3.5">
                        <div className="font-medium text-ink">{u.name}</div>
                        <div className="text-xs muted">{u.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs muted">
                        {u.question_count} questions · {u.answer_count} answers
                      </td>
                      <td className="p-3.5 text-right">
                        {u.id === user?.id ? (
                          <span className="text-xs text-muted-foreground">Current user</span>
                        ) : (
                          <button
                            onClick={() => handleToggleBlock(u.id, u.status)}
                            disabled={actionLoading}
                            className={`px-3 py-1 rounded-md text-xs font-medium border flex items-center gap-1.5 ml-auto ${
                              u.status === 'active'
                                ? 'border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                          >
                            {u.status === 'active' ? (
                              <>
                                <Lock className="w-3 h-3" /> Suspend
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3 h-3" /> Unblock
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories Management */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Categories Catalog</h2>
                <p className="text-xs muted">Managed in MySQL database</p>
              </div>
              <button
                onClick={() => setShowAddCat(!showAddCat)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-ink text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                {showAddCat ? 'Cancel' : 'Add Category'}
              </button>
            </div>

            {showAddCat && (
              <form onSubmit={handleCreateCategory} className="p-4 border border-border rounded-xl bg-card space-y-3">
                <h3 className="text-sm font-semibold">New Category Details</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Personal Finance & Taxes"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief topic overview"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-primary text-primary-ink text-xs font-medium rounded-lg"
                >
                  Create Category
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="p-4 border border-border rounded-xl bg-card flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{c.name}</div>
                    <div className="text-xs muted mt-1">{c.description || 'No description provided.'}</div>
                  </div>
                  {c.id && (
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      disabled={actionLoading}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-muted ml-3"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Questions */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Platform Questions ({questions.length})</h2>
            {questions.length === 0 ? (
              <div className="p-8 text-center border border-border rounded-xl muted text-sm">
                No questions recorded yet in the database.
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-sm text-ink">{q.title}</div>
                      <p className="text-xs muted mt-1 line-clamp-2">{q.description}</p>
                      <div className="text-xs muted mt-2 flex items-center gap-3">
                        <span>Category: <strong>{q.category_name}</strong></span>
                        <span>Author: {q.author_name} ({q.author_email})</span>
                        <span>{q.answer_count} answers</span>
                        <span>{new Date(q.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      disabled={actionLoading}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-muted shrink-0"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">User Reports & Moderation Flags</h2>
            {reports.length === 0 ? (
              <div className="p-8 text-center border border-border rounded-xl muted text-sm">
                No user reports on record. Everything looks clean!
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
                {reports.map((r) => (
                  <div key={r.id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            r.status === 'pending'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50'
                          }`}
                        >
                          {r.status}
                        </span>
                        <span className="text-xs muted">Reported by {r.reporter_name}</span>
                      </div>
                      <div className="text-sm font-medium mt-1">Reason: "{r.reason}"</div>
                      {r.question_title && (
                        <div className="text-xs muted mt-1">Related question: {r.question_title}</div>
                      )}
                    </div>
                    {r.status === 'pending' && (
                      <button
                        onClick={() => handleResolveReport(r.id, 'resolved')}
                        disabled={actionLoading}
                        className="px-3 py-1 rounded bg-primary text-primary-ink text-xs font-medium flex items-center gap-1.5 shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
