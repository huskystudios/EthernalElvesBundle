import React, { useEffect, useMemo, useState } from "react"
import Loader from "../../components/Loader"
import Control from "./components/Control"
import Overview from "./components/Overview"
import './style.css'
import {campaigns} from "./config" 
import SelectToken from "./components/SelectToken"
import Actions from "./components/Actions"
import Campaign from "./components/Campaign"
import Receive from "./components/Receive"
import Sector from "./components/Sector"
import Success from "./components/Success"
import Collection from "./components/Collection"
import { actions, actionString } from "./config"
import {elvesAbi, elvesContract, etherscan ,sendCampaign, lookupMultipleElves, getCurrentWalletConnected} from "../../utils/interact"
import { useMoralis } from "react-moralis";
import Staking from "./components/Staking"
import Help from "./components/Help"

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const [data, setData] = useState()
    const [activeNfts, setActiveNfts] = useState()
    const [campaign, setCampaign] = useState(campaigns[0])  
    const [sector, setSector] = useState(1)
    const [success, setSuccess] = useState()
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [wallet, setWallet] = useState()
    const [status, setStatus] = useState()
    const [loadingText, setLoadingText] = useState()



    const [gameMode, setGameMode] = useState("");
    
    const { Moralis } = useMoralis();
   

    /////////////////////////////



    const sendCampaignFunction = async (params) => {
        
        console.log("sendCampaignFunction", params)
        let {success, status, txHash} = await sendCampaign(params)

        success && resetVariables()

        setAlert({show: true, value: {
            title: "Tx Sent", 
            content: (status)            
      }})
        
     //   

        console.log("sendCampaign", params)
        /* 

        await Moralis.enableWeb3();
        const options = {
                contractAddress: elvesContract,
                functionName: "sendCampaign",
                abi: elvesAbi.abi,
                params: params,
                awaitReceipt: false // should be switched to false
              };

           const tx = await Moralis.executeFunction(options);
             
              tx.on("transactionHash", (hash) => { 
                resetVariables()
                setAlert({show: true, value: {
                    title: "Tx Sent", 
                    content: (<>✅ Check out your transaction on <a target="_blank" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
              }})
               
            })
             
              tx.on("receipt", (receipt) => { 

                setTxReceipt(receipt)
                let response

                receipt.events.Action.isArray ? response = `Elf#${ receipt.events.Action.map(nft => {return(nft.returnValues.tokenId)})} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`
                
                setAlert({show: true, value: {
                      title: "Tx Successful", 
                   content: response         
             }})
           
            })
                     
           */  
   
        }



    //////////////////////////   


        const doAction = async (option) => {
            
            await Moralis.enableWeb3()
            
            const first = activeNfts.map(nft => {return(nft.id)})
            
            const rerollParams = {ids: activeNfts.map(nft => {return(nft.id)}), action_: option.toString()}
            const healParams =   {healer: first[0], target: option.healIds}
            let value = option.action === "forging" || option.action === "merchant" ? Moralis.Units.ETH("0.01") : Moralis.Units.ETH("0")
            let params = option.action === "heal" ? healParams : rerollParams   

            const options = {
                    contractAddress: elvesContract,
                    functionName: option.action,
                    abi: elvesAbi.abi,
                    params: params,
                    msgValue: value,
                    awaitReceipt: false // should be switched to false
                  };
    
                  const tx = await Moralis.executeFunction(options);
                  
                  tx.on("transactionHash", (hash) => { 
                    resetVariables()
                    setAlert({show: true, value: {
                        title: "Tx Successful", 
                        content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
                  }})
                    
                })
                  
                  tx.on("receipt", (receipt) => { 

                    setTxReceipt(receipt)
                    let response

                    receipt.events.Action.isArray ? response = `Elf#${ receipt.events.Action.map(nft => {return(nft.returnValues.tokenId)})} have started doing ${actionString[receipt.events.Action[0].returnValues.action].text}`
                    : response = `Elf#${receipt.events.Action.returnValues.tokenId} has started doing action ${actionString[receipt.events.Action.returnValues.action].text}`
                   




                    setAlert({show: true, value: {
                          title: "Tx Successful", 
                          content: response            
                    }})
                
                })
                          
            }


    
