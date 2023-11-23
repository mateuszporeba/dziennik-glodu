import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

import { Row, Col, NavDropdown, Container, Navbar, Nav } from "react-bootstrap"
import { DropdownSubmenu, NavDropdownMenu } from "react-bootstrap-submenu"

import styles from './addictionDiaryController.module.css'

//import database from '../../../firebase/firebaseDatabase'
import { getDatabase, ref, child, get, set } from "firebase/database"
import { useSelector } from 'react-redux'
import '../../../store/userSlice'
import { v4 as uuidv4 } from 'uuid'

import styled from 'styled-components'

export default function addictionDiaryController(props) {

  const dbRef = ref(getDatabase())
  const userId = useSelector((state) => state.user.uid)

  const [availableDiary, setavailableDiary] = useState()
  const [showNextMonthButton, setShowNextMonthButton] = useState(false)
  const { dateYears, dateMonths } = props.controllersDate
  const [isLoadinData, setIsloadinData] = useState(true)

  const year = new Date().getFullYear()

  useEffect(() => {
    get(child(dbRef, 'users/' + userId + '/dg-id/'))
      .then((snapshot) => {
        const data = snapshot.val()
        setavailableDiary(data)
        setIsloadinData(false)
      })
      .catch((error) => {
        console.error(error);
      })
  }, []);

  const getPreviousMonthHandler = () => {
    props.getPreviousMonth()
    setShowNextMonthButton(true)
  }

  const getNextMonthHandler = () => {
    props.getNextMonth()
    if (dateYears === new Date().getFullYear() && Number(dateMonths + 1) === new Date().getMonth()) {
      setShowNextMonthButton(false)
    }
  }

  const onTableChangeHandler = (year, month) => {
    console.log('onTableChangeHandler')
    props.onDiaryControllerChangeDate(year, month)
  }


  const StyledNavDropdown = styled(NavDropdownMenu)`
  .dropdown-menu{
    min-width:2rem;
  }
`;
  // <NavDropdownMenu title={year} className={styles.dropdownMenu} id="collasible-nav-dropdown">
  return (
    <div className={styles.container}>

      <Navbar bg="dark" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand href="#home"></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            {!isLoadinData &&
              Object.keys(availableDiary).map((year) => (
                <Nav className="me-auto">
                  <StyledNavDropdown title={year} >
                    {
                      Object.keys(availableDiary[year]).map((month) => (
                        <NavDropdown.Item onClick={() => onTableChangeHandler(year, month)} as="button" className={styles.dropdownItemMonth}>{Number(month) + 1}</NavDropdown.Item>
                      ))}
                  </StyledNavDropdown>
                </Nav>
              ))
            }

          </Navbar.Collapse>
        </Container>
      </Navbar>


    </div >
  )
}

/* <Dropdown>
<Dropdown.Toggle variant="success" id="dropdown-basic">
  Miesiąc
</Dropdown.Toggle>
<Dropdown.Menu>
  {!isLoadinData &&
    Object.keys(availableDiary).map((year) => (
      <Dropdown.Item>{Number(year) + 1}</Dropdown.Item>



    )
    )
  }

  {
    // availableDiary?.map(diary => (
    //   <Dropdown.Item onClick={changeDataInTable(diary)}>{Number(diary) + 1}</Dropdown.Item>
    // ))
  }
</Dropdown.Menu>
</Dropdown>
<button onClick={getPreviousMonthHandler}>&lt;</button>
<label>{dateYears + '-' + Number(dateMonths + 1)}</label>
{showNextMonthButton && <button onClick={getNextMonthHandler}>&gt;</button>} */