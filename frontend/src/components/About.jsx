const PIPELINE_STEPS = [
  { label: 'Kepler Dataset', detail: 'NASA Exoplanet Archive cumulative KOI table' },
  { label: 'Data Cleaning', detail: 'Missing values imputed with column medians' },
  { label: 'Feature Selection', detail: 'Correlation analysis removed redundant features; leakage-prone columns dropped' },
  { label: 'Train / Validation / Test Split', detail: '60 / 20 / 20 stratified split' },
  { label: 'Yeo-Johnson Transformation', detail: 'Power transform to reduce skewness' },
  { label: 'Standard Scaling', detail: 'Zero mean, unit variance normalization' },
  { label: 'TabNet', detail: 'Attentive interpretable tabular learning model' },
  { label: 'Candidate / False Positive', detail: 'Binary classification output' },
];

const FEATURES = [
  { name: 'koi_period', description: 'Orbital period of the planet transit' },
  { name: 'koi_period_err1', description: 'Upper uncertainty on orbital period' },
  { name: 'koi_duration', description: 'Duration of the observed transit' },
  { name: 'koi_duration_err1', description: 'Upper uncertainty on transit duration' },
  { name: 'koi_depth', description: 'Flux deficit during transit' },
  { name: 'koi_depth_err1', description: 'Upper uncertainty on transit depth' },
  { name: 'koi_insol', description: 'Insolation flux at the planet' },
  { name: 'koi_model_snr', description: 'Signal-to-noise of the transit model fit' },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-12">
      <div className="mx-auto max-w-5xl px-5">
        <h2
          id="about-heading"
          className="mb-1 font-mono text-xs font-medium tracking-[0.15em] text-accent-400 uppercase"
        >
          About
        </h2>
        <p className="mb-6 text-lg font-medium text-space-100">
          Classification Pipeline
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Pipeline diagram */}
          <div>
            <h3 className="mb-3 text-xs font-medium tracking-wide text-space-300 uppercase">
              Processing Pipeline
            </h3>
            <ol className="relative ml-3 border-l border-space-600/60">
              {PIPELINE_STEPS.map((step, i) => {
                const isLast = i === PIPELINE_STEPS.length - 1;
                return (
                  <li key={step.label} className={`ml-4 ${isLast ? '' : 'pb-4'}`}>
                    <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full border border-space-500 bg-space-800" />
                    <p className="text-sm font-medium text-space-100">
                      {step.label}
                    </p>
                    <p className="text-xs text-space-400">{step.detail}</p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Feature list */}
          <div>
            <h3 className="mb-3 text-xs font-medium tracking-wide text-space-300 uppercase">
              Input Features (8)
            </h3>
            <div className="rounded border border-space-600/60 bg-space-800/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-space-600/40 text-left">
                    <th className="px-3 py-2 text-xs font-medium text-space-400">Feature</th>
                    <th className="px-3 py-2 text-xs font-medium text-space-400">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map((f, i) => (
                    <tr
                      key={f.name}
                      className={
                        i < FEATURES.length - 1 ? 'border-b border-space-600/20' : ''
                      }
                    >
                      <td className="px-3 py-2 font-mono text-xs text-accent-300">
                        {f.name}
                      </td>
                      <td className="px-3 py-2 text-xs text-space-300">
                        {f.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded border border-space-600/40 bg-space-800/30 p-3">
              <p className="text-xs leading-relaxed text-space-400">
                Feature selection used Pearson correlation analysis to identify and
                remove highly redundant feature pairs (|r| ≈ 1), and mutual information
                scoring to assess each feature&rsquo;s relevance to the target class.
                Leakage-prone columns (koi_score, false positive flags) were excluded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
