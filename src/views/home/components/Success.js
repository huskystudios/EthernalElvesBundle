import React from "react"

const Success = ({sector, onChangeIndex, campaign, success, data}) => {


    return (
        <div className="d-flex flex-column items-center">
            <p className="success-desc">You will enter the {campaign.name}.</p>
            <div className="elves-panel-success">
                {data.map((character) => 
                    <div key={character.id} className="elf-rect">
                        <img src={character.image} alt="elf" />
                    </div>
                )}
            </div>
            <div className="d-flex flex-row justify-around">
                    <button className="btn btn-red" onClick={() => onChangeIndex(-1)} >back</button>
                  
                </div>
        </div>
    )
}

export default Success