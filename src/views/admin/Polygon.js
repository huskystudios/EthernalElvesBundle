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


const Polygon = () => {

    const { Moralis } = useMoralis();
    const [tokenId, setTokenId] = useState("3425");
    const [toWallet, setToWallet] = useState("0xccb6d1e4acec2373077cb4a6151b1506f873a1a5");
    const [sentinelDna, setSentinelDna] = useState("95341082926228088239820618868375290496732117363074625620720558998639925764517");
    const [signature, setSignature] = useState();

    const checkOutTest = [{
        id: "3359",
        sentinel: "4881853681344519090722670739191765502094310931864048783374205880110158153189",
        wallet: "0xe7AF77629e7ECEd41C7B7490Ca9C4788F7c385E5",
        signature: "0x2c96e03b46e2029a9625a4c34cb9f317f1be9c7cc09463123d64895761a9fac41da8816138780c96f124ebf8dcd99ab84d3973af0d46aabe6ff2535b5c2982821b"
    },
    {
        id: "3718",
        sentinel: "9230105826293437673428251787841135842610088030983928353753840605190900909541",
        wallet: "0xe7AF77629e7ECEd41C7B7490Ca9C4788F7c385E5",
        signature: "0x9782c562834f5fb45ccacda1bb09bc7c4334f1bfe48e73f08f483e10b242c721639509590374dc0452d8183db405d9a0396d285535913f223bef819582a47e681c"
    },
    {
        id: "3717",
        sentinel: "98053041359199921595859626172605281766877482556610129516202485478004279707109",
        wallet: "0xe7AF77629e7ECEd41C7B7490Ca9C4788F7c385E5",
        signature: "0x55ef79fa2059c2301d312059b35aef4efd4c1fb7a23877d3deddcbf561126c7d1a9f1bfb9dd6df52eb53d976b0015476b1d6a89381953ac31232529f4e6859fe1b"
    }   
]




    const getSignature = async () => {

    const params =  {wallet: toWallet, tokenId: tokenId, sentinel: sentinelDna}
    let response = await Moralis.Cloud.run("signForEthReturn", params)

    console.log(await Moralis.Cloud.run("signMessageForTransfer", params))
    
}

const remoteTx = async () => {
    
    let response = await Moralis.Cloud.run("remoteTx")
    console.log(response)

    
}

const checkinMany = async () => {
    console.log("Click registered")
    let signatureArr = []

    checkOutTest.map(async (item,index)=>{

        console.log(index)

        const params =  {wallet: item.wallet, tokenId: item.id, sentinel: item.sentinel}
        let response = await Moralis.Cloud.run("signForEthReturn", params)
        console.log(response)
        signatureArr.push(response.signedTx.signature)
       

    })
   
console.log(signatureArr)
   
    
}




  //


    

   

   

    return (
        <>


        
        <div className="d-flex flex-column text-white justify-center px-4 text-uppercase wl-dialog">
            <p>Generate Player Mint Signature</p>
            
          
            TokenId
            <div className="wl-role">
            <input type="text" value={tokenId} onChange={(e)=>setTokenId(e.target.value)}/>
            </div>
            
            <div className="wl-sig">
            Wallet Address: <br/><input type="text" value={toWallet} onChange={(e)=>setToWallet(e.target.value)}/>
            </div>
                <br/>
            <div className="d-flex flex-row justify-center">
             <button onClick={getSignature} className="btn btn-green">
                Generate Signature
            </button>
            
            <button onClick={remoteTx} className="btn btn-red">
            remoteTx
            </button>

            <button onClick={checkinMany} className="btn btn-blue">
            checkinMany
            </button>


            
            

            
            </div>
            <br/>
            <textarea name="Text1" cols="40" rows="5" type="text" value={signature.signature} />
         
            
         
         

        </div>        
        
        

        </>



    )
}

export default Polygon

