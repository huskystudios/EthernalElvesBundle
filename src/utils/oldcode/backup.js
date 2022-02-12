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
      
   /* if(getTokenSupply() > 3000){
      hexString = "0x0"
    }
    */
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

  /////////////

   //  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction();
  
   const options = {
    contractAddress: elvesContract,
    functionName: "mint",
    abi: elvesAbi.abi   ,
    msgValue: parseInt(supply) <= parseInt(init) ?  Moralis.Units.ETH(Moralis.Units.FromWei(currentPrice)) : null,
    awaitReceipt: false // should be switched to false
};
 


function readOptions(contractMethod) {

  const options = {
  contractAddress: elvesContract,
  functionName: contractMethod,
  abi: elvesAbi.abi

};

  return options
}
