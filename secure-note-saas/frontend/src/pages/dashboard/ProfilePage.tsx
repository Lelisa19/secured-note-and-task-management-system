import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

interface UserProfile {
  fullName: string;
  email: string;
  bio?: string;
  avatarUrl?: string | null;
  twitterUrl?: string;
  githubUrl?: string;
}

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<Array<{ label: string; value: number }>>([
    { label: 'Notes Created', value: 0 },
    { label: 'Tasks Completed', value: 0 },
    { label: 'Days Active', value: 0 },
    { label: 'Collaborations', value: 0 },
  ]);
  const [form, setForm] = useState<UserProfile>({
    fullName: '',
    email: '',
    bio: '',
    avatarUrl: null,
    twitterUrl: '',
    githubUrl: '',
  });

  const initials = (() => {
    const name = form.fullName || form.email || 'U';
    return name.split(' ').map(p => p?.[0] || '').join('').slice(0, 2).toUpperCase();
  })();

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        setForm(f => ({
          ...f,
          fullName: parsed.fullName || f.fullName,
          email: parsed.email || f.email,
          bio: parsed.bio || f.bio,
          avatarUrl: parsed.avatarUrl || f.avatarUrl,
          twitterUrl: parsed.twitterUrl || f.twitterUrl,
          githubUrl: parsed.githubUrl || f.githubUrl,
        }));
      }

      try {
        const dash = await apiRequest('/dashboard/stats');
        const s = dash?.stats || dash || {};
        setStats([
          { label: 'Notes Created', value: Number(s.totalNotes ?? 0) },
          { label: 'Tasks Completed', value: Number(s.completedTasks ?? 0) },
          { label: 'Days Active', value: Number(s.totalWorkspaces ?? 0) > 0 ? 1 : 0 },
          { label: 'Collaborations', value: Number(s.upcomingTasks ?? 0) },
        ]);
      } catch {
        // ignore; keep zeros
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        fullName: form.fullName,
        bio: form.bio || '',
        twitterUrl: form.twitterUrl || '',
        githubUrl: form.githubUrl || '',
        avatarUrl: form.avatarUrl || null,
      };
      const updated = await apiRequest('/dashboard/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const merged = { ...stored, ...updated, ...payload, email: form.email };
      localStorage.setItem('user', JSON.stringify(merged));
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-600">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                {initials}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{form.fullName || 'New user'}</h2>
              <p className="text-slate-600 mb-4">{form.email}</p>
              <button
                type="submit"
                form="profile-form"
                disabled={saving}
                className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center p-3 rounded-xl bg-slate-50">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h3>

          <form id="profile-form" onSubmit={onSave} className="space-y-4">
            {message && (
              <div className={`text-sm rounded-xl px-4 py-3 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  readOnly
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              <textarea
                rows={4}
                name="bio"
                value={form.bio || ''}
                onChange={onChange}
                placeholder="Tell others a bit about yourself…"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  name="twitterUrl"
                  value={form.twitterUrl || ''}
                  onChange={onChange}
                  placeholder="https://twitter.com/your-handle"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <input
                  type="url"
                  name="githubUrl"
                  value={form.githubUrl || ''}
                  onChange={onChange}
                  placeholder="https://github.com/your-username"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 gap-3">
              <button
                type="button"
                onClick={() => load()}
                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium"
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
