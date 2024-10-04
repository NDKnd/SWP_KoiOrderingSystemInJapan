// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7_gDPjmeV153vN_7pis91hK-ai4SvYPk",
  authDomain: "workspace1-f4cae.firebaseapp.com",
  projectId: "workspace1-f4cae",
  storageBucket: "workspace1-f4cae.appspot.com",
  messagingSenderId: "945450349538",
  appId: "1:945450349538:web:5e8cb9bf17d07dbcb8ffbb",
  measurementId: "G-1FXD08KPVR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const db = getFirestore(app);

export default storage;
