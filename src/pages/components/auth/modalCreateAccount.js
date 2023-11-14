import React, { useState } from 'react';
import styles from './modalCreateAccount.module.css'

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
//db
//import { getDatabase, ref, push, set, onValue } from "firebase/database";

import Modal from '../UI/modal'
import LoginWithGoogleAuthProvider from './loginWithGoogleAuthProvider';

export default function createAccount(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [missingPassword, setMissingPassword] = useState(false);
  const [successfullyCreatedAccount, setSuccessfullyCreatedAccount] = useState(false);



  const emailChangeHandler = (e) => setEmail(e.target.value);
  const passwordChangeHandler = (e) => setPassword(e.target.value);

  const resetInvalidValues = () => {
    setInvalidEmail(false)
    setMissingPassword(false)
  }

  const auth = getAuth();

  const signUpHandler = () => {
    resetInvalidValues()

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        // Signed up 
        const user = userCredential.user
        console.log('utworzono użytkownika: ' + user)
        setSuccessfullyCreatedAccount(true)
        //const User_UID = user.uid
        //user.sendEmailVerification()
        console.log('aaaaa')
        console.log('auth.currentUser:  ' + auth.currentUser)

        console.log('user.emailver:  ' + user.emailVerified)

        sendEmailVerification(auth.currentUser)
          .then(() => {
            // Email verification sent!
            console.log('sendEmailVerification!!')
          })
          .catch((error) => {
            console.log('sendEmailVerification error:' + error)
          })

        setTimeout(() => {
          props.onClose()
        }, 5000);
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        if (errorCode === 'auth/invalid-email') setInvalidEmail(true)
        if (errorCode === 'auth/missing-password') setMissingPassword(true)
      })
  }

  return (
    <Modal onClose={props.onClose}>
      <div className={styles.container}>
        {!successfullyCreatedAccount ?
          <>
            <h3>Create Account</h3>
            < input type="email" value={email} onChange={emailChangeHandler} placeholder="E-mail" />
            {invalidEmail && <p>Invalid e-mail!</p>}
            <input type="password" value={password} onChange={passwordChangeHandler} placeholder="Password" />
            {missingPassword && <p>Missing password!</p>}
            <div className={styles.signUpContainer}>
              <button onClick={signUpHandler}  className="btn btn-primary btn-sm">Sign up!</button>
              <LoginWithGoogleAuthProvider id={styles.buttonContinueWithGoogle} />
            </div>
          </> :
          <>
            <h3>The account has been successfully created</h3>
            <h4>Verification link has been sent to your e-mail address</h4>
          </>
        }
        <button onClick={props.onClose} className="btn btn-danger btn-sm">Exit</button>
      </div>
    </Modal>
  )
}

