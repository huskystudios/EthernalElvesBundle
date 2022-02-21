import React, { useEffect, useState, useMemo } from "react"
import Loader from "../../components/Loader"
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import "./style.css"
import { actionString, campaigns } from "../home/config"
import Countdown from 'react-countdown';
import {elvesAbi, getCampaign, elvesContract, etherscan,
    checkIn, checkOut,
    sendCampaign, sendPassive, returnPassive, unStake, merchant, forging,
    heal, lookupMultipleElves, getCurrentWalletConnected, polygonContract} from "../../utils/interact"
import Mint from "../mint"


const Transfers = () => {
    const [loading, setLoading] = useState(true)
    const { Moralis } = useMoralis();
    const [status, setStatus] = useState("")


 
    

    const [clicked, setClicked] = useState([]);

    const [nftData, setNftData] = useState([])
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
    
   // const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();


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

            if (clicked.includes(parseInt(item.attributes.tokenId))) {
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

    
     
        useEffect(() => {
            const getData = async () => {
                const {address} = await getCurrentWalletConnected();
                setStatus("connected to address: " + address)
     
           //    await Moralis.enableWeb3();

               const Elves = Moralis.Object.extend("ElvesPolyCheckIn");
                let query = new Moralis.Query(Elves);
                query.equalTo("from", address);
                query.notEqualTo("status", "confirmed");
                
                let limit = 50

                //page through the results
                let results = []
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
                setStatus(results.length + " elves")
                setStatus("done")
                          
               setLoading(false)
            }
            
            getData()
          },[activeNfts, txreceipt]);


  


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
                    </div>      
                
            </div>
                
                 
                    
    <div className="table-whale">          
      <table style={{width: '100%'}}>
      <thead style={{textAlign: "left"}}>
        <tr>
        <th></th>
        <th>
            <div className="flex">
                <span>Name</span>
                
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Location</span>
                
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Inventory</span>
               
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Weapon Name</span>
                
            </div>
        </th>
        <th>
            <div className="flex">
                <span>HP+</span>
                
            </div>
        </th>
        <th>
            <div className="flex">
                <span>AP+</span>
               
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Level</span>
                
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Class</span>
               
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Action Taken</span>
               
            </div>
        </th>
        <th>
            <div className="flex">
                <span>Cooldown (-) /<br />Passive (+)</span>
                
            </div>
        </th>
        </tr>
      </thead>
      <tbody>
     

            {nftData.map((line, index) => {


                const date = new Date(line.time * 1000)
               
                let passiveString = ""
                
               
                
                    let rowSelected = clicked.includes(parseInt(line.attributes.tokenId)) ? "rowSelected" : ""

                                       


                return( <tr key={index} className={`${rowSelected} row`} onClick={()=> handleClick(parseInt(line.attributes.tokenId))}  > 
                   <td>
                     {line.attributes.tokenId}
                    </td>
                    <td>
                     {line.attributes.sentinel}
                    </td>
                    <td>
                     {line.attributes.signedTransaction.signature}
                    </td>
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