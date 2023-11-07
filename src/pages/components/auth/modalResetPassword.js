import React, { useState } from 'react';
import styles from './modalResetPassword.module.css'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import Modal from '../UI/modal'



export default function resetPassword(props) {

  const [email, setEmail] = useState('');
  const [successfullyPasswordReset, setSuccessfullyPasswordReset] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const emailChangeHandler = (e) => setEmail(e.target.value);


  const ResetPasswordHandler = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessfullyPasswordReset(true)
        setTimeout(() => {
          props.onClose()
        }, 3500);
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setInvalidEmail(true)
        // ..
      });
  }

  return (
    <Modal onClose={props.onClose}>
      <div className={styles.container}>
        <h3>Reset Password</h3>
        {!successfullyPasswordReset ?
          <>
            < input type="email" value={email} onChange={emailChangeHandler} placeholder="E-mail" />
            {invalidEmail && <p>Invalid e-mail address!</p>}
            <button onClick={ResetPasswordHandler} className="btn btn-primary btn-sm">Send reset link</button>
          </> :
          <h3>The reset link has been sent to the email address</h3>
        }
        <button onClick={props.onClose} className="btn btn-danger btn-sm">Exit</button>
      </div>
    </Modal>
  )
}
