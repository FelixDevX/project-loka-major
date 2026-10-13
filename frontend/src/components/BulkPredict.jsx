import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  FileText,
  X,
  AlertCircle,
  Loader2,
  Table2,
} from 'lucide-react';
import { postBulkPrediction } from '../services/api';

const REQUIRED_COLUMNS = [
  'koi_period',
  'koi_period_err1',
  'koi_duration',
  'koi_duration_err1',
  'koi_depth',
  'koi_depth_err1',
  'koi_insol',
  'koi_model_snr',
];

const SAMPLE_CSV = `koi_period,koi_period_err1,koi_duration,koi_duration_err1,koi_depth,koi_depth_err1,koi_insol,koi_model_snr
9.488,0.000027,2.9575,0.0819,615.8,19.5,93.59,35.8
1.7369,0.00000026,2.4064,0.0054,8054.0,17.6,1561.0,541.6
3.5225,0.0000065,1.8272,0.0542,342.5,14.3,198.7,28.1`;

export default function BulkPredict() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [reportName, setReportName] = useState('');
  const fileInputRef = useRef(null);

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile);
      setError(null);
      setResults(null);
    } else {
      setError('Please upload a valid CSV file.');
    }
  }, []);

  function handleFileSelect(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);
      setResults(null);
    }
  }

  function handleRemoveFile() {
    setFile(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function downloadTemplate() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loka_bulk_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit() {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await postBulkPrediction(file);
      setResults(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during bulk prediction.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownloadPDF() {
    const jsPDFModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const jsPDF = jsPDFModule.default;
    const autoTable = autoTableModule.default;

    const doc = new jsPDF({ orientation: 'landscape' });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const name = reportName.trim() || 'Bulk Prediction Report';

    // Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('Project Loka — Kepler Exoplanet Classification', 14, 20);

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text(name, 14, 30);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${dateStr} at ${timeStr}`, 14, 37);
    doc.text(
      `Total: ${results.total}  |  Candidates: ${results.candidates}  |  False Positives: ${results.false_positives}`,
      14,
      43
    );

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 46, 283, 46);

    // Table
    const headers = [
      '#',
      'Period (d)',
      'Period Err',
      'Duration (h)',
      'Duration Err',
      'Depth (ppm)',
      'Depth Err',
      'Insol (flux)',
      'SNR',
      'Prediction',
      'Confidence',
    ];

    const rows = results.results.map((r) => [
      r.row,
      r.koi_period,
      r.koi_period_err1,
      r.koi_duration,
      r.koi_duration_err1,
      r.koi_depth,
      r.koi_depth_err1,
      r.koi_insol,
      r.koi_model_snr,
      r.prediction,
      `${(r.probability * 100).toFixed(1)}%`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 7.5,
        cellPadding: 2.5,
        font: 'helvetica',
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 9) {
          if (data.cell.raw === 'CANDIDATE') {
            data.cell.styles.textColor = [5, 150, 105];
            data.cell.styles.fontStyle = 'bold';
          } else {
            data.cell.styles.textColor = [225, 29, 72];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      },
    });

    // Footer on each page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Project Loka — ${name} — Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 8
      );
    }

    const safeName = name.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
    doc.save(`${safeName}_${now.toISOString().slice(0, 10)}.pdf`);
  }

  const fileSizeKB = file ? (file.size / 1024).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-sm shadow-violet-500/20">
            <Table2 className="h-4.5 w-4.5" />
          </div>
          Bulk Prediction
        </h1>
        <p className="text-xs text-slate-500 mt-1 ml-11.5">
          Upload a CSV with multiple observations and get batch classifications powered by TabNet.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 p-4 text-sm text-rose-800 shadow-xs"
        >
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Upload Error:</span> {error}
          </div>
        </div>
      )}

      {/* Upload Card */}
      {!results && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
          {/* Template & Format info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Upload Observation Data
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                CSV must include headers: {REQUIRED_COLUMNS.join(', ')}
              </p>
            </div>
            <button
              type="button"
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/80 bg-indigo-50/70 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100/70 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Template CSV
            </button>
          </div>

          {/* Report Name Input */}
          <div className="mb-5">
            <label htmlFor="report-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Report Name <span className="text-slate-400 font-normal">(optional — appears on PDF)</span>
            </label>
            <input
              id="report-name"
              type="text"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="e.g. Kepler Q4 Batch Analysis"
              className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:outline-none focus:ring-4 focus:border-indigo-600 focus:ring-indigo-600/10 hover:border-slate-300"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 sm:p-14 cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
                : file
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <FileSpreadsheet className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{fileSizeKB} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:border-rose-200 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Upload className="h-7 w-7" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Drop your CSV file here
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    or <span className="text-indigo-600 font-medium">click to browse</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span>Batch inference with vectorized TabNet pipeline</span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!file || isLoading}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing Batch…</span>
                </>
              ) : (
                <>
                  <span>Run Bulk Classification</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Rows</span>
                <FileText className="h-4 w-4 text-slate-400" />
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{results.total}</p>
              <p className="text-xs text-slate-500 mt-0.5">observations processed</p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Candidates</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-emerald-700 tracking-tight">{results.candidates}</p>
              <p className="text-xs text-emerald-600/70 mt-0.5">
                {results.total > 0 ? ((results.candidates / results.total) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 to-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">False Positives</span>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <p className="text-3xl font-black text-rose-700 tracking-tight">{results.false_positives}</p>
              <p className="text-xs text-rose-600/70 mt-0.5">
                {results.total > 0 ? ((results.false_positives / results.total) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              <span>
                Report: <span className="font-semibold text-slate-700">{reportName.trim() || 'Bulk Prediction Report'}</span>
                {' · '}
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' '}
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF Report
              </button>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                New Upload
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Batch Prediction Results</h3>
                <p className="text-xs text-slate-500 mt-0.5">All observations with model classifications</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {results.total} {results.total === 1 ? 'Row' : 'Rows'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-6">#</th>
                    <th className="py-3 px-4">Period (d)</th>
                    <th className="py-3 px-4">Period Err</th>
                    <th className="py-3 px-4">Duration (h)</th>
                    <th className="py-3 px-4">Dur. Err</th>
                    <th className="py-3 px-4">Depth (ppm)</th>
                    <th className="py-3 px-4">Depth Err</th>
                    <th className="py-3 px-4">Insol</th>
                    <th className="py-3 px-4">SNR</th>
                    <th className="py-3 px-4">Verdict</th>
                    <th className="py-3 px-4 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {results.results.map((item) => {
                    const isCandidate = item.prediction === 'CANDIDATE';
                    return (
                      <tr
                        key={item.row}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-6 font-sans text-slate-400 font-semibold">
                          {item.row}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {item.koi_period}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_period_err1}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_duration}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_duration_err1}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_depth}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_depth_err1}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_insol}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.koi_model_snr}
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
                        <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                          {(item.probability * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
