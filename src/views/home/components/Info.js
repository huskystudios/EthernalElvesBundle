import React from "react"
import { useState, useEffect } from "react"

const Info = () => {

    
    return (
        <div className="d-flex flex-column campaign-panel">
            <div className="d-flex flex-column">
                <div className="sector-selection">
                    <h2>Creature Supply</h2>
                    <div className="flex justify-between gap-2 w-half" style={{marginTop: 64}}>
                        <div className="flex flex-column gap-1 items-start" style={{textAlign: "left"}}>
                            <span>Wandering Souls</span>
                            <span>Fervorous hollow</span>
                            <span>hidden grove</span>
                            <span>tomb of vitality</span>
                            <span>inferno abyss</span>
                            <span>untamed ether</span>
                            <span>dark untamed ether</span>
                        </div>
                        <div className="flex flex-column gap-1 items-end">
                            <span>10,000</span>
                            <span>8,000</span>
                            <span>4,000</span>
                            <span>2,000</span>
                            <span>600</span>
                            <span>100</span>
                            <span>100</span>                            
                        </div>
                    </div>
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