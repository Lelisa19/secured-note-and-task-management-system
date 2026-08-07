import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface Invitation {
  id: string;
  workspaceId: string;
  workspace: {
    id: string;
    name: string;
    description?: string;
    owner: { fullName: string; email: string };
  };
}

interface WorkspaceInvitationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationAccepted?: () => void;
}

export const WorkspaceInvitationsModal = ({
  isOpen,
  onClose,
  onInvitationAccepted,
}: WorkspaceInvitationsModalProps) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchInvitations = async () => {
    try {
      const data = await apiRequest('/workspaces/invitations');
      setInvitations(data);
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInvitations();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccept = async (membershipId: string) => {
    setActionLoading(membershipId);
    try {
      await apiRequest(`/workspaces/invitations/${membershipId}/accept`, {
        method: 'POST',
      });
      fetchInvitations();
      if (onInvitationAccepted) onInvitationAccepted();
    } catch (err: any) {
      alert(err.message || 'Failed to accept invitation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (membershipId: string) => {
    setActionLoading(membershipId);
    try {
      await apiRequest(`/workspaces/invitations/${membershipId}/reject`, {
        method: 'POST',
      });
      fetchInvitations();
    } catch (err: any) {
      alert(err.message || 'Failed to reject invitation');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">
              📩
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Workspace Invitations</h2>
              <p className="text-xs text-slate-500">Pending team workspace invites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="font-semibold text-slate-800">No Pending Invitations</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are all caught up! Invitations to join team workspaces will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{inv.workspace.name}</h4>
                  <p className="text-xs text-slate-500">
                    Invited by <span className="font-medium text-slate-700">{inv.workspace.owner.fullName}</span> ({inv.workspace.owner.email})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(inv.id)}
                    disabled={actionLoading === inv.id}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAccept(inv.id)}
                    disabled={actionLoading === inv.id}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-md rounded-lg transition-all"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
