import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';
import { CreateWorkspaceModal } from '../../components/workspace/CreateWorkspaceModal';

const WorkspaceOverviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<Array<{ label: string; value: string; change: string; color: string }>>([]);
  const [members, setMembers] = useState<Array<{ id: string; name: string; role: string; avatar: string; status: 'online' | 'away' | 'offline' }>>([]);
  const [recentNotes, setRecentNotes] = useState<Array<{ id: string; title: string; author: string; time: string; tag: string }>>([]);
  const [activity, setActivity] = useState<Array<{ id: string; user: string; action: string; item: string; time: string; avatar: string }>>([]);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  const statusFor = (idx: number): 'online' | 'away' | 'offline' => {
    const n = idx % 3;
    return n === 0 ? 'online' : n === 1 ? 'away' : 'offline';
  };

  const loadWorkspaceData = async (retryAfterCreate = false) => {
    setLoading(true);
    setError(null);
    try {
      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (!Array.isArray(list) || list.length === 0) {
        if (retryAfterCreate) {
          setLoading(false);
          return;
        }
        setLoading(false);
        return;
      }
      const ws = list[0];
      const wsId = ws.id || ws.workspaceId || ws._id;
      setWorkspaceId(wsId);

      try {
        const rawNotes = await apiRequest(`/workspaces/${wsId}/notes`);
        const notes = (rawNotes?.data || rawNotes || []).slice(0, 6);
        setRecentNotes(notes.map((n: any) => ({
          id: String(n.id ?? n.noteId ?? Math.random()),
          title: n.title || 'Untitled note',
          author: n.createdByFullName || n.creatorName || n.authorName || 'Team member',
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Recently',
          tag: (n.tags && n.tags[0]) || n.category || 'Note',
        })));
      } catch {
        setRecentNotes([]);
      }

      try {
        const rawMembers = await apiRequest(`/workspaces/${wsId}/roles`);
        const memberRows = (rawMembers?.data || rawMembers || []).slice(0, 8);
        setMembers(memberRows.map((m: any, idx: number) => {
          const name = m.userFullName || m.name || m.userName || m.email || 'Team member';
          const initials = name.split(' ').map((p: string) => p?.[0] || '').join('').slice(0, 2).toUpperCase() || 'U';
          return {
            id: String(m.id || m.userId || m.membershipId || idx),
            name,
            role: m.roleName || m.role || m.position || 'Member',
            avatar: initials,
            status: statusFor(idx),
          };
        }));
      } catch {
        setMembers([]);
      }

      try {
        const rawActivity = await apiRequest(`/workspaces/${wsId}/activity`);
        const acts = (rawActivity?.data || rawActivity || []).slice(0, 5);
        setActivity(acts.map((a: any, idx: number) => {
          const user = a.userFullName || a.userName || a.actorName || a.fullName || 'Team member';
          const initials = user.split(' ').map((p: string) => p?.[0] || '').join('').slice(0, 2).toUpperCase() || 'U';
          return {
            id: String(a.id || a.activityId || idx),
            user,
            action: a.action ? a.action.replace(/_/g, ' ').toLowerCase() : 'performed an action',
            item: a.targetName || a.itemName || a.title || '',
            time: a.createdAt ? new Date(a.createdAt).toLocaleString() : 'Recently',
            avatar: initials,
          };
        }));
      } catch {
        setActivity([]);
      }

      try {
        const dash = await apiRequest('/dashboard/stats');
        const s = dash?.stats || dash || {};
        setStats([
          { label: 'Total Notes', value: String(s.totalNotes ?? 0), change: 'Active', color: 'from-indigo-500 to-indigo-600' },
          { label: 'Completed Tasks', value: String(s.completedTasks ?? 0), change: 'Done', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Active Members', value: String(members.length || (s.totalWorkspaces ?? 0)), change: 'Team', color: 'from-purple-500 to-purple-600' },
          { label: 'Projects', value: String(s.totalWorkspaces ?? 0), change: 'Active', color: 'from-amber-500 to-amber-600' },
        ]);
      } catch {
        setStats([]);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceData();
  }, []);

  const handleCreateProject = async () => {
    if (!workspaceId) {
      setShowCreate(true);
      return;
    }
    const title = prompt('New project name:');
    if (!title) return;
    try {
      await apiRequest(`/workspaces/${workspaceId}/projects`, {
        method: 'POST',
        body: JSON.stringify({ name: title, description: '' }),
      });
      loadWorkspaceData();
    } catch (e: any) {
      alert(e.message || 'Failed to create project');
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Overview</h1>
          <p className="text-slate-600">Track your team&apos;s productivity and collaboration.</p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => navigate('/workspaces')}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            📊 Reports
          </button>
          <button
            type="button"
            onClick={handleCreateProject}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all"
          >
            + New Project
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {!workspaceId ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-5xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No workspace yet</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Create your first workspace to start collaborating with your team, organize shared notes, and track tasks together.
          </p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all"
          >
            + Create Workspace
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 animate-pulse mb-4" />
                  <div className="h-8 w-16 bg-slate-100 animate-pulse mb-1 rounded" />
                  <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                </div>
              ))
            ) : (
              stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                      {stat.label === 'Total Notes' ? '📝' :
                       stat.label === 'Completed Tasks' ? '✅' :
                       stat.label === 'Active Members' ? '👥' : '📁'}
                    </div>
                    <span className={`text-sm font-medium ${stat.change === 'Done' || stat.change === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Active Members</h3>
                  <button
                    type="button"
                    onClick={() => navigate('/workspaces')}
                    className="text-indigo-600 text-sm font-medium hover:underline"
                  >
                    View all →
                  </button>
                </div>
                {members.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">
                    No team members yet. Invite people from your workspace settings.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-emerald-500' :
                            member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{member.name}</div>
                          <div className="text-xs text-slate-500">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Recent Shared Notes</h3>
                  <button
                    type="button"
                    onClick={() => navigate('/notes')}
                    className="text-indigo-600 text-sm font-medium hover:underline"
                  >
                    View all →
                  </button>
                </div>
                {recentNotes.length === 0 ? (
                  <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">
                    No shared notes yet. Create your first team note to collaborate.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentNotes.map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                        onClick={() => navigate(`/notes/${note.id}`)}
                      >
                        <div>
                          <h4 className="font-semibold text-slate-900">{note.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">by {note.author}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{note.tag}</span>
                          </div>
                        </div>
                        <span className="text-xs text-slate-400">{note.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Team Activity</h3>
              {activity.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">
                  No activity yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {activity.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {a.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-slate-900">
                          <span className="font-semibold">{a.user}</span> {a.action}{' '}
                          {a.item && <span className="text-indigo-600 font-medium">{a.item}</span>}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <CreateWorkspaceModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={() => loadWorkspaceData(true)}
      />
    </div>
  );
};

export default WorkspaceOverviewPage;
