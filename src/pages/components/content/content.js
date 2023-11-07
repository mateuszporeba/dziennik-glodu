import React, { useState, useEffect } from 'react'
import styles from './content.module.css'

import { useSelector } from 'react-redux'
import '../../../store/userSlice'

import AddicionDiary from '../addictionDiary/addictionDiary'

export default function content() {

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user.email)

  useEffect(() => {
    //if (user !== null || user?.length > 0) {
    if (user?.length > 0) {
      setUserIsLoggedIn(true)
    } else {
      setUserIsLoggedIn(false)
    }


  }, [user]);


  return (
    <div className={styles.container}>
      <div className={styles.AddicionDiaryContainer}>
        {userIsLoggedIn && <AddicionDiary />}
      </div>
    </div>
  )
}
