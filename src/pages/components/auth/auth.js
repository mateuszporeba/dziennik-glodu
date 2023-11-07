// Auth.js
import React, { useState } from 'react';
import styles from './auth.module.css'
//auth
import App from '../firebase/firebaseConfig'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
//db
import { ref, add, push, set, get, onValue } from "firebase/database";
import database from '../firebase/firebaseDatabase'
//redux
import { useSelector, useDispatch } from 'react-redux'
import { loginUserData, logoutUser } from '../store/userSlice'

import Modal from '../UI/modal'
//Login with Google account
import Image from 'next/image'
import ContinuWithGoogleImage from './web_light_rd_ctn@1x.png'

export default function Auth(props) {

  const [email, setEmail] = useState('poreba.mateusz@gmail.com');
  const [password, setPassword] = useState('5123098');
  const dispatch = useDispatch()

  const auth = getAuth(App);
  const provider = new GoogleAuthProvider();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const loginHandler = () => {
    // firebase.auth().signInWithEmailAndPassword(email, password)

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Handle successful login
        const user = userCredential.user
        //dispatch(loginUserData(user.email))
        dispatch(loginUserData([user.email, user.uid]))
        const user_UID = user.uid.toString()
        writeUserDatabase(user_UID)
        props.onClose()
      })
      .catch((error) => {
        // Handle login error
        console.error('Login failed:', error);
      });
  };

  //AUTH with google provider
  const loginWithGoogleAccountHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        dispatch(loginUserData(user.email))
        props.onClose()
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.error('Login failed:', error);
      });
  }
  // /new Date().getFullYear() +'_' + new Date().getMonth()

  const writeUserDatabase = (userId) => {
    const date = (new Date().getFullYear() + '_' + new Date().getMonth()).toString()

    const ThisMonthDatabaseRef = ref(database, 'users/' + userId + '/dziennik-glodu/' + date);
    //console.log('ThisMonthDatabaseRef  ' + ThisMonthDatabaseRef)

    // const table = [
    //   [
    //     1, 0, 0, 0, 1, 1, 0,
    //     0, 0, 1, 1, 0, 0, 1,
    //     1, 0, 1, 0, 1, 1, 1,
    //     1
    //   ],
    //   [
    //     0, 1, 1, 1, 0, 0, 1,
    //     1, 1, 0, 0, 0, 1, 1,
    //     0, 1, 0, 0, 0, 0, 0,
    //     0
    //   ],
    //   [
    //     0, 0, 1, 1, 0, 0, 0,
    //     0, 1, 0, 1, 0, 1, 1,
    //     0, 1, 1, 1, 1, 0, 0,
    //     0
    //   ],
    //   [
    //     1, 1, 1, 0, 0, 1, 1,
    //     1, 0, 1, 1, 0, 1, 1,
    //     1, 1, 1, 1, 1, 1, 1,
    //     1
    //   ],
    //   [],
    //   [],
    //   [
    //     0, 0, 0, 0, 1, 0, 0,
    //     1, 0, 1, 0, 0, 0, 1,
    //     0, 0, 1, 0, 0, 1, 1,
    //     0
    //   ]
    // ]

    onValue(ThisMonthDatabaseRef, (snapshot) => {
      const data = snapshot.exists()
      //console.log(data)
      if (!data) {
        console.log('setowanie!!!!!')
        // push(ref(database, 'users/' + userId + '/dziennik-glodu1/' + date), {
        //   ObjektTabeli: table
        // })
          set(ref(database, 'users/' + userId + '/dziennik-glodu/' + date), {
            table: { 0: Array.from({ length: 22 }, () => 0) },
            //table: table,
           // table: [Array.from({ length: 22 }).fill(0)],t
           //table: Array.from({ length: 22 }, () => [0]),
          //table: new Array(21).fill(0),
        })
      }
    })
    // if (!ThisMonthDatabaseRef) {
    //   set(ref(database, 'users/' + user_UID), {
    //     user_UID
    //   })
    // }
  }


  return (
    <Modal onClose={props.onClose}>
      <div className={styles.container}>
        <input type="email" value={email} onChange={handleEmailChange} placeholder="E-mail" />
        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
        <button onClick={loginHandler} className="btn btn-primary btn-sm">Login</button>
        <button onClick={loginWithGoogleAccountHandler} className={styles.buttonContinueWithGoogle}>
          <Image
            src={ContinuWithGoogleImage}
            width={189}
            height={40}
            alt="Continue with google account"
          ></Image>
        </button>

        <button onClick={props.onClose} className={styles.buttonExit}>Exit</button>
      </div>
    </Modal >
  );
};







// // Auth.js
// import React, { useState } from 'react';
// import firebase from '../firebase/firebaseConfig'

// const Auth = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleEmailChange = (e) => setEmail(e.target.value);
//   const handlePasswordChange = (e) => setPassword(e.target.value);

//   const handleLogin = () => {
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         // Handle successful login
//         const user = userCredential.user;
//         console.log('Logged in as:', user);
//       })
//       .catch((error) => {
//         // Handle login error
//         console.error('Login failed:', error);
//       });
//   };

//   return (
//     <div>
//       <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
//       <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Auth;
