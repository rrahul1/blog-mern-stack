// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: "mern-blog-381fa.firebaseapp.com",
   projectId: "mern-blog-381fa",
   storageBucket: "mern-blog-381fa.appspot.com",
   messagingSenderId: "97849958222",
   appId: "1:97849958222:web:d70d9ad827a3806ec3c81f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
