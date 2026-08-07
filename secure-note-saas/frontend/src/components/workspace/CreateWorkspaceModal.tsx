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
      // Automatically redirect user to the new Workspace Dashboard!
      navigate(`/workspace/${createdWorkspace.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const icons = ['🏢', '💻', '🎨', '🚀', '🔬', '🎓', '⚡', '📊'];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
              {logo}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create Workspace</h2>
              <p className="text-xs text-slate-500">Set up a shared team collaboration space</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Workspace Icon (Optional)
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {icons.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setLogo(icon)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                    logo === icon
                      ? 'bg-indigo-100 border-2 border-indigo-600 scale-105 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Development Team, Marketing Squad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="What is this workspace for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-lg rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
