import React, { useState } from "react"
import logoImg from "../assets/images/logo.png"
import { NavLink } from "react-router-dom"
import ConnectWallet from "../wallet/ConnectWallet"
import Withdraw from "../wallet/Withdraw"
import ToggleChain from "../wallet/ChangeChain"
import menuImg from "../assets/images/menu.png"


const MainLayout = (props) => {

    const [wallet, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const onClickHome = () => {
        window.location.href = '/';
        //window.location.reload(false);
    }

    return (
        <div className="app">

            <div className="app-header">
           
                <img className="app-logo" src={logoImg} alt="logo" />
      
                <img onClick={() => setShowMenu(true)} className="sidenav-btn" src={menuImg} alt="logo" />
      
                <div className="header-body">
                <div className="search">
                <Withdraw />
                </div>
    
              
                    {/*
                     
                    <div onClick={onClickHome} className="nav-item" to="/">play</div>
                    <div className="nav-item menu">
                        <span>Play</span>
                        <div className="menu__items">
                            <NavLink to="/">
                                Visual Mode (ETH)
                            </NavLink>
                            <NavLink to="/playeth">
                                Whale Mode (ETH)
                            </NavLink>
                            <NavLink to="/playpoly">
                             Whale Mode (Polygon)
                            </NavLink>
                              </div>
                              </div>
                   
                    <NavLink className="nav-item" to="/profile">profile</NavLink>
                    <ConnectWallet /> 
                    <div style={{ width: 160 }}></div>
                    <NavLink className="nav-item" to={{ pathname: "https://transfers.ethernalElves.com" }} target="_blank">confirm transfers</NavLink>
                */}
                </div>

                {/**<ToggleChain /> 
                *  <div onClick={onClickHome} className="nav-item" to="/">play</div>
                *  <NavLink className="nav-item" to="/mint">mint</NavLink>
                * 
               */}
                <div className="connect-wallet"><ConnectWallet /></div>
               
            </div>

            <div className="mobile-header">
                <img onClick={() => setShowMenu(true)} className="app-logo" src={menuImg} alt="logo" />
                <ConnectWallet />
                <div className="ren-mobile">
                <Withdraw />
                </div>
            </div>

            <div className="app-body">
                {props.children}
            </div>
            <div className={showMenu ? "sidenav active" : "sidenav"}>
                <button className="closebtn" onClick={() => setShowMenu(false)}>&times;</button>
                <div onClick={onClickHome} className="nav-item" to="/">play</div>
                <NavLink className="nav-item" to="/profile">profile</NavLink>
                <div style={{ width: 160 }}></div>
                <NavLink className="nav-item" to={{ pathname: "https://transfers.ethernalElves.com" }} target="_blank">confirm transfers</NavLink>
                <a className="nav-item" href="https://docs.ethernalelves.com/" target="_blank" rel="noreferrer">Docs</a>
            </div>
        </div>
    )
}

export default MainLayout