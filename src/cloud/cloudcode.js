const web3 = Moralis.web3ByChain("0x4"); // Mumbai Testnet // Ethereum (Mainnet) 0x1
const logger = Moralis.Cloud.getLogger();
logger.info("Cloudfunction is online captain...");
const elvesAddress = "0xe0BDED7f215aD4F9FE861E69F444adEaA30E5F43" ;
const elvesABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"uint256","name":"action","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Action","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"INIT_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"attributes","outputs":[{"internalType":"uint256","name":"hair","type":"uint256"},{"internalType":"uint256","name":"race","type":"uint256"},{"internalType":"uint256","name":"accessories","type":"uint256"},{"internalType":"uint256","name":"sentinelClass","type":"uint256"},{"internalType":"uint256","name":"weaponTier","type":"uint256"},{"internalType":"uint256","name":"inventory","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bankBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"action_","type":"uint256"}],"name":"doAction","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"elves","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"action","type":"uint256"},{"internalType":"uint256","name":"campaign","type":"uint256"},{"internalType":"uint256","name":"attackPoints","type":"uint256"},{"internalType":"uint256","name":"primaryWeapon","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipActiveStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"magicId","type":"uint256"},{"internalType":"uint256[]","name":"_elves","type":"uint256[]"}],"name":"heal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_adminAddress","type":"address"},{"internalType":"address","name":"_dev1Address","type":"address"},{"internalType":"address","name":"_dev2Address","type":"address"},{"internalType":"address","name":"_whitelist","type":"address"},{"internalType":"address","name":"_ren","type":"address"},{"internalType":"address","name":"_inventory","type":"address"},{"internalType":"address","name":"_campaigns","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isGameActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mint","outputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reserveAmount","type":"uint256"},{"internalType":"address","name":"_whitelister","type":"address"}],"name":"presale","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"ren","outputs":[{"internalType":"contract IERC20Lite","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reserveAmount","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"campaign_","type":"uint256"},{"internalType":"uint256","name":"sector_","type":"uint256"},{"internalType":"bool","name":"rollWeapons_","type":"bool"},{"internalType":"bool","name":"rollItems_","type":"bool"},{"internalType":"bool","name":"useitem_","type":"bool"}],"name":"sendCampaign","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sentinels","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setAccountBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"_primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"_weaponTier","type":"uint8"},{"internalType":"uint8","name":"_attackPoints","type":"uint8"},{"internalType":"uint8","name":"_level","type":"uint8"},{"internalType":"uint8","name":"_inventory","type":"uint8"}],"name":"setElfManually","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"supported","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const campaignsAddress = "0x26E75d5CC8847130c99DCDFBf396d7dF19D55598"
const campaignsABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"DISTRIBUTION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"HEALTHBONUS_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LEVEL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REGEN_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIME_CONSTANT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint16","name":"baseRewards_","type":"uint16"},{"internalType":"uint16","name":"creatureCount_","type":"uint16"},{"internalType":"uint16","name":"expPoints_","type":"uint16"},{"internalType":"uint16","name":"creatureHealth_","type":"uint16"},{"internalType":"uint16","name":"minLevel_","type":"uint16"},{"internalType":"uint16","name":"itemDrop_","type":"uint16"},{"internalType":"uint16","name":"weaponDrop_","type":"uint16"}],"name":"addCamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"camps","outputs":[{"internalType":"uint32","name":"baseRewards","type":"uint32"},{"internalType":"uint32","name":"creatureCount","type":"uint32"},{"internalType":"uint32","name":"creatureHealth","type":"uint32"},{"internalType":"uint32","name":"expPoints","type":"uint32"},{"internalType":"uint32","name":"minLevel","type":"uint32"},{"internalType":"uint32","name":"itemDrop","type":"uint32"},{"internalType":"uint32","name":"weaponDrop","type":"uint32"},{"internalType":"uint32","name":"spare","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_campId","type":"uint256"},{"internalType":"uint256","name":"_sector","type":"uint256"},{"internalType":"uint256","name":"_level","type":"uint256"},{"internalType":"uint256","name":"_attackPoints","type":"uint256"},{"internalType":"uint256","name":"_inventory","type":"uint256"},{"internalType":"bool","name":"_useItem","type":"bool"},{"internalType":"uint256","name":"_sentinelClass","type":"uint256"}],"name":"gameEngine","outputs":[{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"rewards","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_elfcontract","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"level_","type":"uint256"}],"name":"rollItems","outputs":[{"internalType":"uint256","name":"newInventory","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"level_","type":"uint256"},{"internalType":"uint256","name":"sectorIndex_","type":"uint256"}],"name":"rollWeapons","outputs":[{"internalType":"uint256","name":"newWeaponTier","type":"uint256"},{"internalType":"uint256","name":"newWeapon","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
      
const elves = new web3.eth.Contract(elvesABI,elvesAddress);
const campaigns = new web3.eth.Contract(campaignsABI,campaignsAddress);

Moralis.Cloud.define("getBalance", async(request) => {
const balance = await elves.methods.bankBalances(request.params.address).call();
return balance;
});

Moralis.Cloud.define("getTokenSupply", async(request) => {
const supply = await elves.methods.totalSupply().call();
const maxSupply = 6666 //await elves.methods.maxSupply().call();

return {supply: supply, maxSupply: maxSupply};
});

Moralis.Cloud.define("getCampaigns", async(request) => {
const camps = await campaigns.methods.camps(request.params.id).call();


return {supply: supply, maxSupply: maxSupply};
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