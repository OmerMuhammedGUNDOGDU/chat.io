import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9M6OGTD9cg5s4ErveSetzAXsptxRE6Ds",
  authDomain: "blackice-chat.firebaseapp.com",
  projectId: "blackice-chat",
  storageBucket: "blackice-chat.appspot.com",
  messagingSenderId: "619562634676",
  appId: "1:619562634676:web:2feaa8a0bc98d92627b6e1",
  measurementId: "G-X88D7L7CDX",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
