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
import MintPass from './views/mint/MintPass';

require('dotenv').config();

  
function App() {
  const [wallet, setWallet] = useState("")
  const [flip, setFlip] = useState(false)
  

  let dev1 = process.env.REACT_APP_DEV1
  let dev2 = process.env.REACT_APP_DEV2
  let dev3 = process.env.REACT_APP_DEV3

  let adminWallet = [dev1.toLowerCase(), dev2.toLowerCase(), dev3.toLowerCase()]

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
              <Route exact path="/whitelist">
                <MintPass />
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
