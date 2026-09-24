import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspaceId?: string;
}

const PRIORITIES = [
  { id: 'LOW', label: 'Low', icon: '🟢', desc: 'Routine & optional items', color: 'border-slate-200 bg-slate-50 text-slate-700' },
  { id: 'MEDIUM', label: 'Medium', icon: '🟡', desc: 'Standard deliverable', color: 'border-amber-200 bg-amber-50 text-amber-800' },
  { id: 'HIGH', label: 'High', icon: '🔴', desc: 'Critical / urgent item', color: 'border-rose-200 bg-rose-50 text-rose-800' },
] as const;

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workspaceId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDueDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          status,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          ...(workspaceId ? { workspaceId } : {}),
        }),
      });

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('TODO');
      setDueDate('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 sm:px-8 py-6 text-white relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors text-lg"
          >
            ✕
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              ✅
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Create New Task</h2>
              <p className="text-indigo-200 text-xs sm:text-sm">
                Organize deliverables, set priority levels, and track progress.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {workspaceId && (
            <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100/80 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-slate-700">
              <span className="text-xl leading-none">🏢</span>
              <div>
                <strong className="font-semibold text-slate-900">Workspace Task Board:</strong> Assigning tasks in workspace mode makes them visible on team task boards and activity feeds.
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prepare API specifications and deployment pipeline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-base"
            />
          </div>

          {/* Priority Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPriority(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? `${p.color} ring-2 ring-indigo-500 shadow-sm font-semibold`
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-sm font-bold">{p.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Initial Status & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
              >
                <option value="TODO">📋 To Do</option>
                <option value="IN_PROGRESS">⚡ In Progress</option>
                <option value="DONE">🎉 Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleQuickDate(0)}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(1)}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDate(7)}
                  className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  Next Week
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Description / Action Steps
            </label>
            <textarea
              rows={4}
              placeholder="Add details, link dependencies, or list sub-tasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-normal focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm leading-relaxed resize-y"
            ></textarea>
          </div>

          {/* Information Tip Box */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div className="text-xs text-indigo-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Kanban Organization:</strong>
              Tasks created here will automatically appear on your interactive Kanban board. Click any task card on the board to advance its status column.
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-500 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Task...</span>
                </>
              ) : (
                <>
                  <span>✅ Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
