import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/api';

interface TrashNote {
  id: string;
  title: string;
  updatedAt: string;
}

const TrashPage = () => {
  const [items, setItems] = useState<TrashNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<TrashNote[]>('/notes?status=TRASHED');
      setItems(data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id: string) => {
    try {
      await apiRequest(`/notes/${id}/restore`, { method: 'PATCH' });
      fetchTrash();
    } catch (err: any) {
      alert(err.message || 'Failed to restore note');
    }
  };

  const handleDeletePermanent = async (id: string) => {
    if (!confirm('Permanently delete this note? This action cannot be undone.')) return;
    try {
      await apiRequest(`/notes/${id}`, { method: 'DELETE' });
      fetchTrash();
    } catch (err: any) {
      alert(err.message || 'Failed to delete note');
    }
  };

  const handleEmptyTrash = async () => {
    if (items.length === 0) return;
    if (!confirm('Permanently delete all items in trash?')) return;
    try {
      for (const item of items) {
        await apiRequest(`/notes/${item.id}`, { method: 'DELETE' });
      }
      fetchTrash();
    } catch (err: any) {
      alert(err.message || 'Failed to empty trash');
    }
  };

  const stats = [
    { label: 'Notes in Trash', value: String(items.length) },
    { label: 'System Retention', value: '30 Days' },
    { label: 'Storage Status', value: 'Clean' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Trash</h1>
          <p className="text-slate-600">Restore or permanently delete items from your vault.</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={handleEmptyTrash}
            className="px-4 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors text-xs font-semibold"
          >
            🗑️ Empty Trash
          </button>
        )}
      </div>

      {/* Trash Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="text-xs font-semibold text-slate-500 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-5xl mb-3">🗑️</div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Trash is empty</h2>
          <p className="text-slate-500 text-sm">When you delete notes or tasks, they will appear here.</p>
        </div>
      ) : (
        /* Trash Items */
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xl">
                    📝
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Note • Deleted {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRestore(item.id)}
                    className="px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors text-xs font-semibold"
                  >
                    ↩️ Restore
                  </button>
                  <button 
                    onClick={() => handleDeletePermanent(item.id)}
                    className="px-3.5 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors text-xs font-semibold"
                  >
                    🗑️ Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashPage;
