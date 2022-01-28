import React, { useState } from "react"
import logoImg from "../assets/images/logo.png"
import { NavLink } from "react-router-dom"
import ConnectWallet from "../wallet/ConnectWallet"
import Withdraw from "../wallet/Withdraw"


const MainLayout = (props) => {

    const [wallet, setWallet] = useState("");   
    const [status ,setStatus] = useState("");

    const onClickHome = () => {
        window.location.href='/';
        //window.location.reload(false);
    }

    return (
        <div className="app">
            <div className="app-header">
                <img className="app-logo" src={logoImg} alt="logo" />
                <div className="header-body"> 
                    {/*<NavLink className="nav-item" to="/">play</NavLink>*/}
                    <div onClick={onClickHome} className="nav-item" to="/">play</div>
                    <NavLink className="nav-item" to="/profile">profile</NavLink>
                    <ConnectWallet setStatus={setStatus} onSetWallet={setWallet} />
                    <NavLink className="nav-item" to="/mint">mint</NavLink>
                    <NavLink className="nav-item" to="/faq">faq</NavLink>
                </div>
               <div className="search">
                        <Withdraw address={wallet} />
                </div>
            </div>
            <div className="mobile-header">
                        <ConnectWallet setStatus={setStatus} onSetWallet={setWallet} />
             </div>    
            
            <div className="app-body">
                {props.children}
            </div>
        </div>
    )
}

export default MainLayout