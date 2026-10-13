const METRICS = [
  { label: 'Test Accuracy', value: '83.01%' },
  { label: 'Test Precision', value: '87.59%' },
  { label: 'Test Recall', value: '76.35%' },
  { label: 'Test F1', value: '81.59%' },
  { label: 'Test ROC-AUC', value: '92.07%' },
];

const MODEL_DETAILS = [
  { label: 'Architecture', value: 'TabNet' },
  { label: 'Features', value: '8 (photometric)' },
  { label: 'PCA', value: 'Not used in final model' },
  { label: 'Task', value: 'Binary classification' },
  { label: 'Target', value: 'CANDIDATE / FALSE POSITIVE' },
];

export default function ModelInfo() {
  return (
    <section id="model" aria-labelledby="model-heading" className="py-12">
      <div className="mx-auto max-w-5xl px-5">
        <h2
          id="model-heading"
          className="mb-1 font-mono text-xs font-medium tracking-[0.15em] text-accent-400 uppercase"
        >
          Model
        </h2>
        <p className="mb-6 text-lg font-medium text-space-100">
          TabNet Classifier
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Model details */}
          <div className="rounded border border-space-600/60 bg-space-800/40 p-4">
            <h3 className="mb-3 text-xs font-medium tracking-wide text-space-300 uppercase">
              Configuration
            </h3>
            <dl className="space-y-2">
              {MODEL_DETAILS.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <dt className="text-space-300">{item.label}</dt>
                  <dd className="font-mono text-space-100">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Metrics */}
          <div className="rounded border border-space-600/60 bg-space-800/40 p-4">
            <h3 className="mb-3 text-xs font-medium tracking-wide text-space-300 uppercase">
              Test Set Performance
            </h3>
            <dl className="space-y-2">
              {METRICS.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <dt className="text-space-300">{item.label}</dt>
                  <dd className="font-mono text-accent-300">{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[11px] text-space-400">
              Evaluated on a held-out 20% stratified test split.
            </p>
          </div>
        </div>

        {/* PCA experiment note */}
        <div className="mt-5 rounded border border-space-600/40 bg-space-800/30 p-4">
          <h3 className="mb-2 text-xs font-medium tracking-wide text-space-300 uppercase">
            PCA Experiment
          </h3>
          <p className="text-sm leading-relaxed text-space-300">
            PCA was evaluated as an alternative feature representation. Five principal
            components retained approximately 97% of the variance, but the PCA-based
            TabNet experiment achieved lower test ROC-AUC (89.42%) than the original
            feature representation (92.07%). Therefore, the original eight features were
            retained for the final model.
          </p>
        </div>
      </div>
    </section>
  );
}
