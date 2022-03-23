import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Loader from "../../components/Loader";
import { useMoralisWeb3Api } from "react-moralis";




const actionString = ["unstaked", "staked", "campaign", "passive mode", "idle", "re-rolled weapon", "re-rolled item", "healing", "polygon", "synergize", "bloodthirst", "rampage"]

const GameStats = () => {

const [loading, setLoading] = useState(true);

const { Moralis } = useMoralis();
const [burnLeader, setBurnLeader] = useState(0);
const [status, setStatus] = useState("");

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}


const Web3Api = useMoralisWeb3Api();

const fetchAddress = async (add) => {
    // get ENS domain of an address
    const options = { address: add };
    const resolve = await Web3Api.resolve.resolveAddress(options);
    return resolve
  };

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  

useEffect(() => {
    async function init() {


    await Moralis.enableWeb3(); 
    setStatus("getting NFT Trades and price data")  
   
    const burnLb = await Moralis.Cloud.run("burnLeaderboard")  
    let results = []
    
    results = results.concat(burnLb.ethBurn).concat(burnLb.polyBurn)

  
        let tempArray = []
        results.forEach(function(item) {
            tempArray.push(item.objectId)
        })
        let uniqueArray = uniq(tempArray)

        //for each item in results, add amount to a new field when uniqueArray includes objectId
        let newResults = []
        uniqueArray.forEach(function(item) {
            let temp = results.filter(function(obj) {
                return obj.objectId === item
            })
            let total = 0
            temp.forEach(function(item) {
                total += parseInt(item.amount)/1000000000000000000
            })
            temp[0].total = total
            newResults.push(temp[0])
        })

        //sort newResults by total largest to smallest
        newResults.sort(function(a, b) {
            return b.total - a.total;
        }
        )
        

        

        //for each item in newresults, fetchaddress and add to object

//        fetchAddress

/*
        let newResults2 = []
        newResults.forEach(function(item) {
            let temp = item
            fetchAddress(item.objectId).then((res) => {
                temp.address = res
                newResults2.push(temp)
            },(err) => {
                console.log(err)
                newResults2.push(temp)
            })
            sleep(1000)
        })     

        newResults2.sort(function(a, b) {
            return b.total - a.total;
        });

*/

      

    
    
        setBurnLeader(newResults)
      
     
    
    setLoading(false);


    }


    init();
}, [])






return !loading ? (
    <>


<div className="d-flex">
                
        <div className="d-flex flex-column">
        <h3>REN Burners</h3>
       
    {burnLeader.map((item, index) => (
        
        <div className="d-flex flex-column" key={index}>
        <div className="d-flex justify-left">
           <span className="p-1">{index + 1}. </span>
           <span className="p-1">{item.objectId}</span>
           <span className="p-1">{item.total.toLocaleString()}</span>
       
        </div>
        </div>
    ))}



        

</div>
</div>




</>


  ) : <Loader text={status} />
};

export default GameStats;






