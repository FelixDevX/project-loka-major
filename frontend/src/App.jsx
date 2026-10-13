import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import PredictionForm from './components/PredictionForm';
import ResultPanel from './components/ResultPanel';
import HistoryTable from './components/HistoryTable';
import ModelSpecs from './components/ModelSpecs';
import BulkPredict from './components/BulkPredict';
import Footer from './components/Footer';
import { postPrediction } from './services/api';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('classifier');
  const [result, setResult] = useState(null);
  const [activePayload, setActivePayload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  async function handleSubmit(payload) {
    setIsLoading(true);
    setError(null);
    setActivePayload(payload);
    const startTime = performance.now();

    try {
      const data = await postPrediction(payload);
      const latency = Math.round(performance.now() - startTime);
      setResult(data);

      // Append to session history log
      const newEntry = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        payload,
        prediction: data.prediction,
        probability: data.probability,
        latency,
      };
      setHistory((prev) => [newEntry, ...prev]);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while communicating with the backend.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDismissResult() {
    setResult(null);
    setError(null);
    setActivePayload(null);
  }

  const screenClass = !result
    ? 'saas-bg-gradient'
    : result.prediction === 'CANDIDATE'
      ? 'screen-green'
      : 'screen-red';

  return (
    <div className={`flex min-h-screen transition-colors duration-700 ease-in-out ${screenClass}`}>
      {/* SaaS Dashboard Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        runCount={history.length}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Global Alert */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 p-4 text-sm text-rose-800 shadow-xs"
            >
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Inference Error:</span> {error}
              </div>
            </div>
          )}

          {/* Tab 1: Classifier Console */}
          {activeTab === 'classifier' && (
            <div className="space-y-6">
              {/* Dashboard KPI Stats */}
              <StatsCards result={result} runCount={history.length} />

              {/* Main Split Workbench: Inputs (Left) + Telemetry (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7">
                  <PredictionForm
                    onSubmit={handleSubmit}
                    onReset={handleDismissResult}
                    isLoading={isLoading}
                  />
                </div>

                <div className="lg:col-span-5 sticky top-24">
                  <ResultPanel
                    result={result}
                    activePayload={activePayload}
                    onDismiss={handleDismissResult}
                  />
                </div>
              </div>

              {/* Recent Inferences Table */}
              <div className="pt-2">
                <HistoryTable history={history} />
              </div>
            </div>
          )}

          {/* Tab 2: Bulk Predict */}
          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <BulkPredict />
            </div>
          )}

          {/* Tab 3: Full History Log */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="mb-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Session Inference Audit Trail</h1>
                <p className="text-xs text-slate-500 mt-1">Review all transit classifications conducted during this session.</p>
              </div>
              <HistoryTable history={history} />
            </div>
          )}

          {/* Tab 3: Model Specs */}
          {activeTab === 'model' && (
            <div className="space-y-6">
              <ModelSpecs />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}


