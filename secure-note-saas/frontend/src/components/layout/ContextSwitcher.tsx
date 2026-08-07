import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../lib/context/AppContext';

interface ContextSwitcherProps {
  currentContext: 'personal' | string;
}

export const ContextSwitcher = ({ currentContext }: ContextSwitcherProps) => {
  const navigate = useNavigate();
  const { workspaces } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeWorkspace = workspaces.find((w) => w.id === currentContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPersonal = () => {
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleSelectWorkspace = (wsId: string) => {
    setIsOpen(false);
    navigate(`/workspace/${wsId}`);
  };

  const displayLabel =
    currentContext === 'personal' ? 'Personal' : activeWorkspace?.name || 'Workspace';

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Current Context
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-medium transition-all text-sm border border-slate-200 shadow-sm"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            {currentContext === 'personal'
              ? '👤'
              : activeWorkspace?.logo || activeWorkspace?.name?.[0] || 'W'}
          </div>
          <span className="truncate max-w-[150px]">{displayLabel}</span>
          <span className="text-slate-400 text-xs">▼</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Switch Context
          </div>

          <button
            onClick={handleSelectPersonal}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
              currentContext === 'personal'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">👤</span>
              <div className="text-left">
                <div className="font-medium">Personal</div>
                <div className="text-xs text-slate-400">Private Space</div>
              </div>
            </div>
            {currentContext === 'personal' && <span className="text-indigo-600 font-bold">✓</span>}
          </button>

          <div className="my-2 border-t border-slate-100" />

          <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Workspaces</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 text-[10px]">
              {workspaces.length}
            </span>
          </div>

          {workspaces.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400 text-center">
              No workspaces yet. Create one from your Personal Dashboard.
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {workspaces.map((ws) => {
                const isSelected = currentContext === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => handleSelectWorkspace(ws.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                        {ws.logo || ws.name[0]}
                      </div>
                      <div className="text-left truncate max-w-[140px]">
                        <div className="font-medium truncate">{ws.name}</div>
                      </div>
                    </div>
                    {isSelected && <span className="text-indigo-600 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
