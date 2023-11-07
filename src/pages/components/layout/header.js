import React from 'react'
import styles from './header.module.css'

import UserContainer from './userContainer'


export default function Header() {
  return (
    <div>
      <div className={styles.header}>

        <div className={styles.wave}>
          <div className={styles.wave} id={styles.wave1}></div>
          <div className={styles.wave} id={styles.wave2}></div>
          <div className={styles.wave} id={styles.wave3}></div>
          <div className={styles.wave} id={styles.wave4}></div>
          <div className={styles.wave} id={styles.wave5}></div>
          <div className={styles.wave} id={styles.wave6}></div>
        </div>

        <div className={styles['h1-Container']}>
          <h1 className={styles.h1}>Dzienniczek głodu</h1>
        </div>
        <div className={styles['ui-container']}>
          <UserContainer />
        </div>
      </div>

    </div>
  )
}
