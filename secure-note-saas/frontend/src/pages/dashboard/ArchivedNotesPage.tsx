import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

const ArchivedNotesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchivedNotes = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/notes?status=ARCHIVED');
      setNotes(data || []);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await apiRequest(`/notes/${id}/restore`, { method: 'PATCH' });
      fetchArchivedNotes();
    } catch (err: any) {
      alert(err.message || 'Failed to restore note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this note?')) return;
    try {
      await apiRequest(`/notes/${id}`, { method: 'DELETE' });
      fetchArchivedNotes();
    } catch (err: any) {
      alert(err.message || 'Failed to delete note');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Archived Notes</h1>
          <p className="text-slate-600">Restore or permanently delete archived notes.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setView('grid')}
            className={`px-4 py-2 rounded-xl transition-colors ${view === 'grid' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-xl transition-colors ${view === 'list' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            List
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-5xl mb-3">📦</div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">No archived notes</h2>
          <p className="text-slate-500 text-sm">When you archive notes, they will appear here.</p>
        </div>
      ) : (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{note.title}</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full mt-2 inline-block">
                    {(note.tags && note.tags[0]) || 'Note'}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2 mb-4">{note.content || 'No content'}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(note.id)}
                  className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors text-sm font-semibold"
                >
                  ↩️ Restore
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors text-sm font-semibold"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedNotesPage;
