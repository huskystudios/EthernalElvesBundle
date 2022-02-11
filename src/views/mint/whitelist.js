import React from "react"
import { useState, useEffect } from "react"
import './style.css'
import {
    // getTokenSupply, 
    elvesAbi, 
    elvesContract,
    etherscan

} from "../../utils/interact"
import { useMoralis } from "react-moralis"


const WhitelistMint = ({mintcreds}) => {

    const { Moralis } = useMoralis();
    const [supply, setSupply] = useState("...");
    const [txReceipt, setTxReceipt] = useState();
    const [signature, setSignature] = useState(mintcreds.signature);
    const [roleIndex, setRoleIndex] = useState(mintcreds.role);
    const [toWallet, setToWallet] = useState(mintcreds.address);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState();

    const [tooltip, setTooltip] = useState({
        show: false,
        value: {title: "...", content: "..."}
    })

    const validateRoleIndex = (role_) => {
        
       //role_ can only be between 0 and 2. role 0 = sentinel Og, role 1 = og and role 2 = whitelist
         if(role_ < 0 || role_ > 2) {
                return false;
            }else{
                setRoleIndex(role_)
                
               
            }

        
    }

    const calculatePrice = (qty_) => {
        
        let qty = quantity + parseInt(qty_)

        if(qty < 0 || quantity + qty_ > 2) {
            qty = quantity 
        }else{
            setQuantity(qty)
            qty = quantity + parseInt(qty_)
        }
      
        

        if(parseInt(roleIndex) === 0){
            setPrice(0)
        }
        else if(parseInt(roleIndex) === 1){
             setPrice(qty * 0.044)
        }else if(parseInt(roleIndex) === 2){
            setPrice(qty * 0.088)
        }

    }
   

    const moralisMint = async () => {

      //  await Moralis.enableWeb3();
            
        const options = {
            contractAddress: elvesContract,
            functionName: "whitelistMint",
            abi: elvesAbi.abi,
            params:{
                qty: quantity,
                to: toWallet,
                roleIndex: roleIndex,
                signature: signature
            }, 
            msgValue: Moralis.Units.ETH(price),
            awaitReceipt: false // should be switched to false
          };
          
          const tx = await Moralis.executeFunction(options);
          
          tx.on("transactionHash", (hash) => { 

            setTooltip({show: true, value: {
                title: "Tx Sent", 
                content: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://${etherscan}.io/tx/${hash}`}>Etherscan</a> </>)            
          }})
            
        })
          
          tx.on("receipt", (receipt) => { 
              setTxReceipt(receipt) 
             
              setTooltip({show: true, value: {
                  title: "Mint Successful", 
                  content: `Elf#${receipt.events.Transfer.returnValues.tokenId} has been minted`            
            }})
        
        })
                  
    }

    
/*    useEffect(() => {      
        
        const getMoralisTokenSupply = async ()=>{
            await Moralis.enableWeb3();
            //let tokenSupply = await getTokenSupply()      use as a failsafe
            const response = await Moralis.Cloud.run("getTokenSupply");
            console.log(response)
            setSupply({current: response.supply, total: response.maxSupply, initial: response.initialSupply})
           
        } 
        getMoralisTokenSupply()       
    }, [txReceipt]);

*/
    
    const showAlert = ({title, content}) => {

        return (
            <div className="alert">
                <h3>{title}</h3>
                <pre>{content}</pre>
                <button className="btn btn-red" onClick={()=>setTooltip({show: false})}>close</button>
            </div>
        )
    }
   

   

    return (
        <>


        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
            <p>Whitelist Mint</p>
            
          
            Role Index: 
            <div className="wl-role">
            <input type="text" value={roleIndex} onChange={(e)=>validateRoleIndex(e.target.value)}/>
            </div>
            
            <div className="wl-sig">
            Wallet Address: <br/><input type="text" value={toWallet} onChange={(e)=>setToWallet(e.target.value)}/>
            
            Signature: <br/><textarea name="Text1" cols="40" rows="5" type="text" value={signature} onChange={(e)=>setSignature(e.target.value)}/>
            </div>
            <br></br>
            Quantity to mint (max 2):
            <div className="qty-selector">
            <button className={"btn btn-red"} onClick={()=> calculatePrice(-1)} variant="primary">-</button>
            <p>{quantity}</p>
            <button className={"btn btn-green"}  onClick={()=> calculatePrice(1)} variant="primary">+</button>

            </div>
            
              <br/>
              Cost to mint: {price}
              <br/>
              <br/>
               

            <div className="d-flex flex-row justify-center">
             <button onClick={moralisMint} className="btn btn-green">
                Mint Whitelist
            </button>
            </div>
            <div className="mint-instructions">
                <p> get these values from <a href="https://ethernalelves.com/whitelist "> here </a>  </p>
           {/* <p>Elves Minted:{supply.current}/{supply.total}</p>*/}
           
            </div>

            {tooltip.show && showAlert(tooltip.value)}
        </div>        
        
        

        </>



    )
}

export default WhitelistMint

