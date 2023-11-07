import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import styles from './modal.module.css'

const Backdrop = props => {
  return <div className={styles.backdrop} onClick={props.onClose} />
};

const ModalOverlay = props => {
  return (
    <div className={styles.modal}>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
};

// <Backdrop />
// <ModalOverlay>{props.children}</ModalOverlay>
export default function Modal(props) {
  const portalElement = document.getElementById('overlays');


  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
      {ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, portalElement)}
    </Fragment>
  )
};
