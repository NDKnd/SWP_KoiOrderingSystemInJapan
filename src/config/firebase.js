// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBVvpNNLUGVnfZSqWCtLVX-lImD32_NSIY",
    authDomain: "workspace1-7c2ec.firebaseapp.com",
    projectId: "workspace1-7c2ec",
    storageBucket: "workspace1-7c2ec.appspot.com",
    messagingSenderId: "536368298384",
    appId: "1:536368298384:web:d327c260bf4dda9591db15",
    measurementId: "G-R63SJNS15Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };// cho phép sử dụng storage trên firebase