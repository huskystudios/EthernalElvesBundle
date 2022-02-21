import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import "./style.css"
import { actionString, campaigns } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn, checkOut, checkOutRen, usedRenSignatures,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging,
    heal, lookupMultipleElves, getCurrentWalletConnected, polygonContract} from "../../utils/interact"


const Transfers = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis } = useMoralis();
    const [status, setStatus] = useState("")


 
    

    const [clicked, setClicked] = useState([]);

    const [nftData, setNftData] = useState([])
    const [renTransfers, setRenTransfers] = useState([])
    const [activeNfts, setActiveNfts] = useState(true)
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})
    const [campaignModal, setCampaignModal] = useState(false)
   
    const resetVariables = async () => {
        setClicked([])
        setNftData([])
        setTxReceipt([])
        setCampaignModal(false)
        setActiveNfts(!activeNfts)

    }
    
   
    const handleClick = async (id) => {

        if (clicked.includes(id)) {
            setClicked(clicked.filter(item => item !== id))
        } else {
            setClicked([...clicked, id])
        }
    }

    


    const checkOutElf = async () => {

        console.log(clicked)

        let tokenIdsArry = []
        let sentinelArry = []
        let signatureArry = []

        nftData.map((item, index) => {

            console.log(item.attributes.tokenId)

            if (clicked.includes(parseInt(item.id))) {
                tokenIdsArry.push(item.attributes.tokenId)
                sentinelArry.push(item.attributes.sentinel)
                signatureArry.push(item.attributes.signedTransaction.signature)
            }


        })
       
      
        const params =  {ids:tokenIdsArry , sentinel:sentinelArry, signature:signatureArry}
        let {success, status, txHash} = await checkOut(params)
   
        success && resetVariables()            
 
        setAlert({show: true, value: {title: "Tx Sent", content: (status)}})
                      
        }

        const checkOutRenFunction = async () => {

              
            let renAmount 
            let renSignature 
            let timestamp 
    
            nftData.map((item, index) => {
    
                if (clicked.includes(parseInt(item.id))) {
                    console.log(item)
                    renAmount = item.attributes.renAmount
                    timestamp = item.attributes.timestamp
                    renSignature = item.attributes.signedTransaction.signature
                }   
    
            })

           
           
            let sigUsed = await usedRenSignatures(renSignature)
            
            if(parseInt(sigUsed) === 1){
                console.log("is true. very naice.")
                setAlert({show: true, value: {title: "Signature used", content: ("This transaction signature has already been used")}})
                return
            }

          
            const params =  {renAmount:renAmount , signature:renSignature, timestamp:timestamp}

            console.log(params)
            let {success, status, txHash} = await checkOutRen(params)
       
            success && resetVariables()            
     
            setAlert({show: true, value: {title: "Tx Sent", content: (status)}})
                          
            }

    
     
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)
     
           //    await Moralis.enableWeb3();

               const Elves = Moralis.Object.extend("ElvesPolyCheckIn");
               const ElvesRenTransferIn = Moralis.Object.extend("ElvesRenTransferIn");
               let results = []

                let query = new Moralis.Query(Elves);
                query.equalTo("from", address);
                query.notEqualTo("status", "confirmed");
                
                let limit = 50

                //page through the results
                
                let hasMore = true
                let page = 1

		while (hasMore) {

			query.limit(limit);
			query.skip(limit * (page - 1));
			query.withCount();
			const response = await query.find();
			let currentIndex = limit * (page)
			currentIndex > response.count ? hasMore = false : hasMore = true
			page++
			setStatus(currentIndex / response.count * 100)
			
			results = results.concat(response.results)
			
		}      

        
        query = new Moralis.Query(ElvesRenTransferIn);
        query.equalTo("from", address);
       
        let renResults = []
        hasMore = true
        page = 1
    
    while (hasMore) {

        query.limit(limit);
        query.skip(limit * (page - 1));
        query.withCount();
        const renResponse = await query.find();
        let currentIndex = limit * (page)
        currentIndex > renResponse.count ? hasMore = false : hasMore = true
        page++
        setStatus(currentIndex / renResponse.count * 100)

        renResults = renResults.concat(renResponse.results)
    
    }

      // const usedSig = await usedRenSignatures(item.attributes.signedTransaction.signature)
        
      results = results.concat(renResults)
             
       // setRenTransfers(renResults)    
        setNftData(results)        
        
        setStatus("done")                  
        setLoading(false)
        }
        
        getData()
          },[]);





          const showAlert = ({title, content}) => {

            return (
                <div className="alert">
                    <h3>{title}</h3>
                    <pre>{content}</pre>
                    <button className="btn btn-red" onClick={()=>setAlert({show: false})}>close</button>
                </div>
            )
        }








    return !loading ? (
        
        <>

        
            <div className="dark-1000 h-full d-flex flex-column profile">           
           
                <div className="d-flex">      
                    <div className="column">
                  
                        <div className="flex">
                                               
                        <h2>Pending Transfers</h2>
                       
                        </div>
                    
                   
            <div>
                <div>Transfers to Eth </div>

            <div className="flex p-10">
                       
                        <button
                            /*disabled={!isButtonEnabled.unstake}*/
                            className="btn-whale"
                            onClick={checkOutElf}
                        >
                            Confirm Transfer
                        </button>

                        <button
                            /*disabled={!isButtonEnabled.unstake}*/
                            className="btn-whale"
                            onClick={checkOutRenFunction}
                        >
                            Claim Polygon Ren
                        </button>

                    </div>      
                
            </div>
                
                 
                    
    <div className="table-whale">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th>Id</th>
        <th>Transfer Initiated On</th>
        <th>
            <div className="flex">
                <span>Sentinel State</span>
                
            </div>
        </th>
        <th>Signature</th>
        <th>Token Id</th>
        <th>$REN</th>
       
        </tr>
      </thead>
      <tbody>
     

            {nftData.map((line, index) => {


                const date = new Date(line.attributes.timestamp * 1000)
                const dateString = date.toString()

                let rowSelected = clicked.includes((line.id)) ? "rowSelected" : ""

                return( <tr key={index} className={`${rowSelected} row`} onClick={()=> handleClick((line.id))}  > 
                   <td>
                     {line.id}
                    </td>
                    <td>
                        {dateString}
                    </td>
                    <td>
                     {line.attributes.sentinel && String(line.attributes.sentinel).substring(0, 10) +
                    "..." +
                    String(line.attributes.sentinel).substring(68)}
                    </td>
                    <td>
                    { String(line.attributes.signedTransaction.signature).substring(0, 15) +
                    "..." +
                    String(line.attributes.signedTransaction.signature).substring(108)}
                    </td>
                    <td>{line.attributes.tokenId}</td>
                    <td>{line.attributes.renAmount && line.attributes.renAmount/1000000000000000000}</td>
                </tr>)
            }
             
               
             
            )}
       

            
                </tbody>
                </table>

             

            </div>

     
      </div>
            
      
</div>

</div>

{alert.show && showAlert(alert.value)}



        </>
        
     
    ) : <Loader text={status} />
}

export default Transfers