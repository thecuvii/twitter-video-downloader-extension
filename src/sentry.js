import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";


export default () => {
  Sentry.init({
    dsn: "https://fc848409a9c3467aa951cebecef8669d@o311889.ingest.sentry.io/6057986",
    integrations: [new Integrations.BrowserTracing()],
  
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
};