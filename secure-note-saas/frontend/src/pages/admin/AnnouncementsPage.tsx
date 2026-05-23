import { useState } from 'react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  audience: 'all_users' | 'specific_workspaces' | 'new_users';
  publishDate: string;
  views: number;
  clicks: number;
  createdAt: string;
}

const AnnouncementsPage = () => {
  const [announcements] = useState<Announcement[]>([
    { id: 'ann-001', title: 'New Feature: AI Assistant', content: 'We are excited to announce our new AI Assistant feature! Get smart suggestions and insights to boost your productivity.', status: 'published', audience: 'all_users', publishDate: 'Jan 15, 2024', views: 2847, clicks: 423, createdAt: 'Jan 10, 2024' },
    { id: 'ann-002', title: 'Scheduled Maintenance', content: 'Our system will undergo scheduled maintenance this weekend. Expect brief downtime between 2-4 AM UTC.', status: 'scheduled', audience: 'all_users', publishDate: 'Jan 25, 2024', views: 0, clicks: 0, createdAt: 'Jan 18, 2024' },
    { id: 'ann-003', title: 'Welcome to SecureFlow!', content: 'Thanks for joining SecureFlow! Check out our getting started guide to make the most of your workspace.', status: 'published', audience: 'new_users', publishDate: 'Dec 01, 2023', views: 1245, clicks: 312, createdAt: 'Nov 25, 2023' },
    { id: 'ann-004', title: 'Pricing Update', content: 'We are updating our pricing plans to better serve our users. Current subscribers will be grandfathered.', status: 'draft', audience: 'all_users', publishDate: '—', views: 0, clicks: 0, createdAt: 'Jan 20, 2024' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [audienceFilter, setAudienceFilter] = useState<string>('All Audiences');

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || ann.status === statusFilter;
    const matchesAudience = audienceFilter === 'All Audiences' || ann.audience === audienceFilter;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'draft': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all_users': return 'All Users';
      case 'specific_workspaces': return 'Specific Workspaces';
      case 'new_users': return 'New Users';
      default: return 'All Users';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-600">Create and manage platform announcements</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <span>📢</span>
          Create Announcement
        </button>
      </div>

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
              <option>Draft</option>
              <option>Published</option>
              <option>Scheduled</option>
            </select>
            <select 
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
            >
              <option>All Audiences</option>
              <option>All Users</option>
              <option>New Users</option>
              <option>Specific Workspaces</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(announcement.status)}`}>
                    {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    ✏️
                  </button>
                  <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    ⋮
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{announcement.title}</h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{announcement.content}</p>
              <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                <span>👥 {getAudienceLabel(announcement.audience)}</span>
                <span>📅 {announcement.publishDate}</span>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">👁️</span>
                  <span className="text-sm text-slate-600">{announcement.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">👆</span>
                  <span className="text-sm text-slate-600">{announcement.clicks.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create Announcement</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter announcement title..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <textarea
                  rows={6}
                  placeholder="Write your announcement here..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Audience</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors">
                    <option>All Users</option>
                    <option>New Users</option>
                    <option>Specific Workspaces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Publish Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                  Save as Draft
                </button>
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25">
                  Publish Now
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
