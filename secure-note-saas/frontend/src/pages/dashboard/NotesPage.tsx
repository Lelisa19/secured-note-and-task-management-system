import { useState } from 'react';

interface Note {
  id: number;
  title: string;
  preview: string;
  tags: string[];
  lastUpdated: string;
  isFavorite: boolean;
  folder: string;
}

const initialNotes: Note[] = [
  {
    id: 1,
    title: 'Project Planning 2025',
    preview: 'This is a detailed plan for our upcoming projects in 2025. We will focus on...',
    tags: ['Work', 'Planning'],
    lastUpdated: '2 hours ago',
    isFavorite: true,
    folder: 'Work'
  },
  {
    id: 2,
    title: 'Meeting Notes',
    preview: 'Notes from today\'s standup meeting. Discussed progress on the new feature...',
    tags: ['Meeting', 'Work'],
    lastUpdated: 'Yesterday',
    isFavorite: false,
    folder: 'Work'
  },
  {
    id: 3,
    title: 'Shopping List',
    preview: 'Milk, eggs, bread, vegetables, fruits, coffee...',
    tags: ['Personal'],
    lastUpdated: '3 days ago',
    isFavorite: false,
    folder: 'Personal'
  },
  {
    id: 4,
    title: 'Book Ideas',
    preview: 'Some great ideas for my next book project. Let\'s explore these concepts...',
    tags: ['Writing', 'Ideas'],
    lastUpdated: '1 week ago',
    isFavorite: true,
    folder: 'Personal'
  }
];

const folders = ['All Notes', 'Work', 'Personal', 'Favorites'];
const tags = ['All Tags', 'Work', 'Personal', 'Planning', 'Meeting', 'Writing', 'Ideas'];

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All Notes');
  const [selectedTag, setSelectedTag] = useState('All Tags');

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'All Notes' || 
                        (selectedFolder === 'Favorites' ? note.isFavorite : note.folder === selectedFolder);
    const matchesTag = selectedTag === 'All Tags' || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesFolder && matchesTag;
  });

  const toggleFavorite = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
            SecureFlow
          </h1>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <button className="w-full bg-gradient-to-r from-indigo-600 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]">
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
              {tags.map(tag => (
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
      <main className="flex-1 flex flex-col">
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
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No notes found</h3>
              <p className="text-slate-600 mb-6">Create your first note or try a different search</p>
              <button className="bg-gradient-to-r from-indigo-600 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]">
                + Create Note
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all ${
                    viewMode === 'list' ? 'flex items-start space-x-4' : ''
                  }`}
                >
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{note.title}</h3>
                      <button
                        onClick={() => toggleFavorite(note.id)}
                        className="text-xl hover:scale-110 transition-transform"
                      >
                        {note.isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">{note.preview}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{note.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
