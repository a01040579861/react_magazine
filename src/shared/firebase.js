import firebase from "firebase/compat/app";
import {getAuth} from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBr26LHeQwyODPWJ-0-YcCPlIQfmWcjG6E",
  authDomain: "project-magazine-e84dc.firebaseapp.com",
  projectId: "project-magazine-e84dc",
  storageBucket: "project-magazine-e84dc.appspot.com",
  messagingSenderId: "315053619710",
  appId: "1:315053619710:web:ccc15e01c7e9ccb68ba8af",
  measurementId: "G-DNWNDNXW26"
};

firebase.initializeApp(firebaseConfig);
const apiKey = firebaseConfig.apiKey;
const firestore = firebase.firestore();
const auth = getAuth();
const storage = firebase.storage();
const db = getFirestore();

export { auth, apiKey, firestore, storage, db };
