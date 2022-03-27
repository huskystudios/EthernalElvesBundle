import React from "react"
import { useState, useEffect } from "react"
import "./style.css"

const Modal = ({ show, setShow, children }) => {

  if (!show) return <></>
  return (
    <div className="globalModal">
      <div className="globalModal-content">
        <span className="close-modal" onClick={() => setShow(false)}>X</span>
        {children}
      </div>
    </div>
  );

}

export default Modal