// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7WbtDQVwB4yZkZDntfEKrbWf33FBKPg8",
  authDomain: "intelligent-document-platform.firebaseapp.com",
  projectId: "intelligent-document-platform",
  storageBucket: "intelligent-document-platform.firebasestorage.app",
  messagingSenderId: "715171474953",
  appId: "1:715171474953:web:8f7aec37bbae18298792d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;