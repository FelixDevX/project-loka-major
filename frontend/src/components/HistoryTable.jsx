import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HistoryTable({ history, onSelectRecord }) {
  if (!history || history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <Clock className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No Inference History Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Runs executed during this session will automatically appear here with telemetry and timestamped verdicts.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Session Inference Logs</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time classification audit trail</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {history.length} {history.length === 1 ? 'Record' : 'Records'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6">Timestamp</th>
              <th className="py-3 px-4">Period (d)</th>
              <th className="py-3 px-4">Depth (ppm)</th>
              <th className="py-3 px-4">Duration (h)</th>
              <th className="py-3 px-4">SNR</th>
              <th className="py-3 px-4">Verdict</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4 text-right">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {history.map((item) => {
              const isCandidate = item.prediction === 'CANDIDATE';
              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => onSelectRecord && onSelectRecord(item)}
                >
                  <td className="py-3.5 px-6 font-sans text-slate-500 whitespace-nowrap">
                    {item.time}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.payload.koi_period}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.payload.koi_depth}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.payload.koi_duration}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {item.payload.koi_model_snr}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        isCandidate
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCandidate ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 text-rose-600" />
                      )}
                      {item.prediction}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {(item.probability * 100).toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans text-slate-400">
                    {item.latency}ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
