import React from "react"
import { useState, useEffect } from "react"

const Staking = ({onChangeIndex, nft, onRunWeb3}) => {

    const [enableReturn, setEnableReturn] = useState(false)
    
    useEffect(() => {

    let flag = 0

    nft.map((elf) => {
        if(elf.action === 3){
            flag = 1
            console.log(elf.action)
        }else{
            flag = 0
        }
    })

    flag === 1 ? setEnableReturn(true) : setEnableReturn(false)

    }, [nft])

    
    return (
        <div className="d-flex flex-column campaign-panel">
            <div className="d-flex flex-column">
                <div className="sector-selection">
                    <h2>Passive Campaign Mode {enableReturn ? "- return" : "- send"}</h2>
                    <p>
                            Enter passive mode and earn rewards for keeping your elf staked. You need to come back here and return from passive mode once the required time has passed.
                        </p>
                        <p>
                            If you skip this step you could lose your rewards. 
                        </p>
                    <div className="selection-content d-flex">

        
                        <div className="d-flex flex-column w-full items-center">
                            <p>Rewards ($REN)</p>
                            <table width={400}>
                                <thead>
                                    <tr>
                                        <th>1 Week</th>
                                        <th>14 Days</th>
                                        <th>30 Days</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                           140 $REN
                                        </td>
                                        <td>
                                           420 $REN
                                        </td>
                                        <td>
                                           1200 $REN
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <br/>
                            {nft.length > 0 &&
                            <img style={{width: 150}} src={nft[0].image} alt={nft.id} />}
                            <p>Rewards: $ren daily</p>
                            <p>level: 1 level per day</p>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-between">
                        <div></div>
                        {enableReturn ? <button className="btn btn-green" onClick={() => onRunWeb3({action: "returnPassive"})} >return</button>
                        : <button className="btn btn-green" onClick={() => onRunWeb3({action:"sendPassive"})} >send</button>    
                    }
                    </div>
                    {/* <div className="sector-scroll">
                        <button className="btn-up" onClick={() => onPageChange(-1)} />
                        <button className="btn-down" onClick={() => onPageChange(1)} />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Staking