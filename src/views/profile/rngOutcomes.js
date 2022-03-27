import React from 'react';
import { useEffect, useMemo, useState } from "react";
import {elvesAbi, elvesContract, lookupMultipleElves, nftContract, polygonContract, lookupMultipleOrcs, orcsCastle } from "../../utils/interact"
import { useMoralis } from "react-moralis";




const RNGOutcome = ({text, size}) => {

	const { Moralis, authenticate, isAuthenticated, user} = useMoralis();
    const [rollsData, setRollsData] = useState([])
    const [rollsPercent, setRollsPercent] = useState([])
    const [loading, setLoading] = useState(true)   


	const getData = async () => {
		
		let results = await Moralis.Cloud.run("rollOutcome")

        //convert each objectId in results to integers
        results.forEach(result => {
            result.rolledIndex = parseInt(result.objectId)        
        }
        )

        results.sort((a, b) => {
            return a.rolledIndex - b.rolledIndex
        }
        )

        let setOne = 0 //0-20
        let setTwo = 0 //21-40
        let setThree = 0 //41-60
        let setFour = 0 //61-80
        let setFive = 0 //81-100
        let totalCount = 0

        results.forEach(result => {
            totalCount = totalCount + result.rolls
           if(result.rolledIndex < 20 ) {
                setOne = setOne + result.rolls
           }
              else if(result.rolledIndex < 40) {
                setTwo = setTwo + result.rolls
              }
                else if(result.rolledIndex < 60) {
                setThree = setThree + result.rolls
                }
                    else if(result.rolledIndex < 80) {
                setFour = setFour + result.rolls
                    }
                        else if(result.rolledIndex < 100) {
                setFive = setFive + result.rolls
                        }
        }
        )

        const data = {one: setOne, two:setTwo, three:setThree, four:setFour, five:setFive, count:totalCount}
        const dataperc = {one: (setOne/totalCount*100).toFixed(2), two:(setTwo/totalCount*100).toFixed(2), three:(setThree/totalCount*100).toFixed(2), four:(setFour/totalCount*100).toFixed(2), five:(setFive/totalCount*100).toFixed(2)}
        setRollsData(data)
        setRollsPercent(dataperc)
       
		
        
				setLoading(false)
				

				}

                useEffect(() => {
                    getData()
                }, [])



    
    return !loading && (
    
        <>

      
{/*

	<button className="btn btn-blue" onClick={getElfMetaData}>UpdateDB</button>
	<button className="btn btn-blue"  onClick={getOrcMetaData}>Update Orc Owner Data</button>
*/}
	

    {rollsData && <div>
        <h3>Random Number Analysis</h3>
        <p>Total Random Numbers Generated: {rollsData.count}</p>

        <table style={{width: "600px"}} className='table'>
            <thead>
                <tr>
                    <th>
                        <div className="d-flex">Range</div>
                    </th>
                    <th>
                    <div className="d-flex">Rolls</div>
                        </th>
                    <th>
                    <div className="d-flex">Percentage</div>
                        </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>0-20</td>
                    <td>{rollsData.one}</td>
                    <td>{rollsPercent.one}%</td>
                </tr>
                <tr>
                    <td>21-40</td>
                    <td>{rollsData.two}</td>
                    <td>{rollsPercent.two}%</td>
                </tr>
                <tr>
                    <td>41-60</td>
                    <td>{rollsData.three}</td>
                    <td>{rollsPercent.three}%</td>
                </tr>
                <tr>
                    <td>61-80</td>
                    <td>{rollsData.four}</td>
                    <td>{rollsPercent.four}%</td>
                </tr>
                <tr>
                    <td>81-99</td>
                    <td>{rollsData.five}</td>
                    <td>{rollsPercent.five}%</td>
                </tr>
            </tbody>
        </table>
        <br/>
        <span>
        The numbers above represent the total number of outcomes and their respective probability outcome
        </span>
    </div>} 





        </>         
      );
    };
    
    export default RNGOutcome;
    
    
    
    
    