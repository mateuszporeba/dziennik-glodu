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
//image
import Image from 'next/image'
import AlertImage from './alert.png'
//
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setWrongCredentials(false)
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setWrongCredentials(false)
  }


  const handleEmailClick = () => setWrongCredentials(false)
  const handlePasswordClick = () => setWrongCredentials(false)

  const auth = getAuth(App);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // ...
        // New sign-in will be persisted with session persistence.
        console.log('ustawione persistance local browser!')
        try {
          return signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
          //console.log(error)
        }

      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }, []);



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
        {wrongCredentials &&
          <div className={styles.wrongCredentialsInfoContainer}>
            <Image
              src={AlertImage}
              width={30}
              height={30}
              alt="alert"
            ></Image>
            <p>Wrong e-mail or password</p>
          </div>}
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