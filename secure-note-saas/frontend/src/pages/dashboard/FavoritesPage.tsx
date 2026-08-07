import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  favorites?: Array<any>;
}

const FavoritesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await apiRequest('/notes?status=ACTIVE');
      const favs = data.filter((n: Note) => n.favorites && n.favorites.length > 0);
      setNotes(favs);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (id: string) => {
    try {
      await apiRequest(`/notes/${id}/favorite`, { method: 'POST' });
      fetchFavorites();
    } catch (error: any) {
      alert(error.message || 'Failed to update favorite');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>
          <p className="text-slate-600">Your most important notes and items.</p>
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
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-5xl mb-3">⭐</div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">No favorite notes yet</h3>
          <p className="text-slate-500 text-sm">Star notes to quickly access them here!</p>
        </div>
      ) : (
        /* Favorite Notes */
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Favorite Notes ({notes.length})</h2>
          <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{note.title}</h3>
                  <button 
                    onClick={() => toggleFavorite(note.id)}
                    className="text-amber-500 hover:scale-110 transition-transform"
                    title="Remove from favorites"
                  >
                    ⭐
                  </button>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{note.content || 'No content'}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{note.tags[0] || 'Note'}</span>
                  <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;

