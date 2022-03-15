import React from "react"
import { useState, useEffect } from "react"
import { withdrawTokenBalance, getCurrentWalletConnected, withdrawSomeTokenBalance, balanceOf, checkOutRen, polygonContract, polyweb3 } from "../utils/interact"
import { useMoralis, useChain } from "react-moralis"
import Modal from "../components/Modal"
import Loader from "../components/Loader"

const Withdraw = () => {

  const { Moralis } = useMoralis();

  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState(0);
  const [polyBalance, setPolyBalance] = useState(0);
  const [polyBalanceToClaim, setPolyBalanceToClaim] = useState(0);
  const [balanceToClaim, setBalanceToClaim] = useState(0);
  const [miren, setMiren] = useState(0);
  const [modal, setModal] = useState(false);
  const [RenTransfersIn, setRenTransfersIn] = useState(0);
  const [loading, setLoading] = useState(true);



  const getRenBalance = async (address) => {

    let allbalances = await balanceOf(address);

    Moralis.Cloud.run("updateUser", { ownerBalances: allbalances, ownerAddress: address })

    console.log("Account balances:", allbalances)


    setBalance(allbalances.contractRen / 1000000000000000000);
    setMiren(allbalances.miren / 1000000000000000000);
    setPolyBalance(allbalances.polyMiren / 1000000000000000000);

  }

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const claimCustomAmount = async () => {

    const params = { amount: Moralis.Units.ETH(balanceToClaim) }
    await withdrawSomeTokenBalance(params)

  }

  const claimCustomAmountPolygon = async () => {

    console.log(polyBalanceToClaim)
    setLoading(true)
    setStatus("Claiming Polygon Ren...")
    const owner = await getCurrentWalletConnected()

    const params = { functionCall: polygonContract.methods.checkIn([], Moralis.Units.ETH(polyBalanceToClaim), owner.address).encodeABI() }

    let tx

    try {
      tx = await Moralis.Cloud.run("defenderRelay", params)

      console.log(tx)
      if (tx.data.status) {

        let fixString = tx.data.result.replaceAll("\"", "")

        let txHashLink = `https://polygonscan.com/tx/${fixString}`

        let successMessage = <>Check out your transaction on <a target="_blank" href={txHashLink}>Polyscan</a>. Confirming tx.</>
        setStatus(successMessage)
        console.log("Submitted transaction with hash: ", txHashLink)
        let transactionReceipt = null
        while (transactionReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
          transactionReceipt = await polyweb3.eth.getTransactionReceipt(fixString);
          await sleep(1000)
        }

        console.log("Got the transaction receipt: ", transactionReceipt)


        setStatus(successMessage)
        await getRenBalance(owner.address)
        setPolyBalanceToClaim(0)
        setModal(!modal)
      }


    } catch (e) {
      console.log(e)
    }
    setLoading(false)

  }




  const getTxs = async (address) => {


    const ClaimRen = Moralis.Object.extend("ClaimRen");

    const query = new Moralis.Query(ClaimRen);
    query.equalTo("from", address);
    query.notEqualTo("status", "completed");
    const renResponse = await query.first();
    setRenTransfersIn(renResponse)
    console.log("pending claim from polygon:", renResponse ? renResponse : 0)
  }




  useEffect(() => {
    const init = async () => {
      const { address, status } = await getCurrentWalletConnected();
      address && await getRenBalance(address)
      address && await getTxs(address)
      setLoading(false)

    }

    init();

  }, [modal])

  const claimPolyRen = async () => {

    console.log("click")

    if (RenTransfersIn.attributes.status === "pending") {

      console.log("click")
      const params = { renAmount: RenTransfersIn.attributes.renAmount, signature: RenTransfersIn.attributes.signature, timestamp: RenTransfersIn.attributes.timestamp }
      console.log(params)

      let { success, status, txHash } = await checkOutRen(params)

      if (success) {
        RenTransfersIn.set("status", "initiated")
        RenTransfersIn.save()
        console.log("success")
        setModal(!modal)
      }

    }
  }

  return (
    <>
      <div className="search">
        <button onClick={() => setModal(!modal)}>REN</button>
      </div>
      <span onClick={() => setModal(!modal)}>$REN</span>
      <Modal show={modal}>
        {!loading ?
          <>

            <h1>REN Balances</h1>

            <div>
              <p>REN in wallet: {miren.toFixed()} </p>
            </div>

            <div>
              <p>{status}</p>
            </div>

            <div className="withdraw-body flex-wrap">



              <div className="columns">
                <h2>POLYGON REN CREDITS</h2>
                {!RenTransfersIn && <div>
                  <p>REN credits: {polyBalance.toFixed()} {polyBalanceToClaim > 0 && `- ${polyBalanceToClaim}`}</p>
                </div>}
                <div>
                  {RenTransfersIn ?
                    <button
                      className="btn btn-grey"
                      onClick={claimPolyRen}
                    >
                      Claim {RenTransfersIn.attributes.renAmount / 1000000000000000000} REN
                    </button> : <>
                      <input
                        type="range"
                        min="0"
                        max={polyBalance}
                        value={polyBalanceToClaim}
                        onChange={(e) => setPolyBalanceToClaim(e.target.value)}
                        step="1"
                      />
                      <div className="flex justify-center">
                        <button
                          className="btn btn-grey"
                          onClick={claimCustomAmountPolygon}
                          disabled={polyBalanceToClaim <= 0}
                        >
                          Initiate Claim {polyBalanceToClaim} REN
                        </button>
                      </div>
                    </>}
                </div>

              </div>
              <div className="columns">
                <h2>ETH REN CREDITS</h2>
                <div><p>REN credits: {balance} {balanceToClaim > 0 && `- ${balanceToClaim}`}</p></div>
                <div><input
                  type="range"
                  min="0"
                  max={balance}
                  value={balanceToClaim}
                  onChange={(e) => setBalanceToClaim(e.target.value)}
                  step="1"
                />

                  <div className="flex justify-center">
                    <button
                      className="btn btn-grey"
                      onClick={claimCustomAmount}
                      disabled={balanceToClaim <= 0}
                    >
                      Claim {balanceToClaim} REN
                    </button>
                  </div>
                </div>
              </div>



            </div>

          </> : <Loader text={status} />}
      </Modal>
    </>

  )
}

export default Withdraw