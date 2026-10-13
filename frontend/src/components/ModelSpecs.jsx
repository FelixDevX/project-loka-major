import { Cpu, CheckCircle2, ShieldCheck, Database, Layers } from 'lucide-react';

export default function ModelSpecs() {
  const specs = [
    { label: 'Neural Architecture', value: 'Google TabNet (Attentive Transformer)' },
    { label: 'Preprocessing Pipeline', value: 'Yeo-Johnson Power Transform -> StandardScaler' },
    { label: 'PCA Dimensionality Reduction', value: 'Disabled (Research proved PCA degraded TabNet attention)' },
    { label: 'Input Feature Dimensionality', value: '8 Astronomical Photometric Signals' },
    { label: 'Training Dataset', value: 'NASA Kepler Cumulative KOI Dataset' },
    { label: 'Split Stratification', value: '60% Train / 20% Val / 20% Test' },
    { label: 'Test Classification Accuracy', value: '83.2%' },
    { label: 'Test ROC-AUC Score', value: '0.921' },
    { label: 'Inference Device', value: 'CUDA Accelerated PyTorch' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">TabNet Model Specifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Scientific machine learning pipeline details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {spec.label}
            </span>
            <span className="text-xs font-semibold text-slate-800">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
