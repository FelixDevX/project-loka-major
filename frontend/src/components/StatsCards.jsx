import { Cpu, TrendingUp, Zap, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

export default function StatsCards({ result, runCount }) {
  const isCandidate = result?.prediction === 'CANDIDATE';
  const isFalsePositive = result?.prediction === 'FALSE POSITIVE';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      {/* Card 1: Active Model */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Active Model</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Cpu className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">TabNet</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            <span>8 Features &bull; Yeo-Johnson Scaler</span>
          </div>
        </div>
      </div>

      {/* Card 2: Current Status / Verdict */}
      <div className={`rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm ${
        isCandidate
          ? 'border-emerald-200 bg-emerald-50/50'
          : isFalsePositive
            ? 'border-rose-200 bg-rose-50/50'
            : 'border-slate-200/90 bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Latest Verdict</span>
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            isCandidate
              ? 'bg-emerald-100 text-emerald-700'
              : isFalsePositive
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-100 text-slate-600'
          }`}>
            {isCandidate ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : isFalsePositive ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
          </div>
        </div>
        <div className="mt-2">
          <div className={`text-xl font-extrabold tracking-tight truncate ${
            isCandidate ? 'text-emerald-700' : isFalsePositive ? 'text-rose-700' : 'text-slate-900'
          }`}>
            {result ? result.prediction : 'Awaiting Run'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {result ? `${(result.probability * 100).toFixed(1)}% Confidence` : 'Select sample & classify'}
          </div>
        </div>
      </div>

      {/* Card 3: Validation Accuracy */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Test Accuracy</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">83.2%</div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <span>ROC-AUC: 0.921 &bull; F1: 0.81</span>
          </div>
        </div>
      </div>

      {/* Card 4: Session Inferences */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Session Activity</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-xl font-extrabold text-slate-900 tracking-tight">{runCount} Runs</div>
          <div className="mt-1 text-xs text-slate-500">
            <span>Avg Latency &lt; 20ms &bull; CUDA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
