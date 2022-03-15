import React, { useEffect, useMemo, useState } from "react"
import Countdown from 'react-countdown';

const Heal = ({ healing, healMany, healers, targets, data, chain, setAlert, setHealers, setTargets }) => {

    const heal = () => {
        if (healers.length > 1) {
            console.log("heal many")
            if (healers.length !== targets.length) {
                setAlert({
                    show: true, value: {
                        title: "Error",
                        content: "Mismatch in healers and targets"
                    }
                })
                return
            }
            healMany()
        } else {

            if (healers[0].classString !== "Druid") {
                setAlert({
                    show: true, value: {
                        title: "Error",
                        content: "You can only heal with Druids"
                    }
                })
                return
            }

            if (healers[0].cooldown === true) {
                setAlert({
                    show: true, value: {
                        title: "Error",
                        content: "Druid in cooldown!"
                    }
                })
                return

            }
            if (targets[0].cooldown === false) {
                setAlert({
                    show: true, value: {
                        title: "Error",
                        content: "Target is not in cooldown!"
                    }
                })
                return
            }

            healing()
            console.log("heal someoone")

        }
    }


    const handleClickHealer = (nft) => {

        //if chain === eth only allow one to be clicked
        if (chain === "eth") {
            if (healers.length > 0) {
                setAlert({
                    show: true, value: {
                        title: "Error",
                        content: "You can only heal one person at a time"
                    }
                })
                return
            }
        }
        if (healers.includes(nft)) setHealers(healers.filter(item => item !== nft))
        else setHealers(state => [...state, nft])
    }
    const handleClickTarget = (nft) => {
        if (chain === "eth") {
            if (healers.length > 0) {
                setAlert({
                    show: true, value: {
                        title: "Error",
                        content: "You can only heal one person at a time"
                    }
                })
                return
            }
        }
        if (targets.includes(nft)) setTargets(targets.filter(item => item !== nft))
        else setTargets(state => [...state, nft])
    }
    //filter druids whos have no cooldown
    let healerSelect = data.filter(item => item.cooldown === false && item.classString === "Druid")
    let targetSelect = data.filter(item => item.cooldown === true && item.classString !== "Druid")

    return (
        <>
            <h3>Confirm Heal</h3>

            <div className="flex flex-column w-full items-center">
                <h4>Select healers</h4>
                <div className="nft-grid">
                    {healerSelect.map((nft) =>
                        <img onClick={() => handleClickHealer(nft)} className={healers.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                    )}
                </div>
                <h4>Select targets</h4>
                <div className="nft-grid">
                    {targetSelect.map((nft) => {

                        const date = new Date(nft.time * 1000)
                        return (
                            <>
                                <div className="">
                                    <img onClick={() => handleClickTarget(nft)} className={targets.includes(nft) ? "active" : null} src={nft.image} alt={nft.id} key={nft.id} />
                                    <p>{nft.classString}</p>
                                    <span><Countdown date={date} /> </span>
                                </div>

                            </>
                        )
                    })}
                </div>
                <p className="text-danger">(The number of healers needs to match the number of targets.)</p>
            </div>
            <div className="flex mt-1">
                <button className="btn-modal" onClick={heal}>HEAL</button>
            </div>
        </>
    )
}


export default Heal
