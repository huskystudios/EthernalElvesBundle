import React, { useState } from "react"

const Actions = ({onChangeIndex, actions, setGameMode}) => {
    const handleClick = (value) => {
        if(value === 2) setGameMode("campaign");
        if(value === 3) setGameMode("bloodthirst");
        onChangeIndex(value)
    }
    const [show, setShow] = useState(false);
    const showTooltip = () => {
        if(!show) return <></>
        return (
            <div className="action-tooltip">
                <pre>Feature not available</pre>
            </div>
        )
    }
    return (
        <div className="d-flex flex-column campaign-panel">
            <div className="d-flex flex-column">
                <div className="sector-selection">
                    <h2>choose game mode</h2>
                    <div className="selection-content d-flex">
                        {actions.map((action, i) => 
                            <div className="d-flex flex-column w-full items-center" key={action.id}>
                                <img src={action.image} alt={action.text} />
                                <button
                                    className="btn-action" 
                                    onClick={() => handleClick(1 + i)}
                                   // onMouseEnter={() => i === 2 && setShow(true)}
                                   // onMouseLeave={() => i === 2 && setShow(false)} 
                                >
                                    {action.text}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-row justify-around">
                        <button className="btn btn-red" onClick={() => onChangeIndex(-2)} >back</button>
                    </div>
                </div>
            </div>
            {showTooltip()}
        </div>
    )
}

export default Actions