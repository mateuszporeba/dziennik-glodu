import app from './firebaseConfig'

import { getDatabase } from "firebase/database";
//import {ref, set } from "firebase/database";




const database = getDatabase(app);

// console.log('zrobilo baze')

// set(ref(database, '/users/'), {
//   username: 'name',
//   email: 'email'
// });

//export default database;


// import { getFirestore } from "firebase/firestore";

// const db = getFirestore(app);

 export default database;