import { useState } from 'react';
import { ArrowRight, RotateCcw, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

const FIELDS = [
  {
    name: 'koi_period',
    label: 'Orbital Period',
    unit: 'days',
    placeholder: '9.488',
    hint: 'Time taken for one full orbit',
  },
  {
    name: 'koi_period_err1',
    label: 'Period Uncertainty',
    unit: '± days',
    placeholder: '0.000027',
    hint: 'Upper uncertainty bound',
  },
  {
    name: 'koi_duration',
    label: 'Transit Duration',
    unit: 'hours',
    placeholder: '2.9575',
    hint: 'Observed transit duration',
  },
  {
    name: 'koi_duration_err1',
    label: 'Duration Uncertainty',
    unit: '± hours',
    placeholder: '0.0819',
    hint: 'Upper uncertainty bound',
  },
  {
    name: 'koi_depth',
    label: 'Transit Depth',
    unit: 'ppm',
    placeholder: '615.8',
    hint: 'Flux drop during transit',
  },
  {
    name: 'koi_depth_err1',
    label: 'Depth Uncertainty',
    unit: '± ppm',
    placeholder: '19.5',
    hint: 'Upper uncertainty bound',
  },
  {
    name: 'koi_insol',
    label: 'Insolation Flux',
    unit: 'Earth flux',
    placeholder: '93.59',
    hint: 'Solar energy received vs Earth',
  },
  {
    name: 'koi_model_snr',
    label: 'Transit SNR',
    unit: 'ratio',
    placeholder: '35.8',
    hint: 'Signal-to-noise ratio',
  },
];

// Realistic Kepler data samples for 1-click testing
const PRESETS = {
  candidate: {
    koi_period: '9.488',
    koi_period_err1: '0.000027',
    koi_duration: '2.9575',
    koi_duration_err1: '0.0819',
    koi_depth: '615.8',
    koi_depth_err1: '19.5',
    koi_insol: '93.59',
    koi_model_snr: '35.8',
  },
  falsePositive: {
    koi_period: '1.7369',
    koi_period_err1: '0.00000026',
    koi_duration: '2.4064',
    koi_duration_err1: '0.0054',
    koi_depth: '8054.0',
    koi_depth_err1: '17.6',
    koi_insol: '1561.0',
    koi_model_snr: '541.6',
  },
};

function getEmptyForm() {
  return Object.fromEntries(FIELDS.map((f) => [f.name, '']));
}

export default function PredictionForm({ onSubmit, onReset, isLoading }) {
  const [values, setValues] = useState(PRESETS.candidate);
  const [touched, setTouched] = useState({});

  function handleChange(name, raw) {
    setValues((prev) => ({ ...prev, [name]: raw }));
  }

  function handleBlur(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function applyPreset(presetKey) {
    setValues(PRESETS[presetKey]);
    setTouched({});
  }

  function handleReset() {
    setValues(getEmptyForm());
    setTouched({});
    if (onReset) onReset();
  }

  function getError(name) {
    if (!touched[name]) return null;
    const v = values[name]?.toString().trim();
    if (!v) return 'Required';
    if (isNaN(Number(v))) return 'Must be a valid number';
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.name, true]));
    setTouched(allTouched);

    const hasErrors = FIELDS.some((f) => {
      const v = values[f.name]?.toString().trim();
      return !v || isNaN(Number(v));
    });

    if (hasErrors) return;

    const payload = Object.fromEntries(
      FIELDS.map((f) => [f.name, Number(values[f.name])])
    );
    onSubmit(payload);
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
      {/* Top Header & Presets */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Observation Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            8 photometric features processed by Yeo-Johnson & Standard Scaler
          </p>
        </div>

        {/* Quick sample buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden md:inline">
            Load sample:
          </span>
          <button
            type="button"
            onClick={() => applyPreset('candidate')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100/70 transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => applyPreset('falsePositive')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50/70 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100/70 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            False Positive
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Clear all fields"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((field) => {
            const error = getError(field.name);
            return (
              <div key={field.name} className="flex flex-col">
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor={field.name}
                    className="text-xs font-semibold text-slate-700 truncate"
                    title={field.hint}
                  >
                    {field.label}
                  </label>
                  {field.unit && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {field.unit}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    inputMode="decimal"
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    onBlur={() => handleBlur(field.name)}
                    className={`w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-4 ${
                      error
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                        : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-indigo-600/10'
                    }`}
                  />
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 text-[10px]">
                    {field.name}
                  </span>
                  {error && (
                    <span className="font-medium text-rose-600">{error}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit action bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>TabNet neural network with attention mechanisms</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Computing Prediction...</span>
                </>
              ) : (
                <>
                  <span>Run Classification</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

