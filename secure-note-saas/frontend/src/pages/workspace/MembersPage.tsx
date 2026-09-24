import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { InviteMemberModal } from '../../components/workspace/InviteMemberModal';

interface Member {
  id: string | number;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  joined: string;
}

const MembersPage = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [membersList, setMembersList] = useState<Member[]>([]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (Array.isArray(list) && list.length > 0) {
        const wsId = list[0].id || list[0].workspaceId || list[0]._id;
        setWorkspaceId(wsId);

        try {
          const rawMembers = await apiRequest(`/workspaces/${wsId}/roles`);
          const rows = rawMembers?.data || rawMembers || [];
          if (Array.isArray(rows)) {
            setMembersList(
              rows.map((m: any, idx: number) => ({
                id: m.id || m.userId || idx,
                name: m.userFullName || m.name || m.userName || m.email || 'Team Member',
                email: m.email || m.userEmail || 'member@workspace.com',
                role: m.roleName || m.role || 'Member',
                status: idx === 0 ? 'online' : 'offline',
                joined: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Recently',
              }))
            );
          }
        } catch {
          setMembersList([]);
        }
      } else {
        setMembersList([]);
      }
    } catch {
      setMembersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const totalMembers = membersList.length;
  const activeMembers = membersList.filter((m) => m.status === 'online').length;
  const adminCount = membersList.filter((m) => m.role.toLowerCase().includes('admin')).length;

  const stats = [
    { label: 'Total Workspace Members', value: String(totalMembers), icon: '👥' },
    { label: 'Active Online', value: String(activeMembers), icon: '🟢' },
    { label: 'Workspace Admins', value: String(adminCount), icon: '👑' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
          <p className="text-slate-600">Manage workspace permissions, roles, and collaboration access.</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-[1.02]"
        >
          <span>📩 + Invite Member</span>
        </button>
      </div>

      {/* Informational Guidance Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <span className="text-xl leading-none">💡</span>
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">Workspace Role Control:</strong> Admins can invite team members and modify permissions. Members have access to shared workspace note vaults and task boards.
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
            </div>
            <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Members Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : membersList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Team Members Yet</h3>
          <p className="text-slate-500 text-xs mb-4 max-w-sm mx-auto">
            Invite team members to collaborate on workspace notes, task boards, and files.
          </p>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + Invite Member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Member Details</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role & Permissions</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Presence</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Joined Date</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {membersList.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-emerald-500' :
                            member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{member.name}</div>
                          <div className="text-xs text-slate-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        member.role === 'Admin' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        member.role === 'Member' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {member.role === 'Admin' ? '👑 Admin' : member.role === 'Member' ? '👤 Member' : '👁️ Guest'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                        member.status === 'online' ? 'text-emerald-600' :
                        member.status === 'away' ? 'text-amber-600' :
                        'text-slate-500'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          member.status === 'online' ? 'bg-emerald-500 animate-pulse' :
                          member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{member.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => alert(`Edit member permissions for ${member.name}`)}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                        >
                          ⚙️ Edit Role
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceId={workspaceId}
        onSuccess={loadMembers}
      />
    </div>
  );
};

export default MembersPage;
