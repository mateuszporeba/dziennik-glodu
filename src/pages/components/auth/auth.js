// Auth.js
import React, { useState, useEffect } from 'react';
import styles from './auth.module.css'
//auth
import App from '../../../firebase/firebaseConfig'
import { getAuth, signInWithEmailAndPassword, signInWithCustomToken, signOut, browserLocalPersistence, setPersistence, onAuthStateChanged } from "firebase/auth";
//db
import { ref, add, push, set, get, onValue } from "firebase/database";
import database from '../../../firebase/firebaseDatabase'
//redux
import { useSelector, useDispatch } from 'react-redux'
import { loginUserData, logoutUser } from '../../../store/userSlice'

import Modal from '../UI/modal'
//Login with Google account
import LoginWithGoogleAuthProvider from './loginWithGoogleAuthProvider';
//import checkUsersDatabase from './checkUserDatabase';
// import Image from 'next/image'
// import ContinuWithGoogleImage from './web_light_rd_ctn@1x.png'

export default function Auth(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [email, setEmail] = useState('poreba.mateusz@gmail.com');
  // const [password, setPassword] = useState('dupa123');
  const [wrongCredentials, setWrongCredentials] = useState(false)
  const dispatch = useDispatch()

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);


  const handleEmailClick = () => setWrongCredentials(false)
  const handlePasswordClick = () => setWrongCredentials(false)

  const auth = getAuth(App);
  // (async () => {
  //   await setPersistence(auth, browserLocalPersistence);
  // })();

  // useEffect(() => {
    // const storedToken = localStorage.getItem("loginToken")
    // if (storedToken) {
    //   // Token exists, you can use it in your application logic
    //   console.log("Token found:", storedToken);
    //   console.log(storedToken)
    //   // Perform actions based on the token, such as auto-login
    // } else {
    //   // Token does not exist, handle accordingly (e.g., redirect to login)
    //   console.log("Token not found");
    // }

  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log('onAuthStateChanged' + user)
  //       checkUsersDatabase(user.uid)
  //       dispatch(loginUserData([user.email, user.uid]))
  //       props.onClose()
  //     } else {
  //     }
  //   });


  //   signInWithCustomToken(auth, storedToken)
  //     .then((userCredential) => {
  //       // Signed in
  //       console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  //       var user = userCredential.user
  //       console.log("user.emailVerified  :" + user.emailVerified)
  //       if (user.emailVerified) {
  //         const user_UID = user.uid.toString()
  //         checkUsersDatabase(user_UID)
  //         dispatch(loginUserData([user.email, user.uid]))
  //         props.onClose()
  //       }
  //     })
  //     .catch((error) => {
  //       var errorCode = error.code;
  //       var errorMessage = error.message;
  //       // ...
  //     });
  // }, []);

  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      // ...
      // New sign-in will be persisted with session persistence.
      console.log('usta3wione persistance local browser!')
      return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    
  const loginHandler = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        //Check if e-mail address is verified
        if (user.emailVerified) {
          // Handle successful login
          const user_UID = user.uid.toString()
          checkUsersDatabase(user_UID)
          dispatch(loginUserData([user.email, user.uid]))
          props.onClose()
        } else {
          signOut(auth).catch((error) => {
            console.log('Error during log out!!!')
          })
          alert("E-mail address not verified! Please check your mailbox")
        }
      })
      .catch((error) => {
        // Handle login error
        setWrongCredentials(true)
        //console.error('Login failed:', error);
      })
  }

  const checkUsersDatabase = (userId) => {
    const year = new Date().getFullYear()
    const month = new Date().getMonth()

    const ThisMonthDatabaseRef = ref(database, 'users/' + userId + '/dziennik-glodu/' + year + '/' + month);

    const timestamp = new Date().getTime()

    onValue(ThisMonthDatabaseRef, (snapshot) => {
      const data = snapshot.exists()
      console.log('BEFORE IF: checkUsersDatabase')
      if (!data) {
        console.log('checkUsersDatabase')
        set(ref(database, 'users/' + userId + '/dziennik-glodu/' + + year + '/' + month), {
          table: { 0: Array.from({ length: 22 }, () => 0) },
        })
        // Create a new id reference
        set(ref(database, 'users/' + userId + '/dg-id/' + + year + '/' + month), {
          ts: timestamp,
        })
      }
    })
  }

  //alert("E-mail address not verified! Please check your mailbox")
  //   <button onClick={loginWithGoogleAccountHandler} className={styles.buttonContinueWithGoogle}>
  //   <Image
  //     src={ContinuWithGoogleImage}
  //     width={189}
  //     height={40}
  //     alt="Continue with google account"
  //   ></Image>
  // </button>
  return (
    <Modal onClose={props.onClose}>
      <div className={styles.container}>
        <input className={wrongCredentials && styles.inputWrongCredentials} type="email" value={email} onChange={handleEmailChange} onClick={handleEmailClick} placeholder="E-mail" />
        <input className={wrongCredentials && styles.inputWrongCredentials} type="password" value={password} onChange={handlePasswordChange} onClick={handlePasswordClick} placeholder="Password" />
        <button onClick={loginHandler} className="btn btn-primary btn-sm">Login</button>
        {wrongCredentials && <p>Wrong e-mail or password</p>}
        <div className={styles.buttonContinueWithGoogle}>
          <LoginWithGoogleAuthProvider onClose={props.onClose} />
        </div >
        <div className={styles.containerButtonExit}>
          <button onClick={props.onClose} className='btn btn-danger btn-sm'>Exit</button>
        </div>
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
