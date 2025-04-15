


import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuCD6NeSjihGOfaCg7gx9-TUTK1-4QKAg",
    authDomain: "test-53850.firebaseapp.com",
    projectId: "test-53850",
    storageBucket: "test-53850.firebasestorage.app",
    messagingSenderId: "518037748109",
    appId: "1:518037748109:web:5732d1c8460e03a2a9e5c4",
    measurementId: "G-Q76Q0XQ93H"
  };
// Initialize Firebase (only if it’s not already initialized)
const app = getApp.length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);