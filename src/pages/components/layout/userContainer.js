import React, { useState, useEffect } from 'react'
import styles from './userContainer.module.css'

import Auth from '../auth/auth'
import LogOut from '../auth/logout'
import ModalResetPassword from '../auth/modalResetPassword'
import ModalCreateAccount from '../auth/modalCreateAccount'
import { useSelector, useDispatch } from 'react-redux'
import { loginUserData } from '../../../store/userSlice'
//
import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
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

  const auth = getAuth()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(loginUserData([user.email, user.uid]))
        setUserIsLoggedin(true)
      } else {
      }
    })
  }, [])

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
          <Button onClick={showLoginHandler} description={'Zaloguj się'} />
          <Button onClick={showCreateAccountHandler} description={'Zarejestruj się'} />
          <Button onClick={showResetPasswordHandler} description={'Zapomniałeś hasła?'} />
        </div>
      </>
        :
        <>
          <div className={styles.LoggedUserContainer}>
            <LogOut />
          </div>
        </>}
      {modalAuthIsShown && <Auth onClose={hideLogindHandler} />}
      {modalResetPasswordIsShown && <ModalResetPassword onClose={hideResetPasswordHandler} />}
      {modalCreateAccountIsShown && <ModalCreateAccount onClose={hideCreateAccountHandler} />}
    </div>
  )
}


//   <>
//   <div className={styles.LoggedUserContainer}>
//     <p>{user}</p>
//     <LogOut />
//   </div>
// </>