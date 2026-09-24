import { useState } from 'react';
import { apiRequest } from '../../lib/api';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string | null;
  onSuccess?: () => void;
}

const ROLES = [
  {
    name: 'Admin',
    icon: '👑',
    color: 'from-amber-500 to-orange-600',
    description: 'Full workspace management: invite/remove members, update roles, manage billing & all team notes.',
  },
  {
    name: 'Member',
    icon: '👤',
    color: 'from-indigo-500 to-emerald-500',
    description: 'Can create, edit, and collaborate on shared workspace notes, team task boards, and projects.',
  },
  {
    name: 'Guest',
    icon: '👁️',
    color: 'from-slate-500 to-slate-700',
    description: 'Restricted read-only or comment access to assigned notes & tasks without administrative control.',
  },
];

export const InviteMemberModal = ({ isOpen, onClose, workspaceId, onSuccess }: InviteMemberModalProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Member email address is required');
      return;
    }

    if (!workspaceId) {
      setError('No active workspace selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiRequest(`/workspaces/${workspaceId}/invitations`, {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          roleName: role,
        }),
      });

      setEmail('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/join-workspace?id=${workspaceId || 'demo'}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Informational Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">Invite Team Member</h2>
                <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-200">
                  📩 Team Access
                </span>
              </div>
              <p className="text-sm text-slate-500">Add collaborators to share encrypted workspace notes and tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Informational Guidance Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 border border-indigo-100/80 rounded-2xl flex items-start gap-3">
          <span className="text-xl leading-none">💡</span>
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="font-semibold text-slate-900">Security Note:</strong> Team members receive an invitation link and notification. Encrypted content permissions align automatically with the selected role.
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Member Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
              required
            />
          </div>

          {/* Role Selection with Rich Explanations */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Assign Role & Access Level
            </label>
            <div className="space-y-3">
              {ROLES.map((r) => (
                <div
                  key={r.name}
                  onClick={() => setRole(r.name)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    role === r.name
                      ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-2xl pt-0.5">{r.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm text-slate-900">{r.name}</span>
                      {role === r.name && (
                        <span className="text-xs bg-indigo-600 text-white font-semibold px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shareable Link Quick Info Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-900">Direct Invitation Link</div>
              <div className="text-[11px] text-slate-500">Copy link to share directly in team chats or Slack</div>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>{copiedLink ? '✓ Copied!' : '📋 Copy Link'}</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-lg hover:shadow-indigo-500/25 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span>{loading ? 'Sending Invitation...' : '📩 Send Invitation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
