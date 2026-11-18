import { getResponseSummary } from "../utils/response.js";

const fieldClass =
  "w-full bg-darkbg border border-bordercol rounded-xl px-3.5 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition";

const presetDetails = {
  1: {
    title: "1. Normal Claim ($35)",
    detail: "Damaged item, fast approval",
    hover: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
  },
  2: {
    title: "2. High Value ($200)",
    detail: "Exceeds automated limit",
    hover: "hover:border-amber-500/50 hover:bg-amber-500/5",
  },
  3: {
    title: "3. Injection Attack",
    detail: "System override test",
    hover: "hover:border-rose-500/50 hover:bg-rose-500/5",
  },
};

function CustomerResponse({ result, formData }) {
  if (!result) {
    return (
      <div className="py-16 text-center">
        <div className="h-14 w-14 rounded-2xl bg-darkbg border border-bordercol flex items-center justify-center text-gray-600 mx-auto mb-3 text-xl">
          <i className="fa-solid fa-headset" aria-hidden="true" />
        </div>
        <p className="text-sm text-gray-300 font-medium">
          No request submitted yet
        </p>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
          Fill out the support form on the left or select a quick test scenario
          to see your support status instantly.
        </p>
      </div>
    );
  }

  const { response, decision, reason, sentiment, amount, isInjection } =
    getResponseSummary(result.data, "AUTO_REFUND_APPROVED");
  const orderId = response.order_id || formData.order_id;
  const email = response.customer_email || formData.customer_email;
  const approved = decision === "AUTO_REFUND_APPROVED";
  const banner = isInjection
    ? {
        container: "bg-rose-500/10 border-rose-500/30",
        icon: "fa-triangle-exclamation text-rose-400",
        title: "Security Review Required",
        titleColor: "text-rose-300",
        textColor: "text-rose-200/80",
        description:
          "Our security harness intercepted an anomaly in your request. It has been routed to senior support staff.",
      }
    : approved
      ? {
          container: "bg-emerald-500/10 border-emerald-500/30",
          icon: "fa-circle-check text-emerald-400",
          title: `Refund of $${amount} Approved!`,
          titleColor: "text-emerald-300",
          textColor: "text-emerald-200/80",
          description:
            "Your refund request has been automatically approved and is being processed back to your original payment method.",
        }
      : {
          container: "bg-amber-500/10 border-amber-500/30",
          icon: "fa-clock text-amber-400",
          title: "Routed to Support Team",
          titleColor: "text-amber-300",
          textColor: "text-amber-200/80",
          description:
            "Your request exceeds automated limits or requires manual verification. Our support team will reach out shortly.",
        };

  return (
    <div className="space-y-5">
      <div
        className={`rounded-xl p-4 border flex items-start gap-3.5 ${banner.container}`}
      >
        <i
          className={`fa-solid ${banner.icon} text-xl mt-0.5`}
          aria-hidden="true"
        />
        <div>
          <h4
            className={`text-xs font-bold uppercase tracking-wide ${banner.titleColor}`}
          >
            {banner.title}
          </h4>
          <p className={`text-xs mt-1 leading-relaxed ${banner.textColor}`}>
            {banner.description}
          </p>
        </div>
      </div>

      <div className="bg-darkbg border border-bordercol rounded-xl p-4 space-y-3">
        <SummaryRow label="Order Reference" value={orderId} />
        <SummaryRow
          label="Requested Refund"
          value={`$${amount}`}
          valueClass="font-code font-bold text-emerald-400"
        />
        <SummaryRow
          label="Customer Email"
          value={email}
          valueClass="font-code text-indigo-300"
        />
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Sentiment Detected</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
              sentiment === "angry"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            }`}
          >
            {sentiment.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="bg-darkbg border border-bordercol rounded-xl p-4">
        <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1.5">
          <i className="fa-solid fa-file-shield text-indigo-400 mr-1" aria-hidden="true" />
          Resolution Details
        </span>
        <p className="text-xs font-code text-gray-300 leading-relaxed">
          {reason}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "font-code font-semibold text-gray-200" }) {
  return (
    <div className="flex justify-between items-center text-xs pb-2 border-b border-bordercol/50 last:border-0 last:pb-0">
      <span className="text-gray-400">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default function CustomerPortal({
  formData,
  onChange,
  onSelectScenario,
  onSubmit,
  result,
  submitting,
}) {
  return (
    <section className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-900/40 via-cardbg to-cardbg border border-indigo-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 inline-block">
            24/7 Automated Support Triage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            We&apos;re here to help with your order.
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Submit your return or refund request below. Our intelligent triage
            agent processes claims instantly with secure policy validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-cardbg border border-bordercol rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-bordercol">
            <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              <i className="fa-solid fa-ticket text-indigo-400" aria-hidden="true" />
              Submit Support Request
            </h3>
            <span className="text-xs text-gray-400">Instant AI Triage</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block">
              Quick Test Scenarios:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {Object.entries(presetDetails).map(([id, preset]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => onSelectScenario(Number(id))}
                  className={`p-2.5 rounded-xl bg-darkbg border border-bordercol ${preset.hover} transition text-left`}
                >
                  <div className="text-xs font-semibold text-gray-200">
                    {preset.title}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {preset.detail}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-xs font-semibold text-gray-300">
                Customer Email
                <input
                  type="email"
                  required
                  className={`${fieldClass} mt-1.5 font-normal`}
                  placeholder="alex@example.com"
                  value={formData.customer_email}
                  onChange={(event) => onChange("customer_email", event.target.value)}
                />
              </label>
              <label className="text-xs font-semibold text-gray-300">
                Order ID
                <input
                  type="text"
                  required
                  className={`${fieldClass} mt-1.5 font-normal`}
                  placeholder="#ORD-9842"
                  value={formData.order_id}
                  onChange={(event) => onChange("order_id", event.target.value)}
                />
              </label>
            </div>

            <label className="text-xs font-semibold text-gray-300 block">
              Customer Account Age (Days)
              <input
                type="number"
                required
                min="1"
                className={`${fieldClass} mt-1.5 font-normal`}
                value={formData.customer_account_age_days}
                onChange={(event) =>
                  onChange("customer_account_age_days", event.target.value)
                }
              />
            </label>

            <label className="text-xs font-semibold text-gray-300 block">
              How can we help you today?
              <textarea
                required
                rows="4"
                className={`${fieldClass} mt-1.5 p-3.5 font-normal resize-none`}
                placeholder="Describe your issue or refund request..."
                value={formData.message}
                onChange={(event) => onChange("message", event.target.value)}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold text-xs tracking-wide uppercase transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <i
                className={`fa-solid ${submitting ? "fa-spinner fa-spin" : "fa-paper-plane"}`}
                aria-hidden="true"
              />
              {submitting ? "Processing Request..." : "Submit Support Request"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cardbg border border-bordercol rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-bordercol mb-5">
              <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                <i className="fa-solid fa-circle-check text-indigo-400" aria-hidden="true" />
                Request Status &amp; Response
              </h3>
              <span className="text-[10px] text-gray-400 bg-darkbg px-2.5 py-1 rounded-lg border border-bordercol">
                {result ? `Processed · HTTP ${result.status}` : "Awaiting submission"}
              </span>
            </div>
            {result ? (
              <CustomerResponse result={result} formData={formData} />
            ) : (
              <CustomerResponse result={null} formData={formData} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
