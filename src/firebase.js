import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "INSERISCI_API_KEY",
  authDomain: "INSERISCI_AUTH_DOMAIN",
  projectId: "INSERISCI_PROJECT_ID",
  storageBucket: "INSERISCI_BUCKET",
  messagingSenderId: "INSERISCI_SENDER_ID",
  appId: "INSERISCI_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
