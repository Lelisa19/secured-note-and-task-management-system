import { useState } from 'react';
import { apiRequest } from '../../lib/api';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string | null;
  onSuccess?: () => void;
}

const PROJECT_TAGS = [
  { label: 'Engineering', icon: '💻', color: 'from-blue-500 to-indigo-600' },
  { label: 'Product', icon: '🚀', color: 'from-indigo-500 to-purple-600' },
  { label: 'Design', icon: '🎨', color: 'from-purple-500 to-pink-600' },
  { label: 'Marketing', icon: '📢', color: 'from-amber-500 to-orange-600' },
  { label: 'Security', icon: '🛡️', color: 'from-emerald-500 to-teal-600' },
];

export const CreateProjectModal = ({ isOpen, onClose, workspaceId, onSuccess }: CreateProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Product');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!workspaceId) {
      setError('Please select or create a workspace first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiRequest(`/workspaces/${workspaceId}/projects`, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          tag,
          deadline,
        }),
      });

      setName('');
      setDescription('');
      setDeadline('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
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
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">New Team Project</h2>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🎯 Milestone Tracker
                </span>
              </div>
              <p className="text-sm text-slate-500">Group team tasks, shared notes, and target completion dates</p>
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
            <strong className="font-semibold text-slate-900">Project Workspace Insight:</strong> Projects help calculate team completion percentages, assign dedicated task columns, and centralize note documentation for specific product releases or team initiatives.
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Tag / Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">Project Classification</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PROJECT_TAGS.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setTag(item.label)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                    tag === item.label
                      ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">Team Tag</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. SecureFlow App v2.0, API Encryption Upgrade"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
              required
            />
            <p className="text-xs text-slate-400 mt-1">This name will be displayed in workspace project cards and team progress graphs.</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Project Description & Objectives
            </label>
            <textarea
              placeholder="Key deliverables, required scope, or technical constraints..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm resize-none"
            />
          </div>

          {/* Target Deadline */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Target Completion Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">Used to alert team members regarding upcoming milestones.</p>
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
              <span>{loading ? 'Creating Project...' : '🚀 Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
