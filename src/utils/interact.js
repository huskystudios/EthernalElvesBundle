import { items, sentinelClass } from '../views/home/config';

require('dotenv').config();
const Web3 = require("web3")
const alchemy = process.env.REACT_APP_ALCHEMY_KEY;
const etherscanKey = process.env.REACT_APP_ETHERSCAN_KEY;
const {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} = require("ethereum-multicall");

export const etherscan = "etherscan" //"goerli.etherscan"

export const elvesContract = "0x13BdEE5Dfe487A055f3fa523feCdcF8ecDd3B889"
const mirenContract = "0xFfCB4a8e3616B07f8d01546c0Bb376aF9d6B8b02"
const campaignsContract = "0x6e8AAD4EbeBc5A61432c98DA05eBb62c621Df549"

export const elvesAbi = require('./ABI/elves.json')
const mirenAbi = require('./ABI/miren.json') 
const campaignAbi = require('./ABI/campaigns.json')
var api = require('etherscan-api').init(etherscanKey);

const web3 = new Web3(new Web3.providers.HttpProvider(alchemy))

const nftContract = new web3.eth.Contract(elvesAbi.abi, elvesContract);
const ercContract = new web3.eth.Contract(mirenAbi.abi, mirenContract);
const gameContract = new web3.eth.Contract(campaignAbi.abi, campaignsContract);


export const txReceipt = async ({ txHash, interval }) => {
  module.exports = function getTransactionReceiptMined(txHash, interval) {
    const self = this;
    const transactionReceiptAsync = function (resolve, reject) {
      self.getTransactionReceipt(txHash, (error, receipt) => {
        if (error) {
          reject(error);
        } else if (receipt == null) {
          setTimeout(
            () => transactionReceiptAsync(resolve, reject),
            interval ? interval : 500
          );
        } else {
          resolve(receipt);
        }
      });
    };

    if (Array.isArray(txHash)) {
      return Promise.all(
        txHash.map((oneTxHash) =>
          self.getTransactionReceiptMined(oneTxHash, interval)
        )
      );
    } else if (typeof txHash === 'string') {
      return new Promise(transactionReceiptAsync);
    } else {
      throw new Error('Invalid Type: ' + txHash);
    }
  };
};



export const updateMoralisDb = async ({elf, elves}) => {

  elves.set("owner_of", elf.owner.toLowerCase())
  elves.set("action", elf.action)
  elves.set("level", parseInt(elf.level))
  elves.set("time", elf.time)
  
  elves.save()
  .then((elf) => {
    // Execute any logic that should take place after the object is saved.
    console.log('Object updated with objectId: ' + elf.id );
  }, (error) => {
    // Execute any logic that should take place if the save fails.
    // error is a Moralis.Error with an error code and message.
    console.log('Failed to create new object, with error code: ' + error.message);
  });
  
}


export const lookupMultipleElves = async (array)=>{

  let txArr = []

  if(array){
  array.map((i, index)=>{
    var tx = {
      reference: 'Elves'+i.toString(),
      contractAddress: elvesContract,
      abi: elvesAbi.abi,
      calls: [
      { reference: 'elves'+i.toString(), methodName: 'elves', methodParameters: [i]},
      { reference: 'attributes'+i.toString(), methodName: 'attributes', methodParameters: [i]},
      { reference: 'ownerOfCall'+i.toString(), methodName: 'ownerOf', methodParameters: [i]},
      { reference: 'tokenURI'+i.toString(), methodName: 'tokenURI', methodParameters: [i]}
      
     ]
    };
    txArr.push(tx);
  return (index)
  })
}

  const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
  const contractCallContext: ContractCallContext[] = txArr
  const results: ContractCallResults = await multicall.call(contractCallContext);

let elfObj 
let elfArry = []

array.forEach(i => {
  
  const elfAddress = results.results[`Elves${i}`].callsReturnContext[0].returnValues[0]
  const elfTimestamp =  parseInt(results.results[`Elves${i}`].callsReturnContext[0].returnValues[1].hex, 16)
  const elfAction = parseInt(results.results[`Elves${i}`].callsReturnContext[0].returnValues[2].hex, 16)
  const elfHealthPoints = parseInt(results.results[`Elves${i}`].callsReturnContext[0].returnValues[3].hex, 16)
  const elfAttackPoints = parseInt(results.results[`Elves${i}`].callsReturnContext[0].returnValues[4].hex, 16)
  const elfPrimaryWeapon = parseInt(results.results[`Elves${i}`].callsReturnContext[0].returnValues[5].hex, 16)
  const elfLevel = parseInt(results.results[`Elves${i}`].callsReturnContext[0].returnValues[6].hex, 16)
  const elfOwnerOfAddress = results.results[`Elves${i}`].callsReturnContext[2].returnValues[0] //GOOD

  const elfHair          = parseInt(results.results[`Elves${i}`].callsReturnContext[1].returnValues[0].hex, 16)    
  const elfRace          = parseInt(results.results[`Elves${i}`].callsReturnContext[1].returnValues[1].hex, 16)      
  const elfAccessories   = parseInt(results.results[`Elves${i}`].callsReturnContext[1].returnValues[2].hex, 16)     
  const elfSentinelClass = parseInt(results.results[`Elves${i}`].callsReturnContext[1].returnValues[3].hex, 16)     
  const elfWeaponTier    = parseInt(results.results[`Elves${i}`].callsReturnContext[1].returnValues[4].hex, 16)     
  const elfInventory     = parseInt(results.results[`Elves${i}`].callsReturnContext[1].returnValues[5].hex, 16)    
  
  let elfTokenData = results.results[`Elves${i}`].callsReturnContext[3].returnValues[0]
  let elfOwner = elfAddress
  let elfStatus = "staked"
  
  var b 
  var elfTokenObj
  try {
    b = elfTokenData.split(",")
    elfTokenObj = JSON.parse(atob(b[1]))

  } catch (error) {
    elfTokenObj = {image: null, name: null, body: null, helm: null, mainhand: null, offhand: null, attributes: null}
  }
 
  
if(elfAddress === "0x0000000000000000000000000000000000000000" || parseInt(elfAction) === 0 ){
  elfOwner = elfOwnerOfAddress
  elfStatus = "unstaked"
}

//compare elfTimestamp to current time to see if current time is greater, then varialbe is true
let elfTime = false
if(elfTimestamp > Math.floor(Date.now()/1000)){
  elfTime = true
}


let elfActionString
//swtiches for the elf action
switch(parseInt(elfAction)){
  case 0:
    elfActionString = "Idle"
    break;
  case 1:
    elfActionString = "Staked, but Idle"
    break;
  case 2:
    elfActionString = elfTime ? "On Campaign" : "Campaign Ended"
    break;
  case 3:
    elfActionString = "Sent to Passive Campaign" 
    break;
  case 4:
    elfActionString = "Returned from Passive Campaign"
    break;
  case 5:
    elfActionString = "Re-Rolled Weapon"
    break;
  case 6:
    elfActionString = "Re-Rolled Items"
    break;
  case 7:
    elfActionString = elfTime ? "Healing" : "Done Healing"
    break;
  default:
    elfActionString = "Unknown"

    
}

elfObj = {
    owner: elfOwner.toLowerCase(),
    elfStatus: elfStatus,
    id: i,
    time: elfTimestamp,  
    action: elfAction,
    actionString: elfActionString,
    level: elfLevel, 
    image: elfTokenObj.image,
    name: elfTokenObj.name ? elfTokenObj.name : `Elf #${i}`,
    sentinelClass: elfSentinelClass,
    classString: sentinelClass[elfSentinelClass],
    race: elfRace,
    hair: elfHair,
    inventory: [elfInventory],
    inventoryString: items[elfInventory].text,
    inventoryDescription: items[elfInventory].description,
    primaryWeapon: elfPrimaryWeapon,
    weaponTier: elfWeaponTier,
    attack: elfAttackPoints, 
    accessories: elfAccessories,
    health: elfHealthPoints,
    attributes: elfTokenObj.attributes
  }

elfArry.push(elfObj)
})

return elfArry

}

export async function getContractEvents(){

  const init = {method: 'GET', headers: { }}

  let osRequest 
  let osResponse = null


  try{
  osRequest = await fetch(`https://api.opensea.io/api/v1/events?asset_contract_address=0x3abedba3052845ce3f57818032bfa747cded3fca&only_opensea=false&offset=0&limit=20
  `, init);
  osResponse = await osRequest.json()
 
  }catch(e){console.log(e)}

  return(osResponse)

}


const txPayload = async(txData) => {
const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); //get latest nonce
  //the transaction
  const tx = {
    'from': window.ethereum.selectedAddress,
    'to': elvesContract,
    'nonce': nonce.toString(),
    'data': txData
  };

return(tx)

}

export const doAction = async(ids, action) => {

   const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); //get latest nonce

  let reRollPrice = .001 * 10**18
  let hexString = reRollPrice.toString(16);
    
  if(action !== 5 && action !== 6){
    hexString = "0x0"
  }
  //the transaction
  const tx = {
    'from': window.ethereum.selectedAddress,
    'to': elvesContract,
    'nonce': nonce.toString(),
    'data': nftContract.methods.doAction(ids, action).encodeABI(),
    'value': hexString
  };


  //sign the transaction via Metamask
try {
  const txHash = await window.ethereum
      .request({
          method: 'eth_sendTransaction',
          params: [tx],
      })
      
  
      
  return {
      success: true,
      status: (<>✅ Check out your transaction on <a target="_blank" rel='noreferrer' href={`https://etherscan.io/tx/${txHash}`}>Etherscan</a> </>),
      txHash: txHash
      

  }
} catch (error) {
  return {
      success: false,
      status: "😥 Something went wrong: " + error.message + " Try reloading the page..."
  }

}

}


export const mint = async() => {
  
  const nonce = await web3.eth.getTransactionCount(window.ethereum.selectedAddress, 'latest'); //get latest nonce
  let mintPrice = .069 * 10**18
  let hexString = mintPrice.toString(16);
    
  if(getTokenSupply() > 3000){
    hexString = "0x0"
  }
  //the transaction
  const tx = {
    'from': window.ethereum.selectedAddress,
    'to': elvesContract,
    'nonce': nonce.toString(),
    'data': nftContract.methods.mint().encodeABI(),
    'value': hexString
  };

 
  //sign the transaction via Metamask
try {
  const txHash = await window.ethereum
      .request({
          method: 'eth_sendTransaction',
          params: [tx],
      })
       
      
  return {
      success: true,
      status: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${txHash}`}>Etherscan</a> </>),
      txHash: txHash      

  }
} catch (error) {
  return {
      success: false,
      status: "😥 Something went wrong: " + error.message + " Try reloading the page..."
  }

}

}


export const getCampaigns = async(ids) => {
  
  let campaignArry = []

  for(let i = 0; i < ids.length; i++){
      
    let response = await gameContract.methods.camps(ids[i]).call()
    
    let campaignObj = {
        
        id: ids[i],
        baseRewads: response[0], 
        creatureCount: response[1], 
        creatureHealth: response[2], 
        expPoints: response[3], 
        items: response[4],
        minLevel: response[5],
        weapons: response[6],
      }
      campaignArry.push(campaignObj)
    }
  
  return campaignArry

}

export const getCampaign = async(id) => {
      
    let response = await gameContract.methods.camps(id).call()
    
    let campaignObj = {
        
        id: id,
        baseRewads: response[0], 
        creatureCount: response[1], 
        creatureHealth: response[2], 
        expPoints: response[3], 
        minLevel: response[4],
        items: response[5],
        weapons: response[6],
      }

  
  return campaignObj

}


  
export const withdrawTokenBalance = async() => {
  
let txData = nftContract.methods.withdrawTokenBalance().encodeABI()
let tx = await txPayload(txData)
 
 
  //sign the transaction via Metamask
try {
  const txHash = await window.ethereum
      .request({
          method: 'eth_sendTransaction',
          params: [tx],
      })
        
      
  return {
      success: true,
      status: (<>✅ Check out your transaction on <a target="_blank" rel="noreferrer" href={`https://etherscan.io/tx/${txHash}`}>Etherscan</a> </>),
      txHash: txHash
      

  }
} catch (error) {
  return {
      success: false,
      status: "😥 Something went wrong: " + error.message + " Try reloading the page..."
  }

}

}


///////////OLD

export function getContract(){
    
    return {nftContract, ercContract, web3}
  }

export async function getContractPrice(){
  const res = await nftContract.methods.getElf().call();  
  return web3.utils.fromWei(res)
}


export async function getElf(id){
  const res = await nftContract.methods.elves(id).call();  
  return res
}


export const tokensByOwner = async (address) => {
var supply = nftContract.methods.tokensByOwner(address).call();
return(supply)
}

export const ownerOf = async (token) => {
  var address = nftContract.methods.ownerOf(token).call();
  return(address)
  }

export const getTokenSupply = async () => {
  var supply = nftContract.methods.totalSupply().call();
  return(supply)
  }

  export const balanceOf = async (address) => {
    var miren = await ercContract.methods.balanceOf(address).call();
   
    let balances = {miren: miren}
    return(balances)
    }
  



export const getEthPrice = async () => {
  var price = api.stats.ethprice();
  return(price)
}

export const getGasPrice = async () => {
  const gasApi = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${etherscanKey}`, {method: "GET"})
  const response = await gasApi.json()

  return(response)
}



export const getTxReceipt = async (txHash) => {
  var ret = api.proxy.eth_getTransactionReceipt(txHash); 
  return(ret)
}

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "Wallet connected...",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.app.link/dapp/app.ethernalelves.com/`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a rel="noreferrer" target="_blank" href={`https://metamask.app.link/dapp/app.ethernalelves.com/`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };
  

