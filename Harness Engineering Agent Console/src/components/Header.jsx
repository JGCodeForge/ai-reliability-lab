export default function Header({ view, onChangeView, liveMode, onToggleMode }) {
  const activeTab =
    "px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 bg-indigo-600 text-white shadow-md";
  const inactiveTab =
    "px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 text-gray-400 hover:text-white";

  return (
    <header className="border-b border-bordercol bg-cardbg/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-col xl:flex-row items-center justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
          <i className="fa-solid fa-shield-halved text-xl" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-2">
            E-Commerce Support &amp; Harness Portal
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
              n8n E2E Live
            </span>
          </h1>
          <p className="text-xs text-gray-400">
            Reliable Agent Guardrails &amp; Customer Portal
          </p>
        </div>
      </div>

      <nav
        className="flex items-center bg-darkbg border border-bordercol rounded-xl p-1 shadow-inner"
        aria-label="Portal view"
      >
        <button
          type="button"
          onClick={() => onChangeView("user")}
          className={view === "user" ? activeTab : inactiveTab}
          aria-pressed={view === "user"}
        >
          <i className="fa-solid fa-user" aria-hidden="true" />
          Customer Portal (User View)
        </button>
        <button
          type="button"
          onClick={() => onChangeView("admin")}
          className={view === "admin" ? activeTab : inactiveTab}
          aria-pressed={view === "admin"}
        >
          <i className="fa-solid fa-gauge-high" aria-hidden="true" />
          Harness Dashboard (Admin View)
        </button>
      </nav>

      <button
        type="button"
        onClick={onToggleMode}
        className={`px-3 py-2 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
          liveMode
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
        }`}
        title="Toggle between real webhook fetch and intelligent simulation"
        aria-label={`Switch to ${liveMode ? "simulation" : "live API"} mode`}
      >
        <span
          className={`h-2 w-2 rounded-full animate-pulse ${
            liveMode ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
        {liveMode ? "Live API Mode" : "Simulated Fallback Mode"}
      </button>
    </header>
  );
}
