(function (global) {
  global.FORGEFIT_FIREBASE = {
    enabled: false,
    vapidKey: "PASTE_WEB_PUSH_CERTIFICATE_KEY_PAIR_HERE",
    config: {
      apiKey: "PASTE_FIREBASE_API_KEY",
      authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
      projectId: "PASTE_PROJECT_ID",
      storageBucket: "PASTE_PROJECT_ID.appspot.com",
      messagingSenderId: "PASTE_SENDER_ID",
      appId: "PASTE_FIREBASE_APP_ID"
    }
  };
})(typeof self !== "undefined" ? self : window);
