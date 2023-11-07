import React from 'react'
import styles from './button.module.css'

export default function button(props) {

  //<button className={styles.button}>Sign in2</button>
  return (
    <>
    <button onClick={props.onClick} className={styles.button}>{props.description}</button>
    
    </>
  )
}
