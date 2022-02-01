const web3 = Moralis.web3ByChain("0x1"); // Mainnet
const logger = Moralis.Cloud.getLogger();
logger.info("Cloudfunction is online captain...");

////Global Variables////////////////////////////
const validator = "pk";

const elvesAddress = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75" ;
const elvesABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"uint256","name":"action","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Action","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"bool","name":"subtract","type":"bool"}],"name":"BalanceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"campaign","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"sector","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Campaigns","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"INIT_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_remaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"attributes","outputs":[{"internalType":"uint256","name":"hair","type":"uint256"},{"internalType":"uint256","name":"race","type":"uint256"},{"internalType":"uint256","name":"accessories","type":"uint256"},{"internalType":"uint256","name":"sentinelClass","type":"uint256"},{"internalType":"uint256","name":"weaponTier","type":"uint256"},{"internalType":"uint256","name":"inventory","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"auth","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bankBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"campaign_","type":"uint256"},{"internalType":"uint256","name":"sector_","type":"uint256"}],"name":"bloodThirst","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"elves","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"action","type":"uint256"},{"internalType":"uint256","name":"healthPoints","type":"uint256"},{"internalType":"uint256","name":"attackPoints","type":"uint256"},{"internalType":"uint256","name":"primaryWeapon","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipActiveStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"forging","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMintPriceLevel","outputs":[{"internalType":"uint256","name":"mintCost","type":"uint256"},{"internalType":"uint256","name":"mintLevel","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getSentinel","outputs":[{"internalType":"uint256","name":"sentinel","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getToken","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"action","type":"uint8"},{"internalType":"uint8","name":"healthPoints","type":"uint8"},{"internalType":"uint8","name":"attackPoints","type":"uint8"},{"internalType":"uint8","name":"primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"level","type":"uint8"},{"internalType":"uint8","name":"hair","type":"uint8"},{"internalType":"uint8","name":"race","type":"uint8"},{"internalType":"uint8","name":"accessories","type":"uint8"},{"internalType":"uint8","name":"sentinelClass","type":"uint8"},{"internalType":"uint8","name":"weaponTier","type":"uint8"},{"internalType":"uint8","name":"inventory","type":"uint8"}],"internalType":"struct DataStructures.Token","name":"token","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"healer","type":"uint256"},{"internalType":"uint256","name":"target","type":"uint256"}],"name":"heal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_dev1Address","type":"address"},{"internalType":"address","name":"_dev2Address","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isGameActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isMintOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isWlOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"merchant","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mint","outputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"sentinel","type":"uint256"}],"name":"modifyElfDNA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"passive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"campaign_","type":"uint256"},{"internalType":"uint256","name":"sector_","type":"uint256"}],"name":"rampage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"ren","outputs":[{"internalType":"contract IERC20Lite","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reserveAmount","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"returnPassive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"campaign_","type":"uint256"},{"internalType":"uint256","name":"sector_","type":"uint256"},{"internalType":"bool","name":"rollWeapons_","type":"bool"},{"internalType":"bool","name":"rollItems_","type":"bool"},{"internalType":"bool","name":"useitem_","type":"bool"}],"name":"sendCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sentinels","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setAccountBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_ren","type":"address"},{"internalType":"address","name":"_inventory","type":"address"},{"internalType":"address","name":"_campaigns","type":"address"},{"internalType":"address","name":"_validator","type":"address"}],"name":"setAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"adds_","type":"address[]"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setAuth","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"_primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"_weaponTier","type":"uint8"},{"internalType":"uint8","name":"_attackPoints","type":"uint8"},{"internalType":"uint8","name":"_healthPoints","type":"uint8"},{"internalType":"uint8","name":"_level","type":"uint8"},{"internalType":"uint8","name":"_inventory","type":"uint8"}],"name":"setElfManually","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_initialSupply","type":"uint256"}],"name":"setInitialSupply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"supported","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"unStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"roleIndex","type":"uint256"},{"internalType":"bytes","name":"_signature","type":"bytes"}],"name":"validSignature","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"validator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelist","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"qty","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"roleIndex","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"whitelistMint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const elves = new web3.eth.Contract(elvesABI,elvesAddress);

const campaignsAddress = "0x367Dd3A23451B8Cc94F7EC1ecc5b3db3745D254e"
const campaignsABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseRewards","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"creatureCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"creatureHealth","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expPoints","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minLevel","type":"uint256"}],"name":"AddCamp","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"}],"name":"LastKill","type":"event"},{"inputs":[],"name":"MAX_LEVEL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REGEN_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIME_CONSTANT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint16","name":"baseRewards_","type":"uint16"},{"internalType":"uint16","name":"creatureCount_","type":"uint16"},{"internalType":"uint16","name":"expPoints_","type":"uint16"},{"internalType":"uint16","name":"creatureHealth_","type":"uint16"},{"internalType":"uint16","name":"minLevel_","type":"uint16"}],"name":"addCamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"camps","outputs":[{"internalType":"uint32","name":"baseRewards","type":"uint32"},{"internalType":"uint32","name":"creatureCount","type":"uint32"},{"internalType":"uint32","name":"creatureHealth","type":"uint32"},{"internalType":"uint32","name":"expPoints","type":"uint32"},{"internalType":"uint32","name":"minLevel","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_campId","type":"uint256"},{"internalType":"uint256","name":"_sector","type":"uint256"},{"internalType":"uint256","name":"_level","type":"uint256"},{"internalType":"uint256","name":"_attackPoints","type":"uint256"},{"internalType":"uint256","name":"_healthPoints","type":"uint256"},{"internalType":"uint256","name":"_inventory","type":"uint256"},{"internalType":"bool","name":"_useItem","type":"bool"}],"name":"gameEngine","outputs":[{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"rewards","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"inventory","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_elfcontract","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const campaigns = new web3.eth.Contract(campaignsABI,campaignsAddress);      

////////////////////////////////////////////////////
//////Start Whitelist Code/////////////////////////
//////////////////////////////////////////////////
/*
Moralis.Cloud.define("signMessage", async(request) => {
const logger = Moralis.Cloud.getLogger();
//get whitelist object from database
const Elves = Moralis.Object.extend("ElvesWhitelist"); 
let query = new Moralis.Query(Elves);
  
    const walletAddress = request.params.wallet;
  	const oauthData =  request.params.oauthData
    
    const fetchResponse = await Moralis.Cloud.httpRequest({
    method: 'GET',
    url: 'https://discord.com/api/users/@me/guilds/914739959271944233/member',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'authorization': `${oauthData.token_type} ${oauthData.access_token}`
    }
  }).then(function(httpResponse) {
      
      let dataObj = httpResponse.data;

      dataObj = JSON.stringify(dataObj);
      dataObj = JSON.parse(dataObj);
      
      const roleIds = dataObj.roles
      const WLroles = {
				"sentinel"    : "923088191353937940",
				"whitelist"   : "923088451887304704",
				"ogwhitelist" : "923088235465437205"
			}

			let roleForMint = 5
            let roleForMintName = "No Role"
		
				  roleIds.map((roleid) => {

					if(roleid === WLroles.whitelist){
						roleForMintName = "Whitelist"
                        roleForMint = 2
					}
                    if(roleid === WLroles.ogwhitelist){
						roleForMintName = "OG Whitelist"
                        roleForMint = 1
					}
                    if(roleid === WLroles.sentinel){
						roleForMintName = "SENTINEL OG Whitelist"
                        roleForMint = 0
					}

				  })
		
      const roles = {roleName:roleForMintName, roleIndex: roleForMint, username: dataObj.user.username, userId: dataObj.user.id}
      return roles;
      
  }, function(httpResponse) {
    logger.info('Request failed with response code ' + httpResponse.status);
  });
    const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
  	const solidhash = web3.utils.soliditySha3(checkSumAddress, parseInt(fetchResponse.roleIndex))
    //Role and Wallet being passed to hashing function
    const signedTransaction = await web3.eth.accounts.sign(solidhash,validator);	
  	
  let response = {
      r:fetchResponse.roleIndex, 
      n:fetchResponse.roleName, 
      s: "***check back after we lock up server roles***",   //signedTransaction.signature, CHANGE THIS
      w: checkSumAddress,
      username: fetchResponse.username,
      userId: fetchResponse.userId,
      message: "first call",
     // debug:fetchResponse,
     // debig1:signedTransaction
    }
  

    query.equalTo("discordUserId", fetchResponse.userId);
  	const res = await query.first();  
 
  if(!res){
  const elvesObject = new Elves();
  elvesObject.set("discordUserId", fetchResponse.userId)
  elvesObject.set("walletAddress", checkSumAddress)
  elvesObject.set("signature", signedTransaction.signature)
  elvesObject.set("roleIndex", fetchResponse.roleIndex)
  elvesObject.set("roleName", fetchResponse.roleName)
  elvesObject.set("username", fetchResponse.username)
  elvesObject.save()
  return response;
  
  }else{
    
    ///LOCK THIS UP 
      res.set("discordUserId", fetchResponse.userId)
      res.set("walletAddress", checkSumAddress)
      res.set("signature", signedTransaction.signature)
      res.set("roleIndex", fetchResponse.roleIndex)
      res.set("roleName", fetchResponse.roleName)
      res.set("username", fetchResponse.username)
      res.save()
    
    //from database
      response = {
      r:res.attributes.roleIndex, 
      n:res.attributes.roleName, 
      s:res.attributes.signature, 
      w:res.attributes.walletAddress,
      username: res.attributes.username,
      userId: res.attributes.userId,
      message: "from database"
    }

    return response;
  }
  
});

*/
/////////////////////////FOR MINT CREDS/////////////////////////////////////
Moralis.Cloud.define("getSigDatabase", async(request) => {

const Elves = Moralis.Object.extend("ElvesWhitelist"); 
let query = new Moralis.Query(Elves);
  
const walletAddress = request.params.wallet;    
const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
  	
query.equalTo("walletAddress", checkSumAddress);

const res =  await query.first();  
  
const error = {message: "Not on the list, contact devs on discord"}
 
	if(res){

 		return response = {
      	r:res.attributes.roleIndex, 
      	n:res.attributes.roleName, 
      	s:res.attributes.signature, 
      	w:res.attributes.walletAddress,
      	username: res.attributes.username,
      	userId: res.attributes.userId,
      	message: "from husky with love"
    	}
	}else {
    return error
    }

 
 
  
});
////////////////////Add to Whitelist Manually/////////////////
Moralis.Cloud.define("addToWhitelist", async(request) => {

    const Elves = Moralis.Object.extend("ElvesWhitelist"); 
    let query = new Moralis.Query(Elves);
      
        const walletAddress = request.params.wallet;
          const roleIndex =  request.params.roleIndex
        const username =  request.params.username
        let roleName
        if(parseInt(roleIndex) === 2){
            roleName = "Whitelist"
           }
        if(parseInt(roleIndex) === 1){
            roleName = "OG Whitelist"
            }
         if(parseInt(roleIndex) === 0){
            roleName = "SENTINEL OG Whitelist"
            }
        
        const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
          const solidhash = web3.utils.soliditySha3(checkSumAddress, parseInt(roleIndex))
        //Role and Wallet being passed to hashing function
        const signedTransaction = await web3.eth.accounts.sign(solidhash,validator);	
          
        query.equalTo("walletAddress", checkSumAddress);
          const res = await query.first(); 
          let response = "Nothing happened"
     
      if(!res){
      const elvesObject = new Elves();
      elvesObject.set("walletAddress", checkSumAddress)
      elvesObject.set("signature", signedTransaction.signature)
      elvesObject.set("roleIndex", parseInt(roleIndex))
      elvesObject.set("roleName", roleName)
      elvesObject.set("username", username)
      response = await elvesObject.save()
        .then((monster) => {
      // Execute any logic that should take place after the object is saved.
      return monster.id
        
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Moralis.Error with an error code and message.
      return error.message
    });
      
        
      
      }else{
        
        ///LOCK THIS UP 
          res.set("walletAddress", checkSumAddress)
          res.set("signature", signedTransaction.signature)
          res.set("roleIndex", parseInt(roleIndex))
          res.set("roleName", roleName)
          res.set("username", username)
          res.save()
           .then((monster) => {
      // Execute any logic that should take place after the object is saved.
     return monster.id
    }, (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Moralis.Error with an error code and message.
      return error.message
    });
      }
      
         return (response)
      
    });
////////////////////CHECK Whitelist/////////////////
Moralis.Cloud.define("checkWhitelist", async(request) => {

const Elves = Moralis.Object.extend("ElvesWhitelist"); 
let query = new Moralis.Query(Elves);
  
    const walletAddress = request.params.wallet;
  	const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
  	logger.info(checkSumAddress, "tried to check wl")
    query.equalTo("walletAddress", checkSumAddress);
  	const res = await query.first();  
 
      let response
  if(res)
  {
      
      response =   {
        message: `on the list with role ${res.attributes.roleName}`
      }
    }else  {

        response = { message: "not on the list" }
    }

    return response
});


Moralis.Cloud.define("getSignature", async(request) => {


const checkSumAddress = await web3.utils.toChecksumAddress(request.params.address);
const solidhash = web3.utils.soliditySha3(checkSumAddress, parseInt(request.params.roleIndex))

const signedTransaction = await web3.eth.accounts.sign(solidhash,validator);	
  	
return signedTransaction.signature
})

Moralis.Cloud.define("checkSignature", async(request) => {
const result = await elves.methods.validSignature(request.params.address, request.params.roleIndex,request.params.signature).call();
return result;
});

/////////////////////START Dapp Code//////////////////////////

Moralis.Cloud.define("getBalance", async(request) => {
const balance = request.params.address && await elves.methods.bankBalances(request.params.address).call();
return balance;
});

Moralis.Cloud.define("getCurrentSupply", async(request) => {
const currentSupply = await elves.methods.totalSupply.call();
return currentSupply;
});

Moralis.Cloud.define("getMaxSupply", async(request) => {
const maxSupply = await elves.methods.maxSupply.call();
return maxSupply;
});

Moralis.Cloud.define("getInitialSupply", async(request) => {
const initialSupply = await elves.methods.INIT_SUPPLY.call();
return initialSupply;
});


Moralis.Cloud.define("getMintPrice", async(request) => {
const mintPrice = await elves.methods.getMintPriceLevel.call();
return mintPrice;
});


/*
Moralis.Cloud.define("getTokenSupply", async(request) => {
 
 let currentSupply
 let maxSupply
 let initialSupply
 let mintPrice
 let error 

  try{
    currentSupply = await elves.methods.totalSupply().call();
  	}catch(e){
  	error = e
  	}
 	try{
    maxSupply = await elves.methods.maxSupply().call();
  	}catch(e){
  	error = e
  	}
  try{
    initialSupply = await elves.methods.INIT_SUPPLY().call();
  	}catch(e){
  	error = e
  	}
  try{
    mintPrice = await elves.methods.getMintPriceLevel().call();
  	}catch(e){
  	error = e
  	}
  
//NOTE FIX THIS

return {supply: currentSupply, maxSupply: maxSupply, initialSupply:initialSupply, mintPrice: mintPrice.mintCost, error: error};
});
*/

Moralis.Cloud.define("getWhitelistRemains", async(request) => {
 
 let sog = await elves.methods._remaining(0).call();
 let og
 let wl
 let error
 
  try{
    sog = await elves.methods._remaining(0).call();
  	}catch(e){
  	error = e
      logger.info(e)
  	}
   try{
    og = await elves.methods._remaining(1).call();
  	}catch(e){
  	error = e
  	}
   try{
    wl = await elves.methods._remaining(2).call();
  	}catch(e){
  	error = e
  	}
 	
return {sog: sog, og:og, wl:wl, e:error};
});

Moralis.Cloud.define("getCampaigns", async(request) => {
const camps = await campaigns.methods.camps(request.params.id).call();

return camps;
});

Moralis.Cloud.define("getElvesFromDb", async(request) => {

const Elves = Moralis.Object.extend("Elves");
let query = new Moralis.Query(Elves);
 
  query.equalTo("owner_of", request.params.address.toLowerCase());

  const results = await query.find();
  const tokenArr = [];
  
  results.map((elf) => {
  tokenArr.push(elf.attributes.token_id)
  })

return tokenArr
});

Moralis.Cloud.afterSave("ElfTransfers", async(request) =>{
  
const tokenId = parseInt(request.object.get("tokenId"));
const elf = await elves.methods.elves(tokenId).call();
const elfOwner = await elves.methods.ownerOf(tokenId).call();

let elfFromOwnerOf = elfOwner.toLowerCase()//actual owner
let elfFromElves = elf.owner.toLowerCase()//recorded owner
let tokenHolder = elfFromElves

if(elfFromElves === "0x0000000000000000000000000000000000000000"){
  tokenHolder = elfFromOwnerOf
}
  tokenHolder = tokenHolder.toLowerCase();

const Elves = Moralis.Object.extend("Elves");
let query = new Moralis.Query(Elves);  
query.equalTo("token_id", tokenId);
const res = await query.first();
  
  if(!res){
  const elvesObject = new Elves();
  elvesObject.set("owner_of", tokenHolder)
  elvesObject.set("token_id", tokenId)
  elvesObject.save().then((elf)=>{
    // Execute any logic that should take place after the object is saved.
    logger.info('Object created with objectId: ' + elf.id );
  }, (error) => {
    // Execute any logic that should take place if the save fails.
    // error is a Moralis.Error with an error code and message.
    logger.info('Failed to create new object, with error code: ' + error.message);
  });  
  }else{
  	res.set("owner_of", tokenHolder);
	res.save().then((elf)=>{
    // Execute any logic that should take place after the object is saved.
    logger.info('Object updated with objectId: ' + elf.id );
  }, (error) => {
    // Execute any logic that should take place if the save fails.
    // error is a Moralis.Error with an error code and message.
    logger.info('Failed to update object, with error code: ' + error.message);
  });
  }
  
  
});

Moralis.Cloud.define("getGameStatus", async(request) => {
 
 let gameActive
 let wlMint
 let publicMint
 let error
 
  try{
    gameActive = await elves.methods.isGameActive().call();
  	}catch(e){
  	error = e
  	}
 	try{
    wlMint = await elves.methods.isWlOpen().call();
  	}catch(e){
  	error = e
  	}
  try{
    publicMint = await elves.methods.isMintOpen().call();
  	}catch(e){
  	error = e
  	}

return {gameActive: gameActive, wlMint:wlMint, publicMint: publicMint, error: error};
});

