import { initializeApp } from "firebase/app";
//import { getFirestore, getAuth, collection, getDocs } from 'firebase/firestore/lite';

//import { getDatabase, ref, child, get } from "firebase/database";
// app's Firebase configuration


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
  databaseURL: process.env.NEXT_PUBLIC_databaseURL
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDeW1ye5vLslfBiG8Cjm-cJjOjR4HdmFKo",
//   authDomain: "dziennik-glodu.firebaseapp.com",
//   projectId: "dziennik-glodu",
//   storageBucket: "dziennik-glodu.appspot.com",
//   messagingSenderId: "750975555299",
//   appId: "1:750975555299:web:eece498dd25f6a943057d6",
//   measurementId: "G-HS1LKBH0L2"
// };

const app = initializeApp(firebaseConfig);

//console.log(app);

export default app;
//const app = initializeApp(firebaseConfig);
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