const getElvesfromMoralis = async (address) => {
    
    
    const params =  {address: address}
    setLoadingText(`25% Fetching elves for address ${address}`)
    const userTokenArray = await Moralis.Cloud.run("getElvesFromDb", params);
    
    setLoadingText(`50% Getting metadata from the blockchain`)
    const lookupParams = {array: userTokenArray, chain: "eth"}

    const elves = await lookupMultipleElves(lookupParams)
    elves.sort((a, b) => a.id - b.id)
    
    setData(elves)


    setLoadingText(`100% Done!`)
    elves && setLoading(false)

}
    
    const onSelect = (nfts) => {

        if(nfts.length > 1) {
            setActiveNfts(nfts)
          
            setIndex(1)
        }else if(nfts.length === 1) {
            setActiveNfts(nfts)
            setIndex(1)
        }
    }


 
    const onChangeIndex = (value) => {
      
        if(index + value < 0) resetVariables()
        else setIndex(index + value)
    }

    const getActivities = useMemo(() => {
        if(!campaign) return null
        if(index === 3) {
            const txt = `campaign: ${campaign.name}\ntime: ${campaign.time}`;
            return txt
        }
        return null
    }, [campaign, index])



    useEffect(() => {
       
        const getData = async () => {
            setLoading(true)
            setLoadingText(`Connect Wallet`)
            const {address} = await getCurrentWalletConnected();
            setWallet(address)
            address && setLoadingText(`10% Wallet connected`)   
            address && await getElvesfromMoralis(address)
        }
        
        getData()
      },[txreceipt, wallet])

      const resetVariables = async () => {
          setIndex(0)
          setActiveNfts(null)
          setCampaign(campaigns[0])  
          setSector(1)
          setSuccess(false)          
      }


    const showAlert = ({title, content}) => {

        return (
            <div className="alert">
                <h3>{title}</h3>
                <pre>{content}</pre>
                <button className="btn btn-red" onClick={()=>setAlert({show: false})}>close</button>
            </div>
        )
    }


   
   

     return (
        <>
        {loading ? <Loader text={loadingText}/> :
        <>
            <div className="dark-1000 h-full d-flex home justify-center items-center">
            {alert.show && showAlert(alert.value)}
                
               
                {index === 0 &&  <Help />}

                {index === 1 && activeNfts.length > 1 ? <Collection nft={activeNfts} onChangeIndex={onChangeIndex} /> : null }
                {index === 1 && activeNfts.length === 1 ? <Overview nft={activeNfts} onRunWeb3={doAction}  onChangeIndex={onChangeIndex} /> : null}                
                {index === 2 &&  <Actions doAction={doAction} actions={actions} onChangeIndex={onChangeIndex} setGameMode={setGameMode} />}
                {index === 3 &&  <Staking nft={activeNfts} onRunWeb3={doAction} onChangeIndex={onChangeIndex} />}
                {index === 4 &&  <Campaign onSetCampaign={setCampaign} onChangeIndex={onChangeIndex} />}
                {index === 5 &&  <Sector campaign={campaign} data={activeNfts} onSendCampaign={sendCampaignFunction} onChangeIndex={onChangeIndex} mode={gameMode} /> }
                {index === 6 &&  <Success success={success} sector={sector} campaign={campaign} data={activeNfts} onChangeIndex={onChangeIndex}/>}
                {index === 7 &&  <Receive onChangeIndex={onChangeIndex} />}
                {index === 0  && data && wallet && <Control data={data} activities={getActivities} onSelect={onSelect} />}               
                
            </div>
            <div className="dark-1000 h-full d-flex home-mobile justify-center items-center">
            <div className="btn-lounge" onClick={() => window.location.href="/profile" }>Whitelist Mint</div>
            <div className="btn-lounge" onClick={() => window.location.href="/mint" }>Mint</div>
            </div>
          
        </>
        }
        </>
    )
}

export default Home
