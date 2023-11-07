import React, { useState } from 'react';
import styles from './modalCreateAccount.module.css'

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
//db
import { getDatabase, ref, push, set, onValue } from "firebase/database";

import Modal from '../UI/modal'

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

  const signUpHandler = () => {
    resetInvalidValues()
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        
        // Signed up 
        const user = userCredential.user
        console.log('utworzono użytkownika: ' + user)
        setSuccessfullyCreatedAccount(true)
        const User_UID = user.uid

        setTimeout(() => {
          props.onClose()
        }, 5000);
        // ...
      })
    
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        if (errorCode === 'auth/invalid-email') setInvalidEmail(true)
        if (errorCode === 'auth/missing-password') setMissingPassword(true)
        // ..
      });
  }

  return (
    <Modal onClose={props.onClose}>
      <div className={styles.container}>
        <h3>Create Account</h3>
        {!successfullyCreatedAccount ?
          <>
            < input type="email" value={email} onChange={emailChangeHandler} placeholder="E-mail" />
            {invalidEmail && <p>Invalid e-mail!</p>}
            <input type="password" value={password} onChange={passwordChangeHandler} placeholder="Password" />
            {missingPassword && <p>Missing password!</p>}
            <button onClick={signUpHandler} className="btn btn-primary btn-sm">Sign up!</button>
          </>:
          <h3>The account has been successfully created</h3>
        }
        <button onClick={props.onClose} className="btn btn-danger btn-sm">Exit</button>
      </div>
    </Modal>
  )
}

