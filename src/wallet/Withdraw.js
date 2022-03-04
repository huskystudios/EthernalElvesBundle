import React from "react"
import { useState, useEffect } from "react"
import {withdrawTokenBalance, getCurrentWalletConnected, withdrawSomeTokenBalance, balanceOf, checkOutRen, polygonContract, polyweb3 } from "../utils/interact"
import {useMoralis, useChain} from "react-moralis"
import Modal from "../components/Modal"
import Loader from "../components/Loader"

const Withdraw = () => {

  const { Moralis } = useMoralis();

  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState(0);
  const [polyBalance, setPolyBalance] = useState(0);
  const [polyBalanceToClaim, setPolyBalanceToClaim] = useState(0);
  const [balanceToClaim, setBalanceToClaim] = useState(0);
  const [miren, setMiren] = useState(0);
  const [modal, setModal] = useState(false);
  const [renTransfersIn, setRenTransfersIn] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState("");


const getRenBalance = async (address) => {

 let allbalances = await balanceOf(address);

 Moralis.Cloud.run("updateUser", {ownerBalances: allbalances, ownerAddress: address})

 console.log("Account balances:", allbalances)

  
  setBalance(allbalances.contractRen/1000000000000000000);
  setMiren(allbalances.miren/1000000000000000000);
  setPolyBalance(allbalances.polyMiren/1000000000000000000);

}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const claimCustomAmount = async () => {
      
  const params = {amount: Moralis.Units.ETH(balanceToClaim)}
  await withdrawSomeTokenBalance(params)
                  
}

const resetVariables = async () => {
  setStatus("");
  setPolyBalanceToClaim(0);
  setBalanceToClaim(0); 
  setConfirm(false);
}

const claimCustomAmountPolygon = async () => {

  setLoading(true)
  setStatus("Claiming REN credits from Polygon contract...")
  const owner = await getCurrentWalletConnected() 
   

  const params =  {functionCall: polygonContract.methods.checkIn([], Moralis.Units.ETH(polyBalanceToClaim), owner.address).encodeABI()}

      try{
            const tx = await Moralis.Cloud.run("defenderRelay", params) 

            if(tx.data.status){             
            
            let polyTxHash = tx.data.result.replaceAll("\"", "")

            let txHashLink = `https://polygonscan.com/tx/${polyTxHash}`
        
            let successMessage = <>Ren claimed on polygon, sending to Eth. Note down your transaction hash on <a target="_blank" href={txHashLink}>Polyscan</a>. Waiting for receipt.</>
            setStatus(successMessage)
            console.log("Submitted transaction with hash: ", txHashLink)

            await sleep(7000)
            let transactionReceipt = null
             
              while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
                  transactionReceipt = await polyweb3.eth.getTransactionReceipt(polyTxHash);
                  setStatus("Waiting for transaction to be mined...")
                  await sleep(2000)
              }
              setStatus("Transaction mined, getting signature for transfer to Eth...")
   
              let from = transactionReceipt.logs[0].topics[1]
              //convert from hex to string
              from = from.substring(26)
              from = "0x" + from
              console.log(from)
          
              let renAmount = transactionReceipt.logs[0].topics[2]
              //convert amount from hex to decimal
              renAmount = parseInt(renAmount, 16)
              let timestamp = parseInt(transactionReceipt.logs[1].data, 16)
              
              timestamp = timestamp.toString()
              renAmount = renAmount.toString()
              
              const ClaimRen = Moralis.Object.extend("ClaimRen");
              let query = new Moralis.Query(ClaimRen);
              query.equalTo("from", owner.address);
              query.equalTo("timestamp", timestamp);
              query.equalTo("renAmount", renAmount);
              const res = await query.first();

              const transferObject = new ClaimRen();

              if(!res){   

                  transferObject.set("from", owner.address);
                  transferObject.set("timestamp", timestamp);
                  transferObject.set("renAmount", renAmount);
                  transferObject.set("txHash", polyTxHash);
                  transferObject.set("transferTo", "eth");
                  transferObject.set("status", "pending");
                  transferObject.save();  

                }else{
                  res.set("from", owner.address);
                  res.set("timestamp", timestamp);
                  res.set("renAmount", renAmount);
                  res.set("txHash", polyTxHash);
                  res.set("transferTo", "eth");
                  res.set("status", "pending");
                  res.save();  
                }

              await claimPendingTxhash(transactionReceipt)
              await getRenBalance(owner.address)
              setPolyBalanceToClaim(0)
              setConfirm(!confirm)          
            }           


        }catch(e){
            console.log(e)
            setConfirm(!confirm)
            setLoading(false)
            setStatus("An error occured, please check to see if a transfer is pending before trying again.")
        }
        //setConfirm(false)
        

    }
    
    const claimPendingTxhash = async (_transactionReceipt) => {

      setLoading(true)
      setStatus("Confirmeing REN on ETH...")
      const owner = await getCurrentWalletConnected()      
            
            try{              
                  //Check if tx receipt is includes, else fetch from polyhash provided by user.
                  let transactionReceipt = pendingTxHash ? await polyweb3.eth.getTransactionReceipt(pendingTxHash) : _transactionReceipt
                  console.log("Transaction receipt: ", transactionReceipt)

                  Moralis.Cloud.run("claimRenWithHash", {txHash: transactionReceipt}).then((getsignature) => {
                  setStatus("Getting signature for REN claim on Eth")
                  const ethClaimParams =  {renAmount: getsignature.renAmount.toString(), signature: getsignature.signature.signature, timestamp: getsignature.timestamp}
                  
                  const txHashinClaimRen = transactionReceipt.transactionHash
                  setStatus("Brining up web3, please confirm the claim on your wallet. After confirmation, this dialog will wait for the transaction to be mined.")
                          checkOutRen(ethClaimParams).then((r) => {

                            r. success && setStatus(r.status)  
                            setStatus("Success - updating db...")
                            //r.txHash
                            //
                            if(r.receipt.status){
                            
                                      const ClaimRen = Moralis.Object.extend("ClaimRen");
                                      let query = new Moralis.Query(ClaimRen);
                                      query.equalTo("txHash", txHashinClaimRen);
                      
                                        query.first().then((res) => {

                                        res.set("txHashCompleted", r.txHash);
                                        res.set("transferTo", "eth");
                                        res.set("signature", getsignature.signature.signature);
                                        res.set("status", "completed");
                                        res.save().then(() => {
                                          setStatus("Success - updating db...")
                                          setPolyBalanceToClaim(0)                            
                                          setLoading(false)
                                        })  
                                        console.log("this step", r)
                                        
                                      });
                                      
                            }
                
                            

                          })  
                  

                 },(e) => {
                  console.log("failed at signature:", e)
                  setStatus("Failed, please look for pending transfers and try again.")
                 })     
                  
                 await getRenBalance(owner.address)
                
    
            }catch(e){
                console.log(e)        
                setLoading(false)
                setStatus("An error occured, please try again.")
            }
        
          
    
        }
  

const getTxs = async (address) => {

   
     const ClaimRen = Moralis.Object.extend("ClaimRen");

     const query = new Moralis.Query(ClaimRen);
     query.equalTo("from", address);
     query.notEqualTo("status", "completed");
     query.descending("createdAt")
     const renResponse = await query.find();
     setRenTransfersIn(renResponse)
     console.log("pending claim from polygon:", renResponse ? renResponse : 0)
}


useEffect( () => {
  const init = async () => {
    const {address, status} = await getCurrentWalletConnected();
    address &&  await getRenBalance(address)
    address && await getTxs(address)
    setLoading(false)
   
  }

  init();
  
},[modal])

const ShowPendingTransfers = () => {



  return(

<div className="table">          
<table style={{width: '100%'}}>
<thead style={{textAlign: "left"}}>
  <tr>
  <th>Date/Time</th>
  <th>Status</th>
  <th>$REN</th>    
  <th>TX Link</th>       
  <th>TX Hash</th>     
  </tr>
</thead>
<tbody>
    
      {renTransfersIn && renTransfersIn.map((line, index) => {
          
          let createDate = new Date( Date.parse(line.createdAt))
          let txHash = line.attributes.txHash
          let txLink = `https://polygonscan.com/tx/${txHash}`

     
          return(
              <tr key={index}> 
              <td>{createDate.toGMTString()}</td>
              <td>{line.attributes.status}</td>
              <td>{line.attributes.renAmount/1000000000000000000}</td>                          
              <td><a target="_blank" href={txLink}>View Tx</a></td>
              <td style={{textTransform: `lowercase`}} >{txHash}</td>
             
             
     
          </tr>
          )
      }
       
       
       
      )}
 

      
</tbody>
</table>


</div>

  )
}

/*

   {RenTransfersIn ?   
            <>
             <p>REN credits: {polyBalance.toFixed()} {polyBalanceToClaim > 0 && `- ${polyBalanceToClaim}`}</p>             
                <button
                      className="btn btn-grey"
                      onClick={claimPolyRen}
                      >
                          Claim {(RenTransfersIn.attributes.renAmount/1000000000000000000) } REN
                </button></>  : <>             
                                <input
                                    type="range"
                                    min="0"
                                    max={polyBalance}
                                    value={polyBalanceToClaim}
                                    onChange={(e) => setPolyBalanceToClaim(e.target.value)}
                                    step="1"
                                />
                                <div className="flex">
                                <button
                                    className="btn btn-grey"
                                    onClick={() => setConfirm(!confirm)}
                                    disabled={polyBalanceToClaim <= 0}
                                >
                                   Initiate Claim {polyBalanceToClaim} REN
                                </button>
                                </div>
                            </>}

                            */
const claimPolyRen = async () => {

  

  if(renTransfersIn.attributes.status === "pending"){

  
    const params =  {renAmount:renTransfersIn.attributes.renAmount , signature:renTransfersIn.attributes.signature, timestamp:renTransfersIn.attributes.timestamp}
    console.log(params)
  
    let {success, status, txHash} = await checkOutRen(params)       
    
      if(success){
        renTransfersIn.set("status", "initiated")
        renTransfersIn.save()
        console.log("success")
        setModal(!modal)
      }

    }else{
      alert("You have already claimed this REN tx. Please wait for it to be mined.")
    }            
  }
  
  return (
      <>
    <div className="search">
    <button onClick={() => setModal(!modal)}>REN</button>
    </div>
     
     <Modal show={modal}> 

{confirm ?
!loading ?
<>

<div className="withdraw-body">
              
              <div className="columns">
                <h3>Claim REN Credits from Polygon gameplay to Eth</h3>
  <p>Please read carefully! Not following these instructions can cause REN to go missing!</p>

  <ul>
  <li>IMPORTANT! THE SECOND STEP OF THIS PROCESS IS NOT GASLESS. PLEASE DONT INITIATE IT IF YOU DO NOT INTEND TO CLAIM REN TO ETH AT THIS POINT</li>
    <li>This is a two step process that can take upto 5 minutes. The first step is to deduct REN from your Polygon Credit balance.</li>
    <li>After the dApp submits the gasless function, it will use the receipt from the polygon trasnaction to generate the proof to mint the REN on ETH.</li>
    <li>Please leave the modal/dialog box open while the transaction completes. Please note down the polygon tx when it prompts. You will need this if the claim fails midway </li>
    <li>If the transaction does not go through, don't worry, you can use the "complete pending transaction" button on the previous page to finish the second step</li>
  </ul>
<div className={"flex"}>
<button className="btn btn-grey" onClick={resetVariables}>Back</button>
<button className="btn btn-grey" onClick={claimCustomAmountPolygon}>Confirm</button>

</div>

  </div>
</div>

</> : <Loader text={status}/> 


:

<>
{!loading ?
     <>
      
       <h1>REN Balances</h1>

       <div>
             <p>REN in wallet: {miren.toFixed()} </p>
        </div>

        <div>
          <p>{status}</p>
        </div>
      
       <div className="withdraw-body">
              
                <div className="columns">
                <h2>POLYGON REN CREDITS</h2>
               <div>
                <p>REN credits: {polyBalance.toFixed()}</p>
                </div>
          <div> 
          <input
                                    type="range"
                                    min="0"
                                    max={polyBalance}
                                    value={polyBalanceToClaim}
                                    onChange={(e) => setPolyBalanceToClaim(e.target.value)}
                                    step="1"
                                />
                                <div className="flex">
                                <button
                                    className="btn btn-grey"
                                    onClick={() => setConfirm(!confirm)}
                                    disabled={polyBalanceToClaim <= 0}
                                >
                                   Initiate Claim {polyBalanceToClaim} REN
                                </button>
                                </div>
        </div>
        
</div>  
<div className="columns">
          <h2>ETH REN CREDITS</h2>
          <div><p>REN credits: {balance} {balanceToClaim > 0 && `- ${balanceToClaim}`}</p></div>
          <div><input
                  type="range"
                  min="0"
                  max={balance}
                  value={balanceToClaim}
                  onChange={(e) => setBalanceToClaim(e.target.value)}
                  step="1"
              />

              <div className="flex">
              <button
                  className="btn btn-grey"
                  onClick={claimCustomAmount}
                  disabled={balanceToClaim <= 0}
              >
                  Claim {balanceToClaim} REN
              </button>
              </div>
            </div>
</div>
                </div>

      <div className="p-1">
      <div className="flex items-center justify-center">
      <h2>PENDING TRANSFERS</h2>
      </div>
      <div className="p-2">
      <p>If a polygon REN credit claim tx did not complete, please put the polygon tx hash in here and complete the second step</p>
      </div>
          <div className="flex items-center justify-center">
          <input type="text" placeholder="Polygon tx hash" onChange={(e) => setPendingTxHash(e.target.value)}/>
          <button className="btn btn-grey" onClick={claimPendingTxhash}> Complete pending transaction</button>
          </div>
          <div className="flex items-center justify-center p-1">
          <ShowPendingTransfers />
          </div>
      </div>

    </> : <Loader text={status}/>} </>}           
       </Modal>
      </>
    
    )
}

export default Withdraw