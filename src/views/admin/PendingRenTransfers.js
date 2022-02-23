import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import "./style.css"
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn, checkOut, checkOutRen, usedRenSignatures,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging,
    heal, lookupMultipleElves, getCurrentWalletConnected, completePolyRenTransfer, polyweb3} from "../../utils/interact"


const PendingRenTransfers = () => {
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

     
         
        let addresses = []
        let balances = []
        

        nftData.map((item, index) => {

           

            if (clicked.includes((item.id))) {
                addresses.push(item.attributes.from)
                balances.push(item.attributes.renAmount)
                
            }


        })
       
      
        const params =  {_owners:addresses , _amounts:balances}
        let {success, status, txHash} = await completePolyRenTransfer(params)
   
        success && resetVariables()            
 
        setAlert({show: true, value: {title: "Tx Sent", content: (status)}})
                      
        }

        

    
     
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)

               const Elves = Moralis.Object.extend("ElvesRenTransferOut");
               
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
                  
                        
                    
                   
            <div>
                <div>REN to Polygon </div>

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
                <span>Ren Amount</span>
                
            </div>
        </th>
      
        <th>Token Id</th>
      
       
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
                     {line.attributes.renAmount/1000000000000000000}
                    </td>
                    <td>{line.attributes.tokenId}</td>
                   
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

export default PendingRenTransfers