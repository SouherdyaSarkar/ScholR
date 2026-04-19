import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.GCP_API_KEY,
  authDomain: "scholr-72cf6.firebaseapp.com",
  projectId: "scholr-72cf6",
  storageBucket: import.meta.env.STORAGE_BUCKET_ID,
  messagingSenderId: "469316019554",
  appId: "1:469316019554:web:aba8196ca9e46e9170383b",
  measurementId: "G-5HR76V7L0F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
