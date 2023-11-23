import React, { useEffect, useState } from 'react'
import styles from './addictionDiary.module.css'
import symptomsJSON from './symptoms.json'
import { v4 as uuidv4 } from 'uuid'

import { getDatabase, ref, child, get, set } from "firebase/database"
import database from '../../../firebase/firebaseDatabase'
import { useSelector } from 'react-redux'
import '../../../store/userSlice'

import Table from 'react-bootstrap/Table'
import AddictionDiaryController from './addictionDiaryController'
import Button from '../layout/button'
import Loader from '../UI/loader'
import AddicitonDiaryDailyQuestions from './addicitonDiaryDailyQuestions'

export default function addictionDiary() {

  //const symptoms = symptomsJSON.glod_substancji.objawy
  const symptoms = symptomsJSON.glod_substancji.objawy
  const tableHeaders = []
  const checkboxesToSave = []
  // const year = new Date().getFullYear()
  // const month = new Date().getMonth()
  const [days, setDays] = useState(new Date().getDate())
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  //const [date_Years_Months, setDate_Years_Months] = useState(dateYears + '_' + dateMonths)
  const [tableBodyArray, setTableBodyArray] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false);
  const [isAnsweringQuestions, setIsAnsweringQuestions] = useState(true)
  /////////////////////////////

  const userId = useSelector((state) => state.user.uid)
  const dbRef = ref(getDatabase())

  useEffect(() => {
    // get(child(dbRef, 'users/' + userId + '/dziennik-glodu/' + dateYear + '_' + dateMonth + '/table' + (days-1)))
    get(child(dbRef, 'users/' + userId + '/dziennik-glodu/' + year + '/' + month + '/table/' + (days - 1)))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setIsAnsweringQuestions(false)
        } else {
          setIsAnsweringQuestions(true)
        }
      })
      .catch((error) => {
        console.error(error);
      })

  }, [userId]);




  useEffect(() => {
    const tableBodyCheckboxes = [] // Initialize tableBodyCheckboxes as an empty array


    setError(false)
    get(child(dbRef, 'users/' + userId + '/dziennik-glodu/' + year + '/' + month + '/table'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          //console.log(snapshot.val())

          const data = snapshot.val();
          const keys = Object.keys(data);
          const missingKeys = [];

          for (let i = 0; i < days; i++) {
            if (!keys.includes(i.toString())) {
              missingKeys.push(i);
            } else {
              tableBodyCheckboxes[i] = data[i]; // Add existing data to tableBodyCheckboxes
              checkboxesToSave[i] = data[i]
            }
          }

          if (missingKeys.length > 0) {
            for (let i = 0; i < missingKeys.length; i++) {
              //tableBodyCheckboxes[missingKeys[i]] = new Array(symptoms.length).fill(0); // Add missing data to tableBodyCheckboxes
              tableBodyCheckboxes[missingKeys[i]] = []
            }
          }

          if (!keys.includes((days - 1).toString())) {
            checkboxesToSave[(days - 1)] = new Array(symptoms.length).fill(0)
          }
          setTableBodyArray(tableBodyCheckboxes)

          if (checkboxesToSave.length > 0) {
            setIsLoading(false); // Update loading state when data is fetched
          }
          //setCheckboxesToExport(checkboxesToSave)
          //console.log('checkboxesToSave.keys():   ' + checkboxesToSave.keys() + '  ' + checkboxesToSave)
        }
      })
      .catch((error) => {
        console.error(error);
        setError(true)
      });
  }, [userId, month, year]);

  // table Headers 
  for (let i = 0; i < days; i++) {
    tableHeaders.push(<th key={uuidv4()} scope="col" className={styles.stickyHeader}>{i + 1}</th>);
  }

  //Move scroll bar to right side of the table (to the newest data)
  useEffect(() => {
    // After the component mounts
    const scrollableDiv = document.getElementById('scrollableDiv');
    if (scrollableDiv) {
      scrollableDiv.scrollLeft = scrollableDiv.scrollWidth - scrollableDiv.clientWidth;
      //scrollableDiv.scrollLeft = scrollableDiv.scrollWidth;
    }
  }, [tableBodyArray])

  const onCheckHandler = (checkValue, index) => {
    const updatedCheckboxes = [...tableBodyArray];
    updatedCheckboxes[days - 1][index] = checkValue;
    setTableBodyArray(updatedCheckboxes);
    //console.log(updatedCheckboxes)
  }

  const onDailyAnswersSaveHandler = (DailyArray) => {
    const updatedCheckboxes = [...tableBodyArray];
    updatedCheckboxes[days - 1] = DailyArray;
    //console.log(updatedCheckboxes)
    const db = getDatabase()
    //set(ref(db, 'users/' + userId + '/dziennik-glodu/' + new Date().getFullYear() + '_' + new Date().getMonth()), {
    set(ref(db, 'users/' + userId + '/dziennik-glodu/' + year + '/' + month), {
      table: updatedCheckboxes,
    })
    console.log('wykonano onDailyAnswersSaveHandler')
    setTableBodyArray(updatedCheckboxes);
    //console.log(updatedCheckboxes)
  };

  //<p>Is Loading!!!</p>
  const tableBody = isLoading ? (
    console.log('loading')
  ) :
    (
      symptoms.map((symptom, i) => {
        const checkboxes = []

        if (tableBodyArray.length > 0 && i === symptoms.length - 1) {
          for (let currDay = 0; currDay < days; currDay++) {
            //console.log('ile razy!')
            const sum = tableBodyArray[currDay].reduce((partialSum, a) => partialSum + a, 0)
            checkboxes.push(sum)
          }

          return (
            <tr key={uuidv4()}>
              <th scope="row" key={uuidv4()}>{symptom}</th>
              {checkboxes?.map((sum) => (
                <td key={uuidv4()}>
                  <label key={uuidv4()}>{sum}</label>
                </td>
              ))
              }
            </tr >
          )
        }

        if (tableBodyArray.length > 0) {
          for (let currDay = 0; currDay < days; currDay++) {
            checkboxes.push(tableBodyArray[currDay][i])
          }
        }

        return (
          <tr key={uuidv4()}>
            <th scope="row" key={uuidv4()} className={styles.stickySympthoms}>{symptom}</th>
            {checkboxes?.map((check, index,) => (
              <td key={uuidv4()}>
                {
                  (index === checkboxes.length - 1 && year === new Date().getFullYear() && month === new Date().getMonth()) ?
                    <input
                      type='checkbox'
                      key={uuidv4()}
                      checked={tableBodyArray[index][i]}
                      onChange={(event) => onCheckHandler(event.target.checked ? 1 : 0, i)}
                    ></input>
                    : <input type='checkbox' key={uuidv4()} checked={check === 1} disabled readOnly></input>
                }
              </td>
            ))
            }
          </tr >
        )
      })
    )

  const onSaveHandler = () => {
    const db = getDatabase()
    set(ref(db, 'users/' + userId + '/dziennik-glodu/' + new Date().getFullYear() + '_' + new Date().getMonth()), {
      table: tableBodyArray,
    })
    alert('Odpowiedzi zostały pomyślnie zmienione')
    console.log('wykonano zapis')
  }

  const onPreviousMonthHandler = () => {
    setIsLoading(true)
    setMonth(month - 1)
    const monthToCalculate = Number(month - 1)
    setDays(getDaysInMonth(year, monthToCalculate))
    //console.log('dateMonth:  ' + Number(dateMonth + 1))
  }
  const onNextMonthHandler = () => {
    setIsLoading(true)
    setMonth(month + 1)
    const monthToCalculate = Number(month + 1)
    setDays(getDaysInMonth(year, monthToCalculate))
    console.log('dateMonth:  ' + Number(month + 1))
  }

  const onDiaryControllerChangeDateHandler = (year, month) => {
    setIsLoading(true)
    console.log('onDiaryControllerChangeDateHandler' + year + '_' + month)
    setYear(year)
    setMonth(month)
    setDays(getDaysInMonth(year, month))
  }

  function getDaysInMonth(year, month) {
    if (year === new Date().getFullYear() && month === new Date().getMonth()) {
      return new Date().getDate()
    } else {
      // Month value in JavaScript starts from 0 (January) to 11 (December)
      // Create a new Date object for the given year and month (0 for the day means the last day of the previous month)
      const date = new Date(year, month, 0);
      // Get the number of days in the month using the Date object
      console.log('DATA!!!!:    ' + date.getDate())
      return date.getDate() + 1
    }
  }
  //getDaysInMonth(2023, 10)
  //controllersDate={dateYears + '-' + Number(dateMonths + 1)} />
  return (
    <>
      {isAnsweringQuestions ? <AddicitonDiaryDailyQuestions saveAnswers={onDailyAnswersSaveHandler} closeDailyQuestions={() => setIsAnsweringQuestions(!isAnsweringQuestions)} />
        : <>
          <AddictionDiaryController onDiaryControllerChangeDate={onDiaryControllerChangeDateHandler} getPreviousMonth={onPreviousMonthHandler} getNextMonth={onNextMonthHandler} controllersDate={{ dateYears: year, dateMonths: month }} />
          {error &&
            <>
              <p>Brak danych</p>
              <button></button>
            </>
          }

          <div className={styles.container}>

            <div className={styles.containerTable} id='scrollableDiv'>
              <Table striped bordered hover>

                <thead>
                  <tr key={uuidv4()}>
                    <th scope="col" key={uuidv4()} className={styles.stickyCorner}>Objawy</th>
                    {tableHeaders}
                  </tr>
                </thead>

                <tbody>
                  {tableBody}
                </tbody>

              </Table>

            </div>
            <div className={styles.SaveButtonContainer}>
              <Button onClick={onSaveHandler} description={'Zmień'} />
            </div>

          </div>
        </>
      }
    </>
  )
}