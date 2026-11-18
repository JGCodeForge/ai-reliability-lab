# Harness Engineering Agent Console

An interactive React demo for exploring harness engineering in an
e-commerce refund workflow. It includes a customer support portal and an admin
dashboard for testing webhook payloads, inspecting responses, and viewing
deterministic guardrail decisions.

## Features

- Submit refund requests through a customer-facing support form.
- Try three scenarios: a valid refund, a high-value claim, and a prompt
  injection attempt.
- Inspect the matching request, response, latency, HTTP status, sentiment,
  decision, and audit reason in the admin dashboard.
- Send requests to a configurable webhook or switch to local simulation mode.
- Automatically use the local simulation if the live request cannot be
  reached, such as when the browser blocks it because of CORS.

## Requirements

- Node.js LTS, which includes npm.

Check that Node.js and npm are available:

```sh
node --version
npm --version
```

## Install and run

Run these commands from the `Harness Engineering Agent Console` directory:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. Use the **Customer Portal**
and **Harness Dashboard** tabs to switch between the two views.

The **Live API Mode** sends a POST request to the webhook URL shown in the
dashboard. The **Simulated Fallback Mode** runs scenarios locally without
sending network requests. In live mode, a failed request is also simulated and
shown with a notification.

## Available commands

```sh
npm run dev      # Start the local development server
npm run build    # Create the production app in dist/
npm run preview  # Preview the production build locally
```

## Project structure

```text
src/
  components/    # Header, customer portal, admin dashboard, and notifications
  data/          # Demo scenarios and default webhook URL
  services/      # Webhook requests and deterministic simulation
  utils/         # Response normalization and summary helpers
  App.jsx        # Application state and view composition
  main.jsx       # React entry point
  styles.css     # Global styles
index.html       # Vite HTML entry point
vite.config.js   # Vite React configuration
```
