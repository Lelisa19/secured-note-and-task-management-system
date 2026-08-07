import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/api';

export const NoteEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      apiRequest(`/notes/${id}`)
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setTags(data.tags || []);
          setIsEncrypted(data.isEncrypted || false);
        })
        .catch((err) => {
          console.error('Failed to load note:', err);
          setMessage('Failed to load note details');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      if (id && id !== 'new') {
        await apiRequest(`/notes/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title,
            content,
            tags,
            isEncrypted,
          }),
        });
        setMessage('Note saved successfully!');
      } else {
        await apiRequest('/notes', {
          method: 'POST',
          body: JSON.stringify({
            title,
            content,
            tags,
            isEncrypted,
          }),
        });
        setMessage('Note created!');
        navigate(`/dashboard/notes`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              className="accent-indigo-600"
            />
            <span>🔒 Encrypted Note</span>
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm border border-emerald-200">
          {message}
        </div>
      )}

      {/* Editor Body */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Note Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none focus:ring-0 bg-transparent"
        />

        {/* Tags Bar */}
        <div className="flex flex-wrap items-center gap-2 py-2 border-y border-slate-100">
          <span className="text-xs font-semibold text-slate-400">TAGS:</span>
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-slate-400 hover:text-red-500 font-bold text-xs"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag + Enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="text-xs bg-transparent border-none outline-none text-slate-600 placeholder:text-slate-300 w-32"
          />
        </div>

        {/* Content Textarea */}
        <textarea
          placeholder="Start writing your thoughts, markdown formatting supported..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          className="w-full text-slate-700 leading-relaxed border-none outline-none focus:ring-0 bg-transparent resize-y text-base font-sans"
        />
      </div>
    </div>
  );
};

export default NoteEditorPage;
