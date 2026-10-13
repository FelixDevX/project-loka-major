import { Sparkles, ExternalLink, Activity, ChevronRight, Search, Bell } from 'lucide-react';

export default function Header({ result, activeTab, setActiveTab }) {
  const borderColor = !result
    ? 'border-slate-200/80'
    : result.prediction === 'CANDIDATE'
      ? 'border-emerald-200'
      : 'border-rose-200';

  return (
    <header className={`sticky top-0 z-30 border-b bg-white/85 backdrop-blur-md transition-colors duration-500 ${borderColor}`}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Left: Brand / Breadcrumbs */}
        <div className="flex items-center gap-4">
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-base">Loka</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-slate-400">Kepler DR25</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-slate-800 capitalize">
              {activeTab === 'classifier' ? 'Inference Console' : activeTab === 'bulk' ? 'Bulk Predict' : activeTab === 'history' ? 'Run History' : 'Model Specs'}
            </span>
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-3">
          {/* Mobile Tab switcher */}
          <div className="flex lg:hidden items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('classifier')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'classifier' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Console
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'bulk' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bulk
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Logs
            </button>
          </div>

          {/* Model Status Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>TabNet Online</span>
          </div>

          {/* Docs Link */}
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <span>FastAPI Docs</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          </a>

          {/* Workspace Avatar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-xs">
            PL
          </div>
        </div>
      </div>
    </header>
  );
}


