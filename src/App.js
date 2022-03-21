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
import { getCurrentWalletConnected } from './utils/interact'
import { useState, useEffect } from 'react';
import Explore from './views/home/components/Explore';
import {app, analytics} from './utils/initFirebase'

require('dotenv').config();

let testwallet = ["0xc5ec89d7886044a330abec9c002259674f6de42a"] //,"0xccb6d1e4acec2373077cb4a6151b1506f873a1a5"]

function App() {

const [flip, setFlip] = useState(false)  
const [flip1, setflip1] = useState(false)  

  let dev1 = process.env.REACT_APP_DEV1
  let dev2 = process.env.REACT_APP_DEV2
  let dev3 = process.env.REACT_APP_DEV3  

  let adminWallet = [dev1.toLowerCase(), dev2.toLowerCase(), dev3.toLowerCase()]

  useEffect(async() => {

    const {address} = await getCurrentWalletConnected()

    if(adminWallet.includes(address.toLowerCase())){
      setFlip(true)
    }

    if(testwallet.includes(address.toLowerCase())){
      setflip1(true)
    }

  }, [])
  return (
      <div className="App">
        <Router>
          <MainLayout>
            <Switch>
              <Route exact path="/">
               {!flip1 ? <Home /> : <>{/* * remember to remove any test code from here before deployment * */}</>}
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
              <Route exact path="/explore">
                <Explore />
              </Route>
             </Switch>
          </MainLayout>
        </Router>
      </div>

  );
}

export default App;
