import React, { useState } from "react"

const Options = ({onChangeIndex, onSetWeaponOption, onSetInventoryOption, onSetInventoryUseOption}) => {
    const [option, setOption] = useState(false)
    // const [confirm, setConfirm] = useState(false)
    const [screenIndex, setScreenIndex] = useState(0)

    const handleChangeIndex = (value) => {

        screenIndex === 0 && onSetWeaponOption(option)
        screenIndex === 1 && onSetInventoryOption(option)
        screenIndex === 2 && onSetInventoryUseOption(option)
        screenIndex === 2 && onChangeIndex(value)
        screenIndex < 0 && onChangeIndex(value)
        console.log(screenIndex)
        setOption(0)
        setScreenIndex(screenIndex + value)
    }

    return (
        <div className="d-flex flex-column">
            {screenIndex === 0 && <p className="confirm-desc">do you want to look for a new weapon or keep your current weapon?</p>}
            {screenIndex === 1 && <p className="confirm-desc">do you want to claim a new item or keep your current item?</p>}
            {screenIndex === 2 && <p className="confirm-desc">use current item in campaign? </p>}
            
            <div className="option-panel">
                {screenIndex === 0 ? 
                <>
                <button className={option === false ? "btn-option active" : "btn-option"} onClick={() => {setOption(false)}}>keep weapon</button>
                <button className={option === true ? "btn-option active" : "btn-option"} onClick={() => {setOption(true)}}>claim new weapon</button>
                </> : screenIndex === 1 ? <>
                
                <button className={option === false ? "btn-option active" : "btn-option"} onClick={() => {setOption(false)}}>keep item</button>
                <button className={option === true ? "btn-option active" : "btn-option"} onClick={() => {setOption(true)}}>claim new item</button>
                </> : screenIndex === 2 ? <>
                <button className={option === false ? "btn-option active" : "btn-option"} onClick={() => {setOption(false)}}>store item</button>
                <button className={option === true ? "btn-option active" : "btn-option"} onClick={() => {setOption(true)}}>use item</button>
                </> : null}

                <div className="d-flex flex-row justify-around">
                    <button className="btn btn-red" onClick={() => handleChangeIndex(-1)} >back</button>
                    <button className="btn btn-green" onClick={() => handleChangeIndex(1)} >{'next'}</button>
                </div> 
            </div>  
            
        </div>
    )
}

export default Options