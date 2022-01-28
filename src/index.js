import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { MoralisProvider } from "react-moralis";
require('dotenv').config();

//const creds = {appId: "", serverUrl: "https://ehxlulvkbgjz.usemoralis.com:2053/server"}; //Goerli
const creds = {appId: process.env.REACT_APP_MORALIS_APPID, serverUrl: "https://btx7uykjbmv4.usemoralis.com:2053/server"}; //Mainnet

ReactDOM.render(
  <MoralisProvider appId={creds.appId} serverUrl={creds.serverUrl}>
  <React.StrictMode>
       <App />
  </React.StrictMode>
  </MoralisProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

