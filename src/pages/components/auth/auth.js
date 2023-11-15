// Auth.js
import React, { useState } from 'react';
import styles from './auth.module.css'
//auth
import App from '../../../firebase/firebaseConfig'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
//db
import { ref, add, push, set, get, onValue } from "firebase/database";
import database from '../../../firebase/firebaseDatabase'
//redux
import { useSelector, useDispatch } from 'react-redux'
import { loginUserData, logoutUser } from '../../../store/userSlice'

import Modal from '../UI/modal'
//Login with Google account
import LoginWithGoogleAuthProvider from './loginWithGoogleAuthProvider';
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

  //AUTH with google provider
  const loginWithGoogleAccountHandler = async () => {
    const provider = new GoogleAuthProvider(); // Use 'GoogleAuthProvider' directly
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        // The signed-in user info.
        const user = result.user
        const user_UID = user.uid.toString()
        checkUsersDatabase(user_UID)
        dispatch(loginUserData([user.email, user.uid]))
        props.onClose()
        // IdP data available using getAdditionalUserInfo(result)

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.error('Login failed:', error);
      })
  }

  const checkUsersDatabase = (userId) => {
    const date = (new Date().getFullYear() + '_' + new Date().getMonth()).toString()

    const ThisMonthDatabaseRef = ref(database, 'users/' + userId + '/dziennik-glodu/' + date);

    onValue(ThisMonthDatabaseRef, (snapshot) => {
      const data = snapshot.exists()

      if (!data) {
        set(ref(database, 'users/' + userId + '/dziennik-glodu/' + date), {
          table: { 0: Array.from({ length: 22 }, () => 0) },
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
