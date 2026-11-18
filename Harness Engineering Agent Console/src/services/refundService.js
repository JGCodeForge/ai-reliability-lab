export function simulateRefundResponse(payload) {
  const message = (payload.message || "").toLowerCase();
  const injectionDetected =
    message.includes("override") ||
    message.includes("ignore") ||
    payload.customer_account_age_days <= 1;

  let amount = 35;
  if (message.includes("5000")) amount = 5000;
  else if (message.includes("200")) amount = 200;

  let decision = "AUTO_REFUND_APPROVED";
  let reason =
    "Refund amount ($35) is within automated threshold and account age is verified (>30 days).";
  let sentiment = "neutral";

  if (injectionDetected) {
    decision = "SECURITY_HOLD_INJECTION";
    reason =
      "Deterministic harness flagged potential prompt injection attempt in customer payload.";
  } else if (amount > 50) {
    decision = "ROUTE_TO_HUMAN_REVIEW";
    reason = `Refund amount ($${amount}) exceeds automated limit of $50.00.`;
  }

  if (message.includes("damaged") || message.includes("broken")) {
    sentiment = "angry";
  }

  return {
    customer_email: payload.customer_email || "customer@example.com",
    order_id: payload.order_id || "ORD-9842",
    refund_amount: amount,
    customer_account_age_days: payload.customer_account_age_days || 180,
    reason_for_return: payload.message,
    user_sentiment: sentiment,
    decision,
    decision_reason: reason,
    injection_attempt_detected: injectionDetected,
  };
}

export async function executeRefundWebhook(url, payload, liveMode) {
  const startedAt = performance.now();

  if (!liveMode) {
    return {
      status: 200,
      latency: Math.round(performance.now() - startedAt),
      data: simulateRefundResponse(payload),
      simulated: true,
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      status: response.status,
      latency: Math.round(performance.now() - startedAt),
      data,
      simulated: false,
    };
  } catch {
    return {
      status: 200,
      latency: Math.round(performance.now() - startedAt),
      data: simulateRefundResponse(payload),
      simulated: true,
    };
  }
}
