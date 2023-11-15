import React from 'react'
import styles from './loginWithGoogleAuthProvider.module.css'
import Image from 'next/image'
import ContinuWithGoogleImage from './web_light_rd_ctn@1x.png'

import App from '../../../firebase/firebaseConfig'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import database from '../../../firebase/firebaseDatabase'
import { useDispatch } from 'react-redux'
import { loginUserData } from '../../../store/userSlice'

export default function loginWithGoogleAuthProvider(props) {
  const dispatch = useDispatch()

  const loginWithGoogleAccountHandler = async () => {
    const auth = getAuth(App);
    const provider = new GoogleAuthProvider(); // Use 'GoogleAuthProvider' directly
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const user_UID = user.uid.toString()
        checkUsersDatabase(user_UID)
        dispatch(loginUserData([user.email, user.uid]))
        props.onClose()
        console.log('loginWithGoogleAccountHandler')
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

  return (
    <button onClick={loginWithGoogleAccountHandler} className={`${styles.buttonContinueWithGoogle}`}>
      <Image
        src={ContinuWithGoogleImage}
        width={189}
        height={40}
        alt="Continue with google account"
      ></Image>
    </button>
  )
}
