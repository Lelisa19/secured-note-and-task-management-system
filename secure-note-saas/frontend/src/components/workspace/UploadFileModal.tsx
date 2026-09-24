import { useState } from 'react';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FILE_CATEGORIES = [
  { name: 'Document', icon: '📄', desc: 'PDF, DOCX, TXT files' },
  { name: 'Design Asset', icon: '🎨', desc: 'Figma, Sketch, PNG, SVG' },
  { name: 'Code & Data', icon: '💻', desc: 'JSON, CSV, ZIP, JS' },
  { name: 'Media', icon: '🖼️', desc: 'Images, MP4, Audio' },
];

export const UploadFileModal = ({ isOpen, onClose, onSuccess }: UploadFileModalProps) => {
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('Document');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !fileName.trim()) {
      setError('Please select a file or enter a file name.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate upload process
    setTimeout(() => {
      setLoading(false);
      setFileName('');
      setSelectedFile(null);
      if (onSuccess) onSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Informational Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-indigo-600 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
              📁
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900">Upload Workspace File</h2>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  🔐 AES-256 Storage
                </span>
              </div>
              <p className="text-sm text-slate-500">Securely upload and tag workspace files for team collaboration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Informational Guidance Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-emerald-50/80 border border-indigo-100/80 rounded-2xl flex items-start gap-3">
          <span className="text-xl leading-none">💡</span>
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="font-semibold text-slate-900">Encrypted Cloud Storage:</strong> All uploaded files undergo client-side key validation before reaching cloud storage. Maximum file size per upload is 500 MB.
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Picker / Drag Area */}
          <div className="relative border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-2xl p-6 text-center hover:border-indigo-400 transition-all cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="text-4xl mb-2">📤</div>
            {selectedFile ? (
              <div>
                <div className="font-semibold text-slate-900 text-sm">{selectedFile.name}</div>
                <div className="text-xs text-indigo-600 mt-0.5">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</div>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-slate-800 text-sm">Click or Drag & Drop File Here</div>
                <div className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, Figma, PNG, ZIP (Up to 500MB)</div>
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">File Category Tag</label>
            <div className="grid grid-cols-2 gap-2.5">
              {FILE_CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    category === cat.name
                      ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{cat.name}</div>
                    <div className="text-[10px] text-slate-500">{cat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1">Display Title / Name</label>
            <input
              type="text"
              placeholder="e.g. Design System Specs v1.2"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-500 hover:shadow-lg hover:shadow-indigo-500/25 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span>{loading ? 'Uploading File...' : '📤 Upload Encrypted File'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
