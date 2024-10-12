// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg72T7-RZ_NtIzrtz88tNWT-IJJ9Rnpy8",
  authDomain: "koiorderingjapan.firebaseapp.com",
  projectId: "koiorderingjapan",
  storageBucket: "koiorderingjapan.appspot.com",
  messagingSenderId: "147030911772",
  appId: "1:147030911772:web:dea3d8f7730a5c3767a8d9",
  measurementId: "G-8JK3RCJ6N6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const db = getFirestore(app);

export default storage;
