import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent as firebaseLogEvent,
} from "firebase/analytics";

import { FirebaseApp, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let analytics: Analytics;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);

  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

function logEvent(
  eventName: string,
  eventParams?: {
    [key: string]: any;
  }
) {
  if (analytics?.app) {
    return firebaseLogEvent(analytics, eventName, eventParams);
  }
}

// export { logEvent };
