
import { initializeApp } from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { getAnalytics } from "firebase/analytics";
require('dotenv').config();

const googleApi = process.env.REACT_APP_GOOGLE_KEY;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: googleApi,
  authDomain: "ethernalelves-c3f32.firebaseapp.com",
  projectId: "ethernalelves-c3f32",
  storageBucket: "ethernalelves-c3f32.appspot.com",
  messagingSenderId: "467814079284",
  appId: "1:467814079284:web:9cdf8b5169d1107c67e361",
  measurementId: "G-QYVCSG6ER6",
  
  };


  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

export { app, analytics }
