import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

const fmtDate = (d?: string | null) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString(); } catch { return String(d); }
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('INFO');
  const [submitting, setSubmitting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest('/admin/announcements');
      setAnnouncements(Array.isArray(res) ? res : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' ||
      (statusFilter === 'Published' && ann.isActive) ||
      (statusFilter === 'Draft' && !ann.isActive);
    const matchesType = typeFilter === 'All Types' || ann.type.toUpperCase() === typeFilter.toUpperCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  async function createAnnouncement() {
    if (!newTitle.trim() || !newContent.trim()) {
      setPostError('Title and content are required.');
      return;
    }
    try {
      setSubmitting(true);
      setPostError(null);
      const created = await apiRequest('/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim(), content: newContent.trim(), type: newType }),
      });
      setAnnouncements((prev) => [created, ...prev]);
      setNewTitle('');
      setNewContent('');
      setNewType('INFO');
      setShowCreateModal(false);
    } catch (e: any) {
      setPostError(e?.message || 'Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  }

  const statusBadge = (isActive: boolean) =>
    isActive
      ? 'bg-emerald-100 text-emerald-700 Published'
      : 'bg-slate-100 text-slate-700 Draft';

  const typeBadge = (t: string) => {
    const up = (t || 'INFO').toUpperCase();
    switch (up) {
      case 'INFO': return 'bg-blue-100 text-blue-700';
      case 'WARNING': return 'bg-amber-100 text-amber-700';
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-700';
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-600">Create and manage platform announcements</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            {loading ? '⏳' : '🔄'} Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
          >
            <span>📢</span> Create Announcement
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl flex-1 sm:flex-none sm:w-80">
              <span className="text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-slate-700"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option>All Types</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Maintenance</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Total:</span>
            <span className="font-bold text-slate-900">{filteredAnnouncements.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center text-slate-500">Loading announcements…</div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-500 mb-2">
            {searchQuery || statusFilter !== 'All Status' || typeFilter !== 'All Types'
              ? 'No announcements match your filters.'
              : 'No announcements yet — create your first platform announcement!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((ann) => (
            <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(ann.isActive)}`}>
                      {ann.isActive ? 'Published' : 'Draft'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeBadge(ann.type)}`}>{ann.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      title="Toggle active"
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                      onClick={() => {
                        alert('Announcement toggle not wired in the backend yet.');
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{ann.title}</h3>
                <p className="text-sm text-slate-600 mb-4 line-clamp-4 whitespace-pre-wrap">{ann.content}</p>
                <div className="mt-auto">
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                    <span>📅 Created: {fmtDate(ann.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create Announcement</h2>
              <button
                onClick={() => { setShowCreateModal(false); setPostError(null); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {postError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">⚠️ {postError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter announcement title..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your announcement here..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="INFO">ℹ️ Info</option>
                    <option value="WARNING">⚠️ Warning</option>
                    <option value="MAINTENANCE">🛠️ Maintenance</option>
                    <option value="CRITICAL">🚨 Critical</option>
                    <option value="NEW_FEATURE">✨ New Feature</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button
                  disabled={submitting}
                  onClick={() => { setShowCreateModal(false); setPostError(null); }}
                  className="flex-1 min-w-[140px] px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={submitting}
                  onClick={createAnnouncement}
                  className="flex-1 min-w-[140px] px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                >
                  {submitting ? 'Publishing…' : '📢 Publish Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
