export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/50 py-6 text-center text-xs text-slate-400">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Project Loka — Exoplanet Classifier</span>
        <span className="text-slate-400">NASA Kepler Mission Data &bull; PyTorch TabNet</span>
      </div>
    </footer>
  );
}

