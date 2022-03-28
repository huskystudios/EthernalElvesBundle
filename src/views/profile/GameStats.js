import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Loader from "../../components/Loader";
import { useMoralisWeb3Api } from "react-moralis";
import { lookupMultipleElves } from "../../utils/interact";




const actionString = ["unstaked", "staked", "campaign", "passive mode", "idle", "re-rolled weapon", "re-rolled item", "healing", "polygon", "synergize", "bloodthirst", "rampage"]

const GameStats = () => {

const [loading, setLoading] = useState(true);

const { Moralis } = useMoralis();
const [burnLeader, setBurnLeader] = useState(0);
const [status, setStatus] = useState("");
const [btlb, setBtlb] = useState([]);

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

  const burnLeaders = async () => {
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
        console.log(newResults,)
    
        setBurnLeader(newResults)
  };


  const bloodthirstLeaderboard = async () => {
    const btleaderboard = await Moralis.Cloud.run("bloodthirstLeaderboard")  

    //find all unique objectIds and put in an array
    let tempArray = []
    btleaderboard.forEach(function(item) {
        tempArray.push(parseInt(item.objectId))
    }
    )

    console.log(btleaderboard)

    let params = { array: tempArray, chain: "polygon" }
    let elfMeta = await lookupMultipleElves(params)
    
    //for each item in elfMeta, add tokens from btleaderboard to a new field
    let newResults = []
    elfMeta.forEach(function(item) {
        let temp = btleaderboard.filter(function(obj) {
            return obj.objectId === item.id.toString()
        }
        )
       
        item.tokens = temp[0].tokens
        newResults.push(item)
    }
    )
    
    setBtlb(newResults)

  };
  

useEffect(() => {
    async function init() {


    await Moralis.enableWeb3(); 
    setStatus("getting data")  

    await burnLeaders()
    await bloodthirstLeaderboard()    
      
     
    
    setLoading(false);


    }


    init();
}, [])






return !loading ? (
    <>


<div className="d-flex flex-wrap">
                
        <div className="d-flex flex-column p-1">
        <h3>REN Burners</h3>
        <table>
        <thead>
        <tr>
        <th>Rank</th>
        <th>Address</th>
        <th>$REN</th>
        </tr>
        </thead>
        <tbody>

        
       
    {burnLeader.map((item, index) => (
        
        <tr key={item.objectId}>
        <td>{index+1}</td>
        <td>{item.objectId}</td>
        <td>{item.total.toLocaleString()}</td>
        </tr>
    
    ))}

        </tbody>
        </table>
 

</div>

        <div className="d-flex flex-column p-1">
                <h3>Instant Kill Leaderboard</h3>
                <div style={{maxWidth: `800px`}} className="d-flex flex-wrap p-1">
                        {btlb.map((item, index) => (
                                <div className="w-25 d-flex flex-column p-2" key={item.id}>
                                     <span>{index + 1}. Elf#{item.id}</span>  
                                      <img src={item.image} alt={item.name} />
                                      <span>Career Instant Kills: {item.tokens}</span>  
                                      {/*<span>Owner: {item.owner}</span>*/}
                                      </div>
                        ))}
                 </div>
        </div>

</div>




</>


  ) : <Loader text={status} />
};

export default GameStats;






