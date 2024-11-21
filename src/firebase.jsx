import { initializeApp } from "firebase/app";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyjFS4kcLRD8QAtczXC65m39iqNIC8QSA",
  authDomain: "price-list-app-43d1e.firebaseapp.com",
  databaseURL: "https://price-list-app-43d1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "price-list-app-43d1e",
  storageBucket: "price-list-app-43d1e.firebasestorage.app",
  messagingSenderId: "102460044297",
  appId: "1:102460044297:web:b91c857540ec788d5eb4d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
