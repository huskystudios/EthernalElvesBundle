const web3 = Moralis.web3ByChain("0x1"); // Mainnet
const validator = "";

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

			let roleForMint = 0
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
      s:signedTransaction.signature, 
      w: checkSumAddress,
      username: fetchResponse.username,
      userId: fetchResponse.userId,
      message: "first call",
      debug:fetchResponse,
      debig1:signedTransaction
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




