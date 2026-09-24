import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';
import { CreateNoteModal } from '../../components/modals/CreateNoteModal';

interface SharedNote {
  id: string | number;
  title: string;
  author: string;
  lastEdited: string;
  collaborators: string[];
  tag: string;
  comments: number;
}

const SharedNotesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notesList, setNotesList] = useState<SharedNote[]>([]);

  const loadWorkspaceNotes = async () => {
    setLoading(true);
    try {
      const workspaces = await apiRequest('/workspaces');
      const list = workspaces?.data || workspaces || [];
      if (Array.isArray(list) && list.length > 0) {
        const wsId = list[0].id || list[0].workspaceId || list[0]._id;
        setWorkspaceId(wsId);
        try {
          const res = await apiRequest(`/workspaces/${wsId}/notes`);
          const items = res?.data || res || [];
          if (Array.isArray(items)) {
            setNotesList(
              items.map((n: any) => ({
                id: n.id || n._id,
                title: n.title || 'Untitled Note',
                author: n.createdByFullName || n.authorName || 'Team Member',
                lastEdited: n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Recently',
                collaborators: ['TM'],
                tag: (n.tags && n.tags[0]) || 'Workspace Note',
                comments: 0,
              }))
            );
          }
        } catch {
          setNotesList([]);
        }
      } else {
        setNotesList([]);
      }
    } catch {
      setNotesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaceNotes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shared Workspace Notes</h1>
          <p className="text-slate-600">Encrypted collaborative notes accessible to your workspace team.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              List
            </button>
          </div>
          <button 
            onClick={() => setIsNoteModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-[1.02]"
          >
            <span>📝 + New Workspace Note</span>
          </button>
        </div>
      </div>

      {/* Informational Guidance Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <span className="text-xl leading-none">💡</span>
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">Encrypted Shared Vault:</strong> Workspace notes are automatically synced and protected with zero-knowledge encryption so only invited team members can decrypt them.
        </div>
      </div>

      {/* Shared Notes Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : notesList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Shared Notes Yet</h3>
          <p className="text-slate-500 text-xs mb-4 max-w-sm mx-auto">
            Create encrypted notes for your workspace team to document meeting minutes, specifications, and plans.
          </p>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            + New Workspace Note
          </button>
        </div>
      ) : (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {notesList.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                    {note.tag}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    💬 <span className="font-medium text-slate-600">{note.comments}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-4 leading-snug">{note.title}</h3>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {note.collaborators.map((avatar, idx) => (
                      <div key={idx} className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white shadow-sm">
                        {avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">by {note.author}</span>
                </div>
                <span className="text-[11px] text-slate-400">Edited {note.lastEdited}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        workspaceId={workspaceId || undefined}
        onSuccess={loadWorkspaceNotes}
      />
    </div>
  );
};

export default SharedNotesPage;
