import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorites?: Array<any>;
}

const folders = ['All Notes', 'Work', 'Personal', 'Favorites'];
const tagsList = ['All Tags', 'Work', 'Personal', 'Planning', 'Meeting', 'Writing', 'Ideas'];

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All Notes');
  const [selectedTag, setSelectedTag] = useState('All Tags');

  const fetchNotes = async () => {
    try {
      const data = await apiRequest('/notes?status=ACTIVE');
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async () => {
    const title = prompt('Enter note title:');
    if (!title) return;
    const content = prompt('Enter note content (optional):') || '';
    const tag = prompt('Enter tag (e.g. Work, Personal):') || 'Work';
    try {
      await apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          tags: [tag],
        }),
      });
      fetchNotes();
    } catch (error: any) {
      alert(error.message || 'Failed to create note');
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      await apiRequest(`/notes/${id}/favorite`, { method: 'POST' });
      fetchNotes();
    } catch (error: any) {
      alert(error.message || 'Failed to toggle favorite');
    }
  };

  const handleTrashNote = async (id: string) => {
    if (!confirm('Move note to trash?')) return;
    try {
      await apiRequest(`/notes/${id}/trash`, { method: 'PATCH' });
      fetchNotes();
    } catch (error: any) {
      alert(error.message || 'Failed to trash note');
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const isFavorite = note.favorites && note.favorites.length > 0;
    const matchesFolder =
      selectedFolder === 'All Notes' ||
      (selectedFolder === 'Favorites' ? isFavorite : note.tags.includes(selectedFolder));

    const matchesTag = selectedTag === 'All Tags' || note.tags.includes(selectedTag);

    return matchesSearch && matchesFolder && matchesTag;
  });

  return (
    <div className="flex min-h-[80vh] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <button 
              onClick={handleCreateNote}
              className="w-full bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              + Create Note
            </button>
          </div>
          
          {/* Folders */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              Folders
            </h3>
            <ul className="space-y-1">
              {folders.map(folder => (
                <li key={folder}>
                  <button
                    onClick={() => setSelectedFolder(folder)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFolder === folder
                        ? 'bg-slate-100 text-indigo-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {folder === 'Favorites' && '⭐ '}
                    {folder}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tags */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
              Tags
            </h3>
            <ul className="space-y-1">
              {tagsList.map(tag => (
                <li key={tag}>
                  <button
                    onClick={() => setSelectedTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-slate-100 text-indigo-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</div>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </header>

        {/* Notes Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No notes found</h3>
              <p className="text-slate-600 mb-6">Create your first note or try a different search</p>
              <button 
                onClick={handleCreateNote}
                className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                + Create Note
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredNotes.map(note => {
                const isFav = note.favorites && note.favorites.length > 0;
                return (
                  <div
                    key={note.id}
                    className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all ${
                      viewMode === 'list' ? 'flex items-start space-x-4' : ''
                    }`}
                  >
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{note.title}</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(note.id)}
                            className="text-xl hover:scale-110 transition-transform"
                          >
                            {isFav ? '⭐' : '☆'}
                          </button>
                          <button
                            onClick={() => handleTrashNote(note.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                            title="Move to trash"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-3 mb-4">{note.content || 'No content'}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {(note.tags || []).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesPage;

