// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAHYMDfeMdXOfbBSmc7SsNls7VQhhNB-i0",
  authDomain: "instagram-clone-ac258.firebaseapp.com",
  projectId: "instagram-clone-ac258",
  storageBucket: "instagram-clone-ac258.appspot.com",
  messagingSenderId: "86823841130",
  appId: "1:86823841130:web:f946adb583aab1e9abc913",
  measurementId: "G-32XH8KRS84"});

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth,storage};
