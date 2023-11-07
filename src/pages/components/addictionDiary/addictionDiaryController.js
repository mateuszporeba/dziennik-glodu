import React, { useState } from 'react'
import styles from './addictionDiaryController.module.css'

export default function addictionDiaryController(props) {
  const [showNextMonthButton, setShowNextMonthButton] = useState(false)
  const { dateYears, dateMonths } = props.controllersDate;

  const getPreviousMonthHandler = () => {
    props.getPreviousMonth()
    setShowNextMonthButton(true)
    console.log('PORPZEDNIE TEJ!')
  }

  const getNextMonthHandler = () => {
    props.getNextMonth()
    if (dateYears === new Date().getFullYear() && Number(dateMonths+1) === new Date().getMonth()){
      setShowNextMonthButton(false)
    }
  }

  return (
    <div className={styles.container}>
      <button onClick={getPreviousMonthHandler}>&lt;</button>
      <label>{dateYears + '-' + Number(dateMonths+1)}</label>
      {showNextMonthButton && <button onClick={getNextMonthHandler}>&gt;</button>}
    </div>
  )
}
