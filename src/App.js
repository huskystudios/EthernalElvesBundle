import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MainLayout from './templates/MainLayout';
import Home from './views/home';
import Mint from './views/mint';
import Admin from './views/admin';
import Profile from './views/profile';
import Faq from './views/faq';
import { getCurrentWalletConnected } from './utils/interact'
import { useState, useEffect } from 'react';

  
function App() {
  const [wallet, setWallet] = useState("")
  const [flip, setFlip] = useState(false)
  

  let husky ="0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
  let beff = "0x3296D61C5E737F9847bA52267b1DeBB8Dbff139F"
  let deployer = "0x6B635fE980681B4b5f1eCf371ce76eF6826c0552" //change this
  let adminWallet = [husky.toLowerCase(), beff.toLowerCase(), deployer.toLowerCase()]

  useEffect(async() => {
    const {address} = await getCurrentWalletConnected()
    setWallet(address)
    if(adminWallet.includes(address.toLowerCase())){
      setFlip(true)
    }

  }, [])
  return (
      <div className="App">
        <Router>
          <MainLayout>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/admin">
                {flip ? <Admin/> : <Home/>}
              </Route>
              <Route exact path="/mint">
                <Mint />
              </Route>
              <Route exact path="/profile">
                <Profile />
              </Route>
              <Route exact path="/faq">
                <Faq />
              </Route>
            </Switch>
          </MainLayout>
        </Router>
      </div>

  );
}

export default App;
