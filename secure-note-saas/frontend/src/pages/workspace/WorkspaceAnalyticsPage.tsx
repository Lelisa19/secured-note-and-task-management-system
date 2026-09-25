import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface MemberRanking {
  name: string;
  notes: number;
  tasks: number;
  score: number;
}

const WorkspaceAnalyticsPage = () => {
  const [exporting, setExporting] = useState(false);
  const [exportedMsg, setExportedMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([
    { label: 'Total Notes', value: '0', change: 'Active', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Completed Tasks', value: '0', change: 'Done', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Members', value: '0', change: 'Team', color: 'from-purple-500 to-purple-600' },
    { label: 'Files Uploaded', value: '0', change: 'Active', color: 'from-amber-500 to-amber-600' },
  ]);

  const [memberRankings, setMemberRankings] = useState<MemberRanking[]>([]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const dash = await apiRequest('/dashboard/stats');
      const s = dash?.stats || dash || {};
      setStats([
        { label: 'Total Notes', value: String(s.totalNotes ?? 0), change: 'Active', color: 'from-indigo-500 to-indigo-600' },
        { label: 'Completed Tasks', value: String(s.completedTasks ?? 0), change: 'Done', color: 'from-emerald-500 to-emerald-600' },
        { label: 'Upcoming Tasks', value: String(s.upcomingTasks ?? 0), change: 'Pending', color: 'from-purple-500 to-purple-600' },
        { label: 'Workspaces Joined', value: String(s.totalWorkspaces ?? 0), change: 'Active', color: 'from-amber-500 to-amber-600' },
      ]);

      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (Array.isArray(list) && list.length > 0) {
        const wsId = list[0].id || list[0].workspaceId || list[0]._id;
        try {
          const rawMembers = await apiRequest(`/workspaces/${wsId}/roles`);
          const rows = rawMembers?.data || rawMembers || [];
          if (Array.isArray(rows) && rows.length > 0) {
            setMemberRankings(
              rows.map((m: any) => ({
                name: m.userFullName || m.name || m.userName || m.email || 'Team Member',
                notes: 0,
                tasks: 0,
                score: 0,
              }))
            );
          } else {
            setMemberRankings([]);
          }
        } catch {
          setMemberRankings([]);
        }
      } else {
        setMemberRankings([]);
      }
    } catch {
      setMemberRankings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportReport = () => {
    setExporting(true);
    setTimeout(() => {
      const csvHeader = 'Category,Value,Change\n';
      const statsRows = stats.map((s) => `"${s.label}","${s.value}","${s.change}"`).join('\n');
      const rankingsHeader = '\n\nMember Name,Notes Created,Tasks Completed,Productivity Score\n';
      const rankingsRows = memberRankings.map((m) => `"${m.name}",${m.notes},${m.tasks},${m.score}`).join('\n');

      const blob = new Blob([csvHeader + statsRows + rankingsHeader + rankingsRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Workspace_Productivity_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExporting(false);
      setExportedMsg(true);
      setTimeout(() => setExportedMsg(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Analytics & Reports</h1>
          <p className="text-slate-600">Track your team's productivity, engagement, and performance stats.</p>
        </div>
        <button
          onClick={handleExportReport}
          disabled={exporting}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-[1.02] disabled:opacity-50"
        >
          <span>{exporting ? '⏳ Generating...' : '📊 Export CSV Report'}</span>
        </button>
      </div>

      {exportedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <span>✅</span>
          <span>Workspace productivity report exported successfully as CSV!</span>
        </div>
      )}

      {/* Analytics Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {stat.label.includes('Notes') ? '📝' :
                 stat.label.includes('Completed') ? '✅' :
                 stat.label.includes('Upcoming') ? '📅' : '👥'}
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Member Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Member Productivity Leaderboard</h3>
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading rankings...</div>
          ) : memberRankings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No member rankings available yet. Invite team members to track productivity.</div>
          ) : (
            <div className="space-y-4">
              {memberRankings.map((member, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{member.name}</div>
                    <div className="text-sm text-slate-500">
                      {member.notes} notes • {member.tasks} tasks
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">#{idx + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Weekly Workspace Activity</h3>
          <div className="space-y-3">
            <div className="p-6 text-center text-xs text-slate-400">
              Weekly activity data not available yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceAnalyticsPage;
