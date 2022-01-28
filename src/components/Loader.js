import React from "react"

const Loader = ({text}) => {

    return (
        <div className="dark-500 h-full text-center d-flex flex-column justify-center font-size-md text-white">
            <span>Loading...{text}</span>
        </div>
    )
}

export default Loader