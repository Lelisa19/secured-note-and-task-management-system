import React, { useState } from 'react';
import { apiRequest } from '../../lib/api';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspaceId?: string;
}

const CATEGORIES = [
  { name: 'Work', icon: '💼', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Personal', icon: '👤', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'Planning', icon: '🎯', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { name: 'Meeting', icon: '🤝', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Ideas', icon: '💡', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'Security', icon: '🛡️', color: 'bg-rose-50 text-rose-700 border-rose-200' },
];

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  workspaceId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Work']);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (!tags.includes(catName)) {
      setTags([catName, ...tags.filter((t) => !CATEGORIES.some((c) => c.name === t))]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Note title is required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = workspaceId ? `/workspaces/${workspaceId}/notes` : '/notes';
      await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          tags,
          isEncrypted,
          ...(workspaceId ? { workspaceId } : {}),
        }),
      });

      // Reset form
      setTitle('');
      setContent('');
      setTags(['Work']);
      setIsEncrypted(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create note. Please try again.');
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
              📝
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Create New Secure Note</h2>
              <p className="text-indigo-200 text-xs sm:text-sm">
                Organize thoughts, meeting minutes, and docs with cloud sync.
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
                <strong className="font-semibold text-slate-900">Workspace Collaboration:</strong> This note will be published to your active team workspace and accessible to all authorized members.
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
              Note Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Strategic Roadmap & Security Guidelines"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-base"
            />
          </div>

          {/* Folder / Category Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Select Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl min-h-[52px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-indigo-700 text-xs font-semibold rounded-xl shadow-xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500 text-slate-400 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <div className="flex-1 flex items-center min-w-[140px]">
                <input
                  type="text"
                  placeholder="Add tag & press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none px-1 py-1"
                />
                {tagInput.trim() && (
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Note Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Note Content
              </label>
              <span className="text-xs text-slate-400 font-medium">
                {content.length} chars • {content.trim() ? content.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              rows={6}
              placeholder="Write your note here... (Markdown formatted text supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 font-normal focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-sm leading-relaxed resize-y"
            ></textarea>
          </div>

          {/* Security & Encryption Switch */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl text-emerald-400">
                🔒
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">End-to-End Encryption</h4>
                <p className="text-xs text-slate-300">Protect note content with AES-256 vault encryption</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEncrypted}
                onChange={(e) => setIsEncrypted(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Information Tip Box */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex items-start space-x-3">
            <span className="text-xl">💡</span>
            <div className="text-xs text-indigo-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Pro Tip:</strong>
              Notes can be marked as favorite for quick access from your sidebar folder filter.
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
                  <span>Saving Note...</span>
                </>
              ) : (
                <>
                  <span>📝 Create Note</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
