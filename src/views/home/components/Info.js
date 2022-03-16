import React from "react"
import { useState, useEffect } from "react"

const Info = () => {

    
    return (
        <div className="d-flex flex-column campaign-panel">
            <div className="d-flex flex-column">
                <div className="sector-selection">
                    <h2>Creature Supply</h2>
                    <p>
                        Enter passive mode and earn rewards for keeping your elf staked. You need to come back here and return from passive mode once the required time has passed.
                    </p>
                    {/* <div className="d-flex flex-row justify-center">
                        <button className="btn btn-green" onClick={() => onRunWeb3({ action: "returnPassive" })} >return</button>
                    </div> */}
                    {/* <div className="sector-scroll">
                        <button className="btn-up" onClick={() => onPageChange(-1)} />
                        <button className="btn-down" onClick={() => onPageChange(1)} />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Info