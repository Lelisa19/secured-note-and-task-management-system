import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateWorkspaceModal = ({ isOpen, onClose, onSuccess }: CreateWorkspaceModalProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('🏢');
  const [accessLevel, setAccessLevel] = useState<'private' | 'team'>('team');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const createdWorkspace = await apiRequest('/workspaces', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          logo,
        }),
      });

      if (onSuccess) onSuccess();
      onClose();
      // Redirect user to the new Workspace Dashboard
      navigate(`/workspace/${createdWorkspace.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const icons = ['🏢', '💻', '🎨', '🚀', '🔬', '🎓', '⚡', '📊', '🛡️', '🌐'];

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
              {logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">Create Team Workspace</h2>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                  🔐 Encrypted Vault
                </span>
              </div>
              <p className="text-sm text-slate-500">Set up a secure collaboration environment for your team</p>
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
            <strong className="font-semibold text-slate-900">Workspace Features:</strong> Workspaces combine shared notes, task boards, and member roles under zero-knowledge encryption so your team can work securely together.
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Icon Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-800">Workspace Badge Icon</label>
              <span className="text-xs text-slate-400 font-normal">Displayed across navigation & notifications</span>
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {icons.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setLogo(icon)}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all ${
                    logo === icon
                      ? 'bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-md scale-105 ring-2 ring-indigo-400 ring-offset-2'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Engineering Squad, Product Design, Executive Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
              required
            />
            <p className="text-xs text-slate-400 mt-1">This name will appear on shared documents, invitation emails, and workspace activity logs.</p>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Workspace Description
            </label>
            <textarea
              placeholder="Summarize the purpose of this workspace (e.g., Sprint planning and core system architecture notes)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm resize-none"
            />
          </div>

          {/* Informational Access Level Radio Group */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Default Access & Security Policy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setAccessLevel('team')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  accessLevel === 'team'
                    ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">👥</span>
                  <span className="font-semibold text-sm text-slate-900">Team Collaboration</span>
                </div>
                <p className="text-xs text-slate-500">
                  Invited members can create, view, and edit shared notes based on assigned roles.
                </p>
              </div>

              <div
                onClick={() => setAccessLevel('private')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  accessLevel === 'private'
                    ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🔒</span>
                  <span className="font-semibold text-sm text-slate-900">Strict Isolation</span>
                </div>
                <p className="text-xs text-slate-500">
                  Items remain hidden by default until explicitly shared with team members.
                </p>
              </div>
            </div>
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
              <span>{loading ? 'Initializing Workspace...' : '✨ Create Workspace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
