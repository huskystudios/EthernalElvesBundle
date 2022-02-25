import React from "react"
import "./style.css"

const Loader = ({text}) => {

    return (
        <div className="dark-500 h-full text-center d-flex flex-column justify-center items-center font-size-md text-white">
            <div>
            <div className="loader"></div>          
            </div>
            <div className="mt-3">
            <span>{text ? text : "Loading... stuck? try the green button"}</span>
            </div>
            
        </div>
    )
}

export default Loader