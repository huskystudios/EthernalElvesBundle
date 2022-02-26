import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import { actionString, campaigns } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn, checkOut, checkOutRen, usedRenSignatures,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging,
    heal, lookupMultipleElves, getCurrentWalletConnected, checkRenTransfersIn} from "../../utils/interact"


const TransfersToPolygon = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis } = useMoralis();
    const [status, setStatus] = useState("")

    const [clicked, setClicked] = useState([]);


    const [nftData, setNftData] = useState([])
    const [activeNfts, setActiveNfts] = useState(true)
    const [txreceipt, setTxReceipt] = useState()
    const [alert, setAlert] = useState({show: false, value: null})

   
    const resetVariables = async () => {
        setClicked([])
        setNftData([])
        setActiveNfts(!activeNfts)

    }


    
   
    const handleClick = async (id) => {

        if (clicked.includes(id)) {
            setClicked(clicked.filter(item => item !== id))
        } else {
            if(clicked.length <= 9) {
            setClicked([...clicked, id])
            }else{
                setAlert({show: true, value: {title: "Max selected", content: ("You can only select ten items at a time")}})
            }
        }

       
    }    


    const confirmTransfers = async () => {

        
       
        setStatus("Sending gasless tx to confirm elf transfers. Don't close window or refresh.")

        let {address} = await getCurrentWalletConnected()

        let elfTransfers = []
        let renTransfers = []
     

        nftData.map((item, index) => {

            if (clicked.includes((item.id))) {

                if(item.className ===  "ElvesRenTransferOut"){

                    renTransfers.push(item.id)

                }else if(item.className ===  "ElvesEthCheckIn"){
                   
                    elfTransfers.push(item.id)                   
                }
                
            }

        })
       

      
        let params =  {objectIds:elfTransfers, owner:address, asset:"elves"}
        
        let response 
        console.log(params)
        try{
          setLoading(true)
          setStatus("1. Sending gasless tx to confirm elf transfers. Don't close window or refresh.")
          response = await Moralis.Cloud.run("confirmPendingPolygon", params);
          setTxReceipt(response)
          console.log(response)
        }catch(error){
            console.log(error)
        }

        params =  {objectIds:renTransfers, owner:address, asset:"ren"}
        
 
        
        try{
        setLoading(true)
        setStatus("2. Sending gasless tx to confirm ren transfers. Don't close window or refresh.")
        response = await Moralis.Cloud.run("confirmPendingPolygon", params);
        setTxReceipt(response)
        console.log(response)
        }catch(error){
            console.log(error)
        }
        
        setStatus("Done.")
        resetVariables();
               
        setLoading(false)


 }
       

        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)

               const Elves = Moralis.Object.extend("ElvesEthCheckIn");
               const ElvesRenTransferIn = Moralis.Object.extend("ElvesRenTransferOut");
               let results = []

                let query = new Moralis.Query(Elves);
                query.equalTo("from", address);
                query.notEqualTo("status", "completed");                
                
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
        query.notEqualTo("status", "completed");
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
        //check if signature has been used.
        setStatus("checking pending ren transfers")        
      
        results = results.concat(renResults)
        console.log(results)
        setNftData(results)        
        
        setStatus("done")                  
        setLoading(false)
        }
        
        getData()
          },[txreceipt]);


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

        
           
           
                <div className="d-flex">      
                    <div className="column">
                    
                   
            <div>
                <div>Transfers to Polygon </div>

            <div className="flex p-10">
                       
                        <button
                            /*disabled={!isButtonEnabled.unstake}*/
                            className="btn-whale"
                            onClick={confirmTransfers}
                        >
                            Confirm Transfers
                        </button>

                      

                    </div>      
                
            </div>
                
                 
                    
          
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
       
        <th>Token Id</th>
        <th>$REN</th>
        <th>Status</th>
       
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
                   
                    <td>{line.attributes.tokenId}</td>
                    <td>{line.attributes.renAmount && line.attributes.renAmount/1000000000000000000}</td>
                    <td>{line.attributes.status}</td>
                </tr>)
            }
             
               
             
            )}
       

            
                </tbody>
                </table>

             

            </div>

     
      </div>
            
      




{alert.show && showAlert(alert.value)}



        </>
        
     
    ) : <Loader text={status} />
}

export default TransfersToPolygon