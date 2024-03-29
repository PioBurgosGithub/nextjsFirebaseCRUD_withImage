// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsVM_1tf-o3Qc3UADPwwXlNZrr7W1ePkM",
  authDomain: "fir-crud-d9b94.firebaseapp.com",
  projectId: "fir-crud-d9b94",
  storageBucket: "fir-crud-d9b94.appspot.com",
  messagingSenderId: "28733067773",
  appId: "1:28733067773:web:f1a7b120953d43a3e68994"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db };  