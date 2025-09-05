import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://5fe2478754edfbcfd11ee653d6896034@o4509853709631488.ingest.de.sentry.io/4509853716709456",

    integrations: [
        Sentry.replayIntegration(),
        Sentry.feedbackIntegration({
            // Additional SDK configuration goes in here, for example:
            colorScheme: "system",
            showBranding: false, // hide "powered by Sentry"
            triggerLabel: "Report a Bug", // button text
            triggerPosition: "bottom-left", // "bottom-right" | "bottom-left"
        }),
    ],

    // Adjust sample rate in production
    tracesSampleRate: 1.0,

    // Enable session replay (optional)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});
