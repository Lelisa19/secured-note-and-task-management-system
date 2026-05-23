import { useState } from 'react';

const FilesPage = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const files = [
    { id: 1, name: 'Design System.pdf', type: 'pdf', size: '2.4 MB', uploaded: '2 hours ago', uploader: 'JD' },
    { id: 2, name: 'Wireframes.sketch', type: 'sketch', size: '15.2 MB', uploaded: 'Yesterday', uploader: 'JS' },
    { id: 3, name: 'Project Brief.docx', type: 'doc', size: '1.1 MB', uploaded: '3 days ago', uploader: 'MJ' },
    { id: 4, name: 'Logo.png', type: 'image', size: '256 KB', uploaded: '1 week ago', uploader: 'JD' },
  ];

  const storageUsed = 68;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Files</h1>
          <p className="text-slate-600">Manage your workspace files and documents.</p>
        </div>
        <div className="flex space-x-3">
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
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all">
            + Upload File
          </button>
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Storage Usage</h3>
          <span className="text-sm font-medium text-slate-600">{storageUsed}% used</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${storageUsed}%` }}
          />
        </div>
        <p className="text-sm text-slate-500">6.8 GB of 10 GB used</p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer">
        <div className="text-5xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Drag & Drop files here</h3>
        <p className="text-slate-600 mb-4">or click to browse your computer</p>
        <button className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
          Browse Files
        </button>
      </div>

      {/* Files List/Grid */}
      <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {files.map((file) => (
          <div key={file.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                file.type === 'pdf' ? 'bg-red-100' :
                file.type === 'doc' ? 'bg-blue-100' :
                file.type === 'image' ? 'bg-emerald-100' :
                'bg-purple-100'
              }`}>
                {file.type === 'pdf' ? '📄' :
                 file.type === 'doc' ? '📝' :
                 file.type === 'image' ? '🖼️' : '📦'}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{file.name}</h4>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.uploaded}</span>
                </div>
              </div>
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {file.uploader}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesPage;
