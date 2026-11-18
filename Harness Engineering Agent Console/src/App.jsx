import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard.jsx";
import CustomerPortal from "./components/CustomerPortal.jsx";
import Header from "./components/Header.jsx";
import Toast from "./components/Toast.jsx";
import { DEFAULT_WEBHOOK_URL, demoScenarios } from "./data/scenarios.js";
import { executeRefundWebhook } from "./services/refundService.js";

export default function App() {
  const [view, setView] = useState("user");
  const [liveMode, setLiveMode] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState(DEFAULT_WEBHOOK_URL);
  const [formData, setFormData] = useState({ ...demoScenarios[1] });
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(demoScenarios[1], null, 2),
  );
  const [customerResult, setCustomerResult] = useState(null);
  const [adminResult, setAdminResult] = useState(null);
  const [customerSubmitting, setCustomerSubmitting] = useState(false);
  const [adminRunning, setAdminRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  function notify(message) {
    setToastMessage(message);
  }

  function selectScenario(id) {
    setFormData({ ...demoScenarios[id] });
  }

  function loadAdminScenario(id) {
    setPayloadText(JSON.stringify(demoScenarios[id], null, 2));
  }

  async function copyText(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      notify(successMessage);
    } catch (error) {
      notify(`Could not copy to clipboard: ${error.message}`);
    }
  }

  async function handleCustomerSubmit(event) {
    event.preventDefault();
    const payload = {
      ...formData,
      customer_account_age_days: Number(formData.customer_account_age_days),
    };

    setCustomerSubmitting(true);
    try {
      const result = await executeRefundWebhook(webhookUrl, payload, liveMode);
      setCustomerResult(result);
      setAdminResult(result);
      setPayloadText(JSON.stringify(payload, null, 2));
      if (result.simulated && liveMode) {
        notify("CORS restriction caught. Processed via intelligent simulation.");
      } else if (result.simulated) {
        notify("Processed in simulation mode.");
      }
    } catch (error) {
      notify(`Could not process support request: ${error.message}`);
    } finally {
      setCustomerSubmitting(false);
    }
  }

  function formatPayload() {
    try {
      setPayloadText(JSON.stringify(JSON.parse(payloadText), null, 2));
    } catch {
      notify("Invalid JSON syntax");
    }
  }

  async function runAdminTest() {
    let payload;
    try {
      payload = JSON.parse(payloadText);
    } catch {
      notify("Error: Invalid JSON payload.");
      return;
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      notify("Error: JSON payload must be an object.");
      return;
    }

    setAdminRunning(true);
    try {
      const result = await executeRefundWebhook(webhookUrl, payload, liveMode);
      setAdminResult(result);
      if (result.simulated && liveMode) {
        notify("CORS restriction caught. Simulated response rendered.");
      } else if (result.simulated) {
        notify("Webhook test completed in simulation mode.");
      }
    } catch (error) {
      notify(`Could not run webhook test: ${error.message}`);
    } finally {
      setAdminRunning(false);
    }
  }

  return (
    <div className="bg-darkbg text-gray-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      <Header
        view={view}
        onChangeView={setView}
        liveMode={liveMode}
        onToggleMode={() => {
          setLiveMode((current) => !current);
          notify(
            liveMode
              ? "Switched to Simulation Mode"
              : "Switched to Live API Mode",
          );
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {view === "user" ? (
          <CustomerPortal
            formData={formData}
            onChange={(field, value) =>
              setFormData((current) => ({ ...current, [field]: value }))
            }
            onSelectScenario={selectScenario}
            onSubmit={handleCustomerSubmit}
            result={customerResult}
            submitting={customerSubmitting}
          />
        ) : (
          <AdminDashboard
            webhookUrl={webhookUrl}
            onWebhookUrlChange={setWebhookUrl}
            onCopy={copyText}
            payloadText={payloadText}
            onPayloadChange={setPayloadText}
            onLoadScenario={loadAdminScenario}
            onFormatPayload={formatPayload}
            onRunTest={runAdminTest}
            result={adminResult}
            running={adminRunning}
          />
        )}
      </main>

      <Toast message={toastMessage} />
    </div>
  );
}
