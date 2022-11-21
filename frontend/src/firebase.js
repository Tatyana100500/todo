import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBCrKJoWOvnWWC88H5nvuvf-mJeCVbJYR4",
  authDomain: "my-todo-project-498d6.firebaseapp.com",
  databaseURL: "https://my-todo-project-498d6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-todo-project-498d6",
  storageBucket: "my-todo-project-498d6.appspot.com",
  messagingSenderId: "651631804743",
  appId: "1:651631804743:web:be97de3599a14b9b5b8c62"
};

/**  Initialize Firebase and Firestore */
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app);
export {db, storage}