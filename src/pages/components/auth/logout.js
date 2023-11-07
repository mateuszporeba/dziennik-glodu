import React from 'react'
import styles from './logout.module.css'
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from 'react-redux'
import { loginUserData, logoutUser } from '../store/userSlice'
//import Button from 'react-bootstrap/Button';
import Button from '../layout/button'

export default function logout() {
  const dispatch = useDispatch()

  const auth = getAuth()
  const logOutHandler = () => {
    signOut(auth).then(() => {
      dispatch(logoutUser())
      // Sign-out successful.
    }).catch((error) => {
      console.log('Error during log out!!!')
      // An error happened.
    })
  }
// className= {styles.buttonLogout}
  return (
    <>
      <Button variant="secondary" onClick={logOutHandler} className= {styles.buttonLogout} description={'Log out'}/>
    </>
  )
}

