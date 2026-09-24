import { useState } from 'react';
import { UploadFileModal } from '../../components/workspace/UploadFileModal';

interface FileItem {
  id: number;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  uploader: string;
}

const FilesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [files, setFiles] = useState<FileItem[]>([]);

  const storageUsed = files.length > 0 ? 12 : 0;

  const handleUploadSuccess = () => {
    setFiles([
      {
        id: Date.now(),
        name: 'New Workspace Asset.pdf',
        type: 'pdf',
        size: '3.1 MB',
        uploaded: 'Just now',
        uploader: 'You',
      },
      ...files,
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Workspace Files</h1>
          <p className="text-slate-600">Store and access team assets under zero-knowledge encryption.</p>
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
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 transform hover:scale-[1.02]"
          >
            <span>📤 + Upload File</span>
          </button>
        </div>
      </div>

      {/* Informational Banner */}
      <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 border border-indigo-100 rounded-2xl flex items-start gap-3">
        <span className="text-xl leading-none">💡</span>
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">AES-256 Storage Vault:</strong> Files uploaded to this workspace are automatically encrypted and distributed to authorized team members.
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-slate-900">Encrypted Storage Capacity</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            {storageUsed}% Consumed
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${storageUsed}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{files.length} file(s) stored in workspace vault</span>
          <span>⚡ High-Speed Sync Active</span>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div 
        onClick={() => setIsUploadModalOpen(true)}
        className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/60 transition-all cursor-pointer group"
      >
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📤</div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Drag & Drop Encrypted Assets</h3>
        <p className="text-xs text-slate-500 mb-4">Upload PDF, Sketch, DOCX, Images, or archives up to 500 MB</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsUploadModalOpen(true);
          }}
          className="px-5 py-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all"
        >
          Select File to Upload
        </button>
      </div>

      {/* Files List / Grid */}
      {files.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-xs">
          No files uploaded to this workspace yet. Click "+ Upload File" or drop a file above.
        </div>
      ) : (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  file.type === 'pdf' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                  file.type === 'doc' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  file.type === 'image' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                  'bg-purple-50 text-purple-600 border border-purple-100'
                }`}>
                  {file.type === 'pdf' ? '📄' :
                   file.type === 'doc' ? '📝' :
                   file.type === 'image' ? '🖼️' : '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 text-sm truncate">{file.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.uploaded}</span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                  {file.uploader}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default FilesPage;
