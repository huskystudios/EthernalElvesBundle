import {web3, getCurrentWalletConnected, nftContract} from "./utils/interact"


const Sign = () => {


const login = async () => {
  const {address} = await getCurrentWalletConnected()
  console.log(address)
  const tx = {
    // this could be provider.addresses[0] if it exists
    from: "0xc5ec89d7886044a330abec9c002259674f6de42a", 
    // target address, this could be a smart contract address
    to: "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75", 
    data: nftContract.methods.approve("0xA571C095f241e4E24a8e09b95E1b667a8eDa70c2", 4181).encodeABI() 

    
  };

  const signPromise = web3.eth.signTransaction(tx, "0xc5ec89d7886044a330abec9c002259674f6de42a");

  console.log(signPromise)

}

    return(<>    
    <button onClick={login}>Login</button>
    </>)
}

export default Sign;
