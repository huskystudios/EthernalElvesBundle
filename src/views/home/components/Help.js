import React, { useState, useEffect } from "react"
import Dropdown from "../../../components/Dropdown/"
import Button from "../../../components/Dropdown/button";

const Help = ({data, toggle, clicked, selectAll, excludeAction}) => {
    // console.log(data)
    const [now, setNow] = useState(new Date());
    const [timer, setTimer] = useState(0);
    const [classes, setClasses] = useState([])
    const [actions, setActions] = useState([])
    const [levels, setLevels] = useState([])
    const [filterdData, setFilteredData] = useState(data)
    const [classCnt, setClassCnt] = useState()
    const [actionCnt, setActionCnt] = useState()
    const [levelCnt, setLevelCnt] = useState()
    const [toggleAll, setToggleAll] = useState(true)
    const handleClick = (nft) => {
        toggle(nft)
    }
    const getTimeString = (timestamp) => {
        const endTime = new Date(timestamp * 1000)
        const elapsed = endTime.getTime() - now.getTime()
        const seconds = Number(elapsed / 1000);
        const d = Math. floor(seconds / (3600*24));
        const h = Math. floor(seconds % (3600*24) / 3600);
        const m = Math. floor(seconds % 3600 / 60);
        const s = Math. floor(seconds % 60);
        return d > 0 ? `${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : h > 0 ? `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    useEffect(() => {
        setTimeout(() => {
            setNow(new Date())
            setTimer(timer * -1)
        }, 1000)
    }, [timer])
    useEffect(() => {
        let tmpData = data
        if(classes.length) {
            tmpData = tmpData.filter(element => classes.includes(element.classString))
        }
        if(actions.length) {
            tmpData = tmpData.filter(element => actions.includes(element.actionString))
        }
        if(levels.length) {
            tmpData = tmpData.filter(element => levels.includes(element.level.toString()))
        }
        setFilteredData(tmpData)
    }, [data, classes, actions, levels])
    useEffect(() => {
        const countClasses = {}
        const countActions = {}
        const countLevels = {}
        data.forEach((nft) => {
            // console.log(nft)
            countClasses[nft.classString] = (countClasses[nft.classString] || 0) + 1
            countActions[nft.actionString] = (countActions[nft.actionString] || 0) + 1
            countLevels[nft.level] = (countLevels[nft.level] || 0) + 1
        })
        setClassCnt(countClasses)
        setActionCnt(countActions)
        setLevelCnt(countLevels)
    }, [data])
    const handleSelectAll = () => {
        if(filterdData.length === 0) return
        selectAll()
        if(toggleAll) selectAll(filterdData)
        setToggleAll(toggle => !toggle)
    }
    useEffect(() => {
        if(clicked.length === filterdData.length) setToggleAll(false)
        else setToggleAll(true)
        if(filterdData.length === 0) setToggleAll(true)
    }, [clicked, filterdData])
    return (
        <>
            <div className="collection-content d-flex flex-column">
                <div className="filter-panel">
                    <Dropdown title="Action" options={["Idle", "Staked", "On Campaign", "Healing", "Done Healing", "Unknown"]} count={actionCnt} onChange={setActions} selected={actions} />
                    <Dropdown title="Class" options={["Assassin", "Druid", "Ranger"]} onChange={setClasses} selected={classes} count={classCnt} />
                    <Dropdown title="Level" options={levelCnt ? Object.keys(levelCnt) : []} onChange={setLevels} selected={levels} count={levelCnt} />
                    <Button onClick={handleSelectAll} value={toggleAll ? "Select All" : "Deselect All"} />
                    <span className="total-sentinel">Total Sentinels ({data.length})</span>
                </div>
                <div className="collection-panel">
                    <div className="collection-selection" >
                        <div className="card-grid">
                            {filterdData.map((nft) => (
                                <div className={`character-card ${nft.action === 8 ? "greyout" : ""} ${clicked.includes(nft) ? "active" : ""}`} key={nft.id} onClick={() => { handleClick(nft)}}>
                                    <div className="d-flex justify-between font-size-sm">
                                        <span>{nft.actionString}</span>
                                        <span>#{nft.id}</span>
                                    </div>
                                    <img className="character-image" src={nft.image} />
                                    <span>Level: {nft.level}</span>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">weapon</span>
                                        <span className="props-value">{nft.attributes[3].value}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">item</span>
                                        <span className="props-value">{nft.inventoryString}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">timer</span>
                                        <span className="props-value">{Date.now() > nft.time * 1000 ? "" : getTimeString(nft.time)}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center mt-1">
                                        <span className="props-title">hp</span>
                                        <span>{nft.health}</span>
                                        <span className="props-title">ap</span>
                                        <span>{nft.attack}</span>
                                    </div>
                                    <div className="d-flex justify-between font-size-xs items-center">
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Help