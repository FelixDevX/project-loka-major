import { LayoutDashboard, History, Cpu, ExternalLink, Sparkles, FileSpreadsheet } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, runCount }) {
  const navItems = [
    { id: 'classifier', label: 'Inference Console', icon: LayoutDashboard },
    { id: 'bulk', label: 'Bulk Predict', icon: FileSpreadsheet },
    { id: 'history', label: 'Run History', icon: History, badge: runCount > 0 ? runCount : null },
    { id: 'model', label: 'Model Specs', icon: Cpu },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200/80 bg-white/70 backdrop-blur-md shrink-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-sm shadow-indigo-500/20">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 tracking-tight text-base">Project Loka</span>
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">v1.0</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Kepler Exoplanet AI</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Model Status Card */}
      <div className="p-4 border-t border-slate-200/80">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Engine</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <p className="font-mono text-xs font-semibold text-slate-800">PyTorch TabNet</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Yeo-Johnson + Scaler</p>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-600 border border-slate-200 hover:text-indigo-600 transition-colors"
          >
            <span>Swagger API</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </aside>
  );
}
