import React, { useState } from "react"
import logoImg from "../assets/images/logo.png"
import { NavLink } from "react-router-dom"
import ConnectWallet from "../wallet/ConnectWallet"
import Withdraw from "../wallet/Withdraw"
import ToggleChain from "../wallet/ChangeChain"


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
                    
                   
                    <NavLink className="nav-item" to="/playeth">play on ethereum</NavLink>
                    <NavLink className="nav-item" to="/playpoly">play on polygon</NavLink>
                    <NavLink className="nav-item" to="/profile">profile</NavLink>
                    <ConnectWallet />
                   
                    <NavLink className="nav-item" to="/faq">faq</NavLink>
                    <NavLink className="nav-item" to="/lookup">lookup</NavLink>
                </div>
              
               {/**<ToggleChain /> 
                *  <div onClick={onClickHome} className="nav-item" to="/">play</div>
                *  <NavLink className="nav-item" to="/mint">mint</NavLink>
                * 
               */} 
                <Withdraw />
               
            </div>
            <div className="mobile-header">
                        <ConnectWallet />
                       
             </div>    
            
            <div className="app-body">
                {props.children}
            </div>
        </div>
    )
}

export default MainLayout