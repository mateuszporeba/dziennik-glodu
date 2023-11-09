import React, { useState } from 'react'
import styles from './addicitonDiaryDailyQuestions.module.css'
import symptomsJSON from './symptoms.json'

import Button from '../layout/button'

import Image from 'next/image'
import GoBackImage from './go_back.png'

export default function addicitonDiaryDailyQuestions(props) {

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answersTable, setAnswersTable] = useState([])

  const symptoms = symptomsJSON.glod_substancji.objawy

  const goBackHandler = () => {
    if (currentQuestion > 0) {

      setCurrentQuestion(currentQuestion - 1);
    }
  }
  const answerNoHandler = () => {
    if (currentQuestion < symptoms.length - 1) {
      updateAnswerAtIndex(currentQuestion, 0)
      setCurrentQuestion(currentQuestion + 1);
    }
  }
  const answerYesHandler = () => {
    if (currentQuestion < symptoms.length - 1) {
      updateAnswerAtIndex(currentQuestion, 1)
      setCurrentQuestion(currentQuestion + 1);
      console.log('answersTable[currentQuestion]:  ' + currentQuestion + '   ' + answersTable[currentQuestion])
      console.log('answersTable all:  ' + answersTable)
    }
  }
  const updateAnswerAtIndex = (index, updatedValue) => {
    const updatedAnswersTable = [...answersTable];
    updatedAnswersTable[index] = updatedValue;
    setAnswersTable(updatedAnswersTable);
    console.log('answersTable[currentQuestion]:  ' + answersTable[currentQuestion])
    console.log('answersTable all:  ' + answersTable)
  }

const saveAnswersHandler = () => {
  props.saveAnswers(answersTable)
  props.closeDailyQuestions()
}

  const symptomsSum = answersTable.reduce((partialSum, a) => partialSum + a, 0)

  const question = (
    <div className={styles.card}>
      <button className={styles.buttonGoBack} onClick={goBackHandler}>
        <Image
          src={GoBackImage}
          width={60}
          height={60}
          alt="Go Back"
        ></Image>
      </button>
      <h2>{symptoms[currentQuestion]}</h2>
      {(currentQuestion === symptoms.length-1) &&
        <>
          <h1>{symptomsSum}</h1>
          <button className={styles.button} onClick={saveAnswersHandler}>ZAMKNIJ</button>
        </>}
      <div className={styles.buttonContainer}>
        {(currentQuestion !== symptoms.length-1) &&
          <>
            <button onClick={answerYesHandler} className={(answersTable[currentQuestion] === 1) ? styles.buttonAnswered : styles.button}>TAK</button>
            <button onClick={answerNoHandler} className={(answersTable[currentQuestion] === 0) ? styles.buttonAnswered : styles.button}>NIE</button>
          </>
        }
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      {question}
    </div>
  )
}
