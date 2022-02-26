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
                <Withdraw />
                    
                    
                    <div onClick={onClickHome} className="nav-item" to="/">play</div>
                    {/*}<div className="nav-item menu">
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
                    */} 
                    <NavLink className="nav-item" to="/profile">profile</NavLink>
                    <ConnectWallet />
                   
                    <NavLink className="nav-item" to="/faq">faq</NavLink>
                    <NavLink className="nav-item" to="/transfers">transfers</NavLink>
                </div>
              
               {/**<ToggleChain /> 
                *  <div onClick={onClickHome} className="nav-item" to="/">play</div>
                *  <NavLink className="nav-item" to="/mint">mint</NavLink>
                * 
               */} 

           
               
               
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