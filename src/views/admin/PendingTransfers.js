import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import "./style.css"
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn, checkOut, checkOutRen, usedRenSignatures,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging, polygonContract,
    heal, lookupMultipleElves, getCurrentWalletConnected, completePolyTransfer} from "../../utils/interact"


const PendingTransfers = () => {
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

        
        

        nftData.map((item, index) => {

           

            if (clicked.includes((item.id))) {
                tokenIdsArry.push(item.attributes.tokenId)
                sentinelArry.push(item.attributes.sentinel)
                
            }


        })

        let params = {functionCall: polygonContract.methods.modifyElfDNA(tokenIdsArry, sentinelArry).encodeABI()}
        
        let response = await Moralis.Cloud.run("adminTransactor", params)
       
      
        //const params =  {ids:tokenIdsArry , sentinel:sentinelArry}
      //  let {success, status, txHash} = await completePolyTransfer(params)
   
        //success && resetVariables()            
 
        setAlert({show: true, value: {title: "Tx Sent", content: (status)}})
                      
        }

        

    
     
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)

               const Elves = Moralis.Object.extend("ElvesEthCheckIn");
               
               let results = []

                let query = new Moralis.Query(Elves);
            
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

        
          
           
                <div className="d-flex">      
                    <div className="column">
                  
                        <div className="flex">
                                               
                        <h2>Pending Transfers</h2>
                       
                        </div>
                    
                   
            <div>
                <div>Transfers to Polygon </div>

            <div className="flex p-10">
                       
                        <button
                            /*disabled={!isButtonEnabled.unstake}*/
                            className="btn-whale"
                            onClick={checkOutElf}
                        >
                            Confirm Transfer
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
      
        <th>Token Id</th>
        <th>Owner</th>
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
                    <td>{line.attributes.from}</td>
                    <td>{line.attributes.status}</td>
                   
                </tr>)
            }
             
               
             
            )}
       

            
                </tbody>
                </table>

             

            </div>

     
      </div>
            
      
</div>



{alert.show && showAlert(alert.value)}



        </>
        
     
    ) : <Loader text={status} />
}

export default PendingTransfers