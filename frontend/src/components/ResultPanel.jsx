import { CheckCircle2, AlertCircle, X, ShieldCheck, Zap, Radio, Orbit } from 'lucide-react';

export default function ResultPanel({ result, onDismiss, activePayload }) {
  if (!result) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs min-h-[380px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-4 shadow-2xs">
          <Orbit className="h-7 w-7 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
        <h3 className="text-base font-bold text-slate-800">Telemetry Standby</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
          Configure astronomical parameters and click <span className="font-semibold text-indigo-600">Run Classification</span> to generate real-time TabNet predictions.
        </p>

        <div className="mt-6 flex flex-col gap-2 w-full max-w-xs text-left">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 border border-slate-100">
            <span className="text-slate-400">Target Pipeline</span>
            <span className="font-semibold text-slate-800">Kepler Photometry</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 border border-slate-100">
            <span className="text-slate-400">Feature Scaling</span>
            <span className="font-semibold text-slate-800">Yeo-Johnson &plus; Standard</span>
          </div>
        </div>
      </div>
    );
  }

  const { prediction, probability } = result;
  const pct = (probability * 100).toFixed(1);
  const isCandidate = prediction === 'CANDIDATE';

  return (
    <div
      role="region"
      aria-label="Classification Result"
      className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 transition-all duration-300 shadow-xs min-h-[380px] flex flex-col justify-between ${
        isCandidate
          ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/90 via-white to-white text-emerald-950'
          : 'border-rose-200 bg-gradient-to-b from-rose-50/90 via-white to-white text-rose-950'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isCandidate
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              }`}
            >
              {isCandidate ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase ${
                    isCandidate ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  Model Diagnosis
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200/80">
                  <ShieldCheck className="h-3 w-3 text-indigo-600" />
                  Verified
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight mt-0.5 text-slate-900">
                {prediction}
              </h3>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors"
            aria-label="Dismiss result"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Confidence Gauge */}
        <div className="mt-5 rounded-xl bg-white/95 p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Prediction Confidence
            </span>
            <span
              className={`font-mono text-sm font-bold ${
                isCandidate ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {pct}%
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isCandidate
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            {isCandidate
              ? 'Transit characteristics match physical planetary transits. Low flux deficit and stable period uncertainty indicate high likelihood of an exoplanet candidate.'
              : 'Transit characteristics point to false positive signatures, such as eclipsing binary star interactions or instrumental flux distortion.'}
          </p>
        </div>
      </div>

      {activePayload && (
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="bg-white/80 p-2 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-sans">Period</span>
            <span className="font-semibold text-slate-700">{activePayload.koi_period} d</span>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[10px] font-sans">Depth</span>
            <span className="font-semibold text-slate-700">{activePayload.koi_depth} ppm</span>
          </div>
        </div>
      )}
    </div>
  );
}


