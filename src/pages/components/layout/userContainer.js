import React, { useState, useEffect } from 'react'
import styles from './userContainer.module.css'

import Auth from '../auth/auth'
import LogOut from '../auth/logout'
import ModalResetPassword from '../auth/modalResetPassword'
import ModalCreateAccount from '../auth/modalCreateAccount'
import { useSelector, useDispatch } from 'react-redux'
import '../store/userSlice'
//
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Modal from '../UI/modal'
import Button from '../layout/button'
//
export default function loginContainer() {
  const [userIsLoggedin, setUserIsLoggedin] = useState(false)
  const [modalCreateAccountIsShown, setModalCreateAccountIsShown] = useState(false)
  const [modalResetPasswordIsShown, setModalResetPasswordIsShown] = useState(false)
  const [modalAuthIsShown, setModalAuthIsShown] = useState(false)
  const user = useSelector((state) => state.user.email)

  const dispatch = useDispatch()

  const test = () => {
    console.log(user)
    //console.log('status z login Container:   ' + useSelector((state) => state.user.value))
  }
  useEffect(() => {
    //if (user !== null || user?.length > 0) {
    if (user?.length > 0) {
      setUserIsLoggedin(true)
    } else {
      setUserIsLoggedin(false)
    }


  }, [user]);

  //console.log(userIsLoggedin)

  const showCreateAccountHandler = () => {
    setModalCreateAccountIsShown(true)
  }
  const hideCreateAccountHandler = () => {
    setModalCreateAccountIsShown(false)
  }
  const showResetPasswordHandler = () => {
    setModalResetPasswordIsShown(true)
  }
  const hideResetPasswordHandler = () => {
    setModalResetPasswordIsShown(false)
  }
  const showLoginHandler = () => {
    setModalAuthIsShown(true)
  }
  const hideLogindHandler = () => {
    setModalAuthIsShown(false)
  }


  return (
    <div className={styles.container}>
      {!userIsLoggedin ? <>
        <div >
          <Button onClick={showLoginHandler} description={'Sign in'}/>
          <Button onClick={showCreateAccountHandler} description={'Register'}/>
          <Button onClick={showResetPasswordHandler} description={'Forgot password?'}/>
        </div>
      </>
        :
        <>
          <div className={styles.LoggedUserContainer}>
            <p>{user}</p>
            <LogOut />
          </div>
        </>}
      {modalAuthIsShown && <Auth onClose={hideLogindHandler} />}
      {modalResetPasswordIsShown && <ModalResetPassword onClose={hideResetPasswordHandler} />}
      {modalCreateAccountIsShown && <ModalCreateAccount onClose={hideCreateAccountHandler} />}
    </div>
  )
}
