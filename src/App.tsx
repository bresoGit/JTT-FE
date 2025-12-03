function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full px-4">
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-lg space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            JACK THE TIPSTER
          </h1>
          <p className="text-sm text-slate-300">
            Frontend ready: React + TypeScript + Tailwind. <br />
            Next up: tip list, risk filters (Low / Medium / High), and the
            Guillotine flow.
          </p>
          <button className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
            Open Today&apos;s Tips
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
