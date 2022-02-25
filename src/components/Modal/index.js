import React from "react"
import { useState, useEffect } from "react"
import "./style.css"

const Modal = ({ show, children }) => {

  const [modal, setModal] = useState(true);

  useEffect(() => {
    setModal(!modal);
  }, [show]);

if(!modal) return <></>
return (
  <div className="globalModal">
          <div className="globalModal-content">
              <span className="close-modal" onClick={() => setModal(false)}>X</span>
              {children}
          </div>
  </div>
);

}

export default Modal