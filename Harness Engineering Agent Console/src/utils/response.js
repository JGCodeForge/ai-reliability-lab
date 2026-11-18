export function normalizeResponse(data) {
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0]?.json || data[0];
    return firstItem && typeof firstItem === "object"
      ? firstItem
      : { raw: firstItem ?? "" };
  }

  if (data && typeof data === "object") {
    return data;
  }

  return { raw: data ?? "" };
}

export function getResponseSummary(data, defaultDecision = "UNKNOWN") {
  const response = normalizeResponse(data);
  const decision = response.decision || defaultDecision;

  return {
    response,
    decision,
    reason:
      response.decision_reason || response.reason || "No audit reason.",
    sentiment: response.user_sentiment || "neutral",
    amount: response.refund_amount ?? 35,
    age: response.customer_account_age_days ?? 90,
    isInjection:
      response.injection_attempt_detected === true ||
      decision.includes("INJECTION") ||
      decision.includes("SECURITY"),
  };
}
