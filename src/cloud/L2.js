const ethWeb3 = Moralis.web3ByChain("0x1"); // Mainnet
const polyWeb3 = Moralis.web3ByChain("0x89"); // Polygon

const logger = Moralis.Cloud.getLogger();
logger.info("Cloudfunction is online captain...");

////Global and State Variables////
//proxies
const validator = "0x80861814a8775de20F9506CF41932E95f80f7035"
const polyValidator = "0x86aB4B499235dC882F4dffD37bBDc9C76ae4964d"
const operator = "0xa2B877EC3234F50C33Ff7d0605F7591053d06E31"
const bridgeOperator = "0xf8a747448A0b5c137779C7e1d89FdCb389B795e7"

//keys
const validatorKey = "";
const polyValidatorKey = "";
const operatorKey =  "";
const bridgeOperatorKey = "";


//Addresses
const elvesAddress = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75" ;
const campaignsAddress = "0x367Dd3A23451B8Cc94F7EC1ecc5b3db3745D254e"
const polyElvesAddress = "0x4deab743f79b582c9b1d46b4af61a69477185dd5"
const mirenAddress = "0xE6b055ABb1c40B6C0Bf3a4ae126b6B8dBE6C5F3f"
//ABI's
const elvesABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"uint256","name":"action","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Action","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"bool","name":"subtract","type":"bool"}],"name":"BalanceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"campaign","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"sector","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Campaigns","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"sentinel","type":"uint256"}],"name":"CheckIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"CheckOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"renAmount","type":"uint256"}],"name":"RenTransferOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"INIT_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"_remaining","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"attributes","outputs":[{"internalType":"uint256","name":"hair","type":"uint256"},{"internalType":"uint256","name":"race","type":"uint256"},{"internalType":"uint256","name":"accessories","type":"uint256"},{"internalType":"uint256","name":"sentinelClass","type":"uint256"},{"internalType":"uint256","name":"weaponTier","type":"uint256"},{"internalType":"uint256","name":"inventory","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"auth","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bankBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"renAmount","type":"uint256"}],"name":"checkIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"sentinel","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"checkOut","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"renAmount","type":"uint256"},{"internalType":"bytes","name":"renSignatures","type":"bytes"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"checkOutRen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"elves","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"action","type":"uint256"},{"internalType":"uint256","name":"healthPoints","type":"uint256"},{"internalType":"uint256","name":"attackPoints","type":"uint256"},{"internalType":"uint256","name":"primaryWeapon","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"renAmount","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"encodeRenForSignature","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"sentinel","type":"uint256"}],"name":"encodeSentinelForSignature","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"flipActiveStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipTerminal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"forging","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMintPriceLevel","outputs":[{"internalType":"uint256","name":"mintCost","type":"uint256"},{"internalType":"uint256","name":"mintLevel","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getSentinel","outputs":[{"internalType":"uint256","name":"sentinel","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getToken","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"action","type":"uint8"},{"internalType":"uint8","name":"healthPoints","type":"uint8"},{"internalType":"uint8","name":"attackPoints","type":"uint8"},{"internalType":"uint8","name":"primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"level","type":"uint8"},{"internalType":"uint8","name":"hair","type":"uint8"},{"internalType":"uint8","name":"race","type":"uint8"},{"internalType":"uint8","name":"accessories","type":"uint8"},{"internalType":"uint8","name":"sentinelClass","type":"uint8"},{"internalType":"uint8","name":"weaponTier","type":"uint8"},{"internalType":"uint8","name":"inventory","type":"uint8"}],"internalType":"struct DataStructures.Token","name":"token","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"healer","type":"uint256"},{"internalType":"uint256","name":"target","type":"uint256"}],"name":"heal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_dev1Address","type":"address"},{"internalType":"address","name":"_dev2Address","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isGameActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isMintOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isTerminalOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isWlOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"merchant","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mint","outputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"sentinel","type":"uint256"}],"name":"modifyElfDNA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"passive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ren","outputs":[{"internalType":"contract IERC20Lite","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reserveAmount","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"returnPassive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"campaign_","type":"uint256"},{"internalType":"uint256","name":"sector_","type":"uint256"},{"internalType":"bool","name":"rollWeapons_","type":"bool"},{"internalType":"bool","name":"rollItems_","type":"bool"},{"internalType":"bool","name":"useitem_","type":"bool"}],"name":"sendCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sentinels","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setAccountBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_ren","type":"address"},{"internalType":"address","name":"_inventory","type":"address"},{"internalType":"address","name":"_campaigns","type":"address"},{"internalType":"address","name":"_validator","type":"address"}],"name":"setAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"adds_","type":"address[]"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setAuth","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"_primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"_weaponTier","type":"uint8"},{"internalType":"uint8","name":"_attackPoints","type":"uint8"},{"internalType":"uint8","name":"_healthPoints","type":"uint8"},{"internalType":"uint8","name":"_level","type":"uint8"},{"internalType":"uint8","name":"_inventory","type":"uint8"},{"internalType":"uint8","name":"_race","type":"uint8"},{"internalType":"uint8","name":"_class","type":"uint8"},{"internalType":"uint8","name":"_accessories","type":"uint8"}],"name":"setElfManually","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"supported","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"unStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"","type":"bytes"}],"name":"usedRenSignatures","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"validator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"whitelist","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawSomeTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawTokenBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const campaignsABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseRewards","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"creatureCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"creatureHealth","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expPoints","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minLevel","type":"uint256"}],"name":"AddCamp","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"}],"name":"LastKill","type":"event"},{"inputs":[],"name":"MAX_LEVEL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REGEN_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIME_CONSTANT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint16","name":"baseRewards_","type":"uint16"},{"internalType":"uint16","name":"creatureCount_","type":"uint16"},{"internalType":"uint16","name":"expPoints_","type":"uint16"},{"internalType":"uint16","name":"creatureHealth_","type":"uint16"},{"internalType":"uint16","name":"minLevel_","type":"uint16"}],"name":"addCamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"camps","outputs":[{"internalType":"uint32","name":"baseRewards","type":"uint32"},{"internalType":"uint32","name":"creatureCount","type":"uint32"},{"internalType":"uint32","name":"creatureHealth","type":"uint32"},{"internalType":"uint32","name":"expPoints","type":"uint32"},{"internalType":"uint32","name":"minLevel","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_campId","type":"uint256"},{"internalType":"uint256","name":"_sector","type":"uint256"},{"internalType":"uint256","name":"_level","type":"uint256"},{"internalType":"uint256","name":"_attackPoints","type":"uint256"},{"internalType":"uint256","name":"_healthPoints","type":"uint256"},{"internalType":"uint256","name":"_inventory","type":"uint256"},{"internalType":"bool","name":"_useItem","type":"bool"}],"name":"gameEngine","outputs":[{"internalType":"uint256","name":"level","type":"uint256"},{"internalType":"uint256","name":"rewards","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"inventory","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_elfcontract","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const mirenABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isFed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"minter","type":"address"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setMinter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const polyElvesABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"uint256","name":"action","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Action","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"baseRewards","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"creatureCount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"creatureHealth","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"expPoints","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minLevel","type":"uint256"}],"name":"AddCamp","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"bool","name":"subtract","type":"bool"}],"name":"BalanceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"BloodThirst","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"campaign","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"sector","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Campaigns","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"sentinel","type":"uint256"}],"name":"CheckIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"sentinel","type":"uint256"}],"name":"ElfTransferedIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"}],"name":"LastKill","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"renAmount","type":"uint256"}],"name":"RenTransferOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"renAmount","type":"uint256"}],"name":"RenTransferedIn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"INIT_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_LEVEL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REGEN_TIME","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TIME_CONSTANT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint16","name":"baseRewards_","type":"uint16"},{"internalType":"uint16","name":"creatureCount_","type":"uint16"},{"internalType":"uint16","name":"expPoints_","type":"uint16"},{"internalType":"uint16","name":"creatureHealth_","type":"uint16"},{"internalType":"uint16","name":"minLevel_","type":"uint16"},{"internalType":"uint16","name":"maxLevel_","type":"uint16"}],"name":"addCamp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"attributes","outputs":[{"internalType":"uint256","name":"hair","type":"uint256"},{"internalType":"uint256","name":"race","type":"uint256"},{"internalType":"uint256","name":"accessories","type":"uint256"},{"internalType":"uint256","name":"sentinelClass","type":"uint256"},{"internalType":"uint256","name":"weaponTier","type":"uint256"},{"internalType":"uint256","name":"inventory","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"auth","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bankBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"bool","name":"rollItems_","type":"bool"},{"internalType":"bool","name":"useitem_","type":"bool"},{"internalType":"address","name":"owner","type":"address"}],"name":"bloodThirst","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"camps","outputs":[{"internalType":"uint32","name":"baseRewards","type":"uint32"},{"internalType":"uint32","name":"creatureCount","type":"uint32"},{"internalType":"uint32","name":"creatureHealth","type":"uint32"},{"internalType":"uint32","name":"expPoints","type":"uint32"},{"internalType":"uint32","name":"minLevel","type":"uint32"},{"internalType":"uint32","name":"campMaxLevel","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"renAmount","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"checkIn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"elves","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"action","type":"uint256"},{"internalType":"uint256","name":"healthPoints","type":"uint256"},{"internalType":"uint256","name":"attackPoints","type":"uint256"},{"internalType":"uint256","name":"primaryWeapon","type":"uint256"},{"internalType":"uint256","name":"level","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"flipActiveStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"flipTerminal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"owner","type":"address"}],"name":"forging","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getSentinel","outputs":[{"internalType":"uint256","name":"sentinel","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getToken","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint8","name":"action","type":"uint8"},{"internalType":"uint8","name":"healthPoints","type":"uint8"},{"internalType":"uint8","name":"attackPoints","type":"uint8"},{"internalType":"uint8","name":"primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"level","type":"uint8"},{"internalType":"uint8","name":"hair","type":"uint8"},{"internalType":"uint8","name":"race","type":"uint8"},{"internalType":"uint8","name":"accessories","type":"uint8"},{"internalType":"uint8","name":"sentinelClass","type":"uint8"},{"internalType":"uint8","name":"weaponTier","type":"uint8"},{"internalType":"uint8","name":"inventory","type":"uint8"}],"internalType":"struct DataStructures.Token","name":"token","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"healer","type":"uint256"},{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"heal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"healers","type":"uint256[]"},{"internalType":"uint256[]","name":"targets","type":"uint256[]"},{"internalType":"address","name":"owner","type":"address"}],"name":"healMany","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isGameActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isTerminalOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"owner","type":"address"}],"name":"merchant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"minted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"sentinel","type":"uint256[]"}],"name":"modifyElfDNA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"oldSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"owner","type":"address"}],"name":"passive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"price","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"owner","type":"address"}],"name":"returnPassive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256","name":"campaign_","type":"uint256"},{"internalType":"uint256","name":"sector_","type":"uint256"},{"internalType":"bool","name":"rollWeapons_","type":"bool"},{"internalType":"bool","name":"rollItems_","type":"bool"},{"internalType":"bool","name":"useitem_","type":"bool"},{"internalType":"address","name":"owner","type":"address"}],"name":"sendCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"sentinels","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setAccountBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"setAccountBalances","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_inventory","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"setAddresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"adds_","type":"address[]"},{"internalType":"bool","name":"status","type":"bool"}],"name":"setAuth","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint8","name":"_primaryWeapon","type":"uint8"},{"internalType":"uint8","name":"_weaponTier","type":"uint8"},{"internalType":"uint8","name":"_attackPoints","type":"uint8"},{"internalType":"uint8","name":"_healthPoints","type":"uint8"},{"internalType":"uint8","name":"_level","type":"uint8"},{"internalType":"uint8","name":"_inventory","type":"uint8"},{"internalType":"uint8","name":"_race","type":"uint8"},{"internalType":"uint8","name":"_class","type":"uint8"},{"internalType":"uint8","name":"_accessories","type":"uint8"}],"name":"setElfManually","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"supported","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address","name":"owner","type":"address"}],"name":"synergize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
//Web3ByChain
const polyElves = new polyWeb3.eth.Contract(polyElvesABI, polyElvesAddress);  
const campaigns = new ethWeb3.eth.Contract(campaignsABI,campaignsAddress);   
const miren = new ethWeb3.eth.Contract(mirenABI,mirenAddress);  
const elves = new ethWeb3.eth.Contract(elvesABI,elvesAddress);
////
//Relays
const defender1 = "https://api.defender.openzeppelin.com/autotasks/bd97eb6c-8038-466e-9e15-2e933b927dcb/runs/webhook/c897a8c7-c0e5-45ac-abf5-341f0dec2d40/Hd8ttFMzNMuWa7NSZv6meg"
const defender2 = "https://api.defender.openzeppelin.com/autotasks/71bef792-a03f-400a-a487-cc33c4439ab5/runs/webhook/c897a8c7-c0e5-45ac-abf5-341f0dec2d40/VQvJ4ZMffaFzPVh4e4H57j"
const defender3 = "https://api.defender.openzeppelin.com/autotasks/105dfaf7-cf10-42f8-ae11-013ff1c978fe/runs/webhook/c897a8c7-c0e5-45ac-abf5-341f0dec2d40/8VH788u8tnLJK6rafEfLuQ"
///

Moralis.Cloud.define("getAllOwners", async(request) => {
const query = new Parse.Query("Elves");
const pipeline = [
  {project: {token_id: 1, owner_of:1}},
  { group: { objectId: '$owner_of', tokens: { $sum: 1 } } },
];

const ownerCount = await query.aggregate(pipeline, { useMasterKey: true })
return ownerCount;

});

Moralis.Cloud.define("getActions", async(request) => {

const query = new Parse.Query("ElvesAdmin");
const pipeline = [
  {project: {actionString: 1, token_id:1}},
  { group: { objectId: '$actionString', tokens: { $push: "$$ROOT" } } },

];

const actionDistribution = await query.aggregate(pipeline, { useMasterKey: true })
return actionDistribution
});

Moralis.Cloud.define("levelDistribution", async(request) => {

const query = new Parse.Query("ElvesAdmin");

const pipeline = [
  {project: {level: 1, owner_of:1}},
  { group: { objectId: '$level', tokens: { $push: "$$ROOT" } } },

];


const levelDistribution = await query.aggregate(pipeline, { useMasterKey: true })

return levelDistribution
});


Moralis.Cloud.define("getBalance", async(request) => {
const balance = request.params.address && await elves.methods.bankBalances(request.params.address).call();
return balance;
});

Moralis.Cloud.define("getPolyBalance", async(request) => {
const balance = request.params.address && await polyElves.methods.bankBalances(request.params.address).call();
return balance;
});

Moralis.Cloud.define("getMiren", async(request) => {
const walletMiren = request.params.address && await miren.methods.balanceOf(request.params.address).call();
return walletMiren;
});

Moralis.Cloud.define("totalRenSupply", async(request) => {
const supply = await miren.methods.totalSupply.call();
return supply;
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



Moralis.Cloud.define("getCampaigns", async(request) => {
const camps = await campaigns.methods.camps(request.params.id).call();

return camps;
});

Moralis.Cloud.define("getLastCampaignByUser", async(request) => {
const tokenId = request.params.tokenId
  
const query = new Moralis.Query("ElfCampaignsActivity");
const pipeline = [
 {project: {campaign:1, sector:1, tokenId:1, block_number:1, createdAt:1, amount:1}},
 {match: {tokenId: tokenId.toString()}},
 { sort : { block_number : -1 } },
 { limit: 1 }
 
   
];
  
const lastCampaign = await query.aggregate(pipeline, { useMasterKey: true })


return lastCampaign;
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

//////////////Test Code////////////////////////////
Moralis.Cloud.define("dbQ", async(request) => {
  const query = new Moralis.Query("ElvesEthCheckIn");
  
  const pipeline = [
    {match: {status: "initiated"}},
    {lookup: {
        from: "ElvesPolyCheckOut",
        localField: "sentinel",
        foreignField: "sentinel",
        as: "sentinelDna"
      }}
  ];

  
  const ownerCount = await query.aggregate(pipeline, { useMasterKey: true })
  
  return ownerCount

  })
  


Moralis.Cloud.define("testPolySign", async(request) => {
  
  const tokenId =  "3425"
  const sentinel = "99864225296643897433966437799361669599271263399541547998905020634832299073957"
  const walletAddress = "0xccb6d1e4acec2373077cb4a6151b1506f873a1a5"
  
  const checkSumAddress = await ethWeb3.utils.toChecksumAddress(walletAddress);
  const solidhash = ethWeb3.utils.soliditySha3(tokenId, checkSumAddress, sentinel)
  const signedTransaction = await ethWeb3.eth.accounts.sign(solidhash,validatorKey);	
  
  
		const Elves = Moralis.Object.extend("ElvesPolyCheckIn");
		let query = new Moralis.Query(Elves);  
		query.equalTo("tokenId", tokenId);
		const res = await query.first();
  
  res.set("signedTransaction", signedTransaction)
  res.set("status", "complete")
  res.save()
  
  let response = {
  tokenId:tokenId,
  sentinel: sentinel,  
  walletAddress: walletAddress,
  checkSumAddress: checkSumAddress,
  signedTransaction: signedTransaction,
  res: res
  }
  
 return response

});

Moralis.Cloud.define("remoteTx", async(request) => {

  const renAmount =  "707000000000000000000"
  const address = "0xCcB6D1e4ACec2373077Cb4A6151b1506F873a1a5"
  
  
  const nonceOperator = await polyWeb3.eth.getTransactionCount(renOperator)

  const transactionBody = {
    	to: polyElvesAddress,
      	nonce: nonceOperator,
      	data: polyElves.methods.setAccountBalance(address, renAmount).encodeABI(),
      	gas:400000
  }
  
  const signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, renOperatorKey);  
  let fulfillTx = await polyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
   
    let response = {
      signedTx: signedTransaction,
      transactionBody: transactionBody,
      fulfillTx: fulfillTx,
      nonce: nonceOperator,
      
    }
  
return response;
  
  	/*const tokenId =  request.params.tokenId
    const sentinelDna = request.params.sentinel
    
    const nonceOperator = await polyWeb3.eth.getTransactionCount(operator, 'latest')

    const transactionBody = {
    	to: polyElvesAddress,
      	nonce: nonceOperator,
      	data: polyElves.methods.modifyElfDNA([tokenId], [sentinelDna]).encodeABI(),
      	gas:400000
     }
  
   const signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, operatorKey);
  
   const fulfillTx = await polyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  	
*/
  
});



///Gasless Functions...///

Moralis.Cloud.define("defenderRelay", async(request) => {
  	
  const functionCall =  request.params.functionCall
  
  return await Moralis.Cloud.httpRequest({ 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    url: defender1, 
    body: {functionCall: functionCall}
    })
});


Moralis.Cloud.define("confirmPendingPolygon", async(request) => {			
    
   const asset =  request.params.asset
   const objectIds =  request.params.objectIds
   const owner =  request.params.owner

let param1 = []
let param2 = []

let ElvesClass

let confirmedArray = []    

let fullfilltx
let txData

let error

if(asset === "elves"){

    ElvesClass = Moralis.Object.extend("ElvesEthCheckIn")

  
}else if(asset === "ren"){

    ElvesClass = Moralis.Object.extend("ElvesRenTransferOut")

}

let query = new Moralis.Query(ElvesClass);
query.equalTo("from", owner);             
query.containedIn("objectId", objectIds);
query.notContainedIn("status", ["initiated", "completed"]);

const results = await query.find();

if(asset === "elves"){

    results.map((item, index) => {
        param1.push(item.attributes.tokenId)
        param2.push(item.attributes.sentinel)
        confirmedArray.push(item)
    })

    //txData = polyElves.methods.modifyElfDNA(param1, param2).encodeABI()

}else if(asset === "ren"){

     results.map((item, index) => {
        
        param1.push(item.attributes.from)        
        param2.push(item.attributes.renAmount)
        
        confirmedArray.push(item)
  
     })

    //txData = polyElves.methods.setAccountBalances(param1, param2).encodeABI()
}


if(confirmedArray.length > 0) {
    
     fullfilltx = await Moralis.Cloud.httpRequest({ 
                    method: 'POST', 
                    headers: {
                      'Content-Type': 'application/json;charset=utf-8'
                    },
                    url: defender3, //defender2 for old method
       				body: {asset: asset, param1: param1, param2: param2}
                    //body: {functionCall: txData}
                    })

       if(fullfilltx.data.status === "success"){

            confirmedArray.map((item, index) => {
                  item.set("status", "initiated")
                  item.save() 
      })
      }
    
  }

const statusMessages = {param1:param1, param2:param2, 
                        fullfilltx: fullfilltx, ca: confirmedArray, error: error}

return statusMessages

            
});


Moralis.Cloud.define("signForEthReturn", async(request) => {

    const walletAddress = request.params.wallet;
  	const tokenId =  request.params.tokenId
    const sentinel = request.params.sentinel
    
    const checkSumAddress = await ethWeb3.utils.toChecksumAddress(walletAddress);
  	const solidhash = ethWeb3.utils.soliditySha3(tokenId, checkSumAddress, sentinel)
    //Role and Wallet being passed to hashing function
    const signedTransaction = await ethWeb3.eth.accounts.sign(solidhash,validatorKey);	
  
  //Store sign and hash in new table = ElvesEthExits
  //use polygon operator to transfer sentineldna
  	
  let response = {
      signedTx: signedTransaction,
      checksumawallet: checkSumAddress,
      solidhash: solidhash,
      walletAddress: walletAddress,
      tokenId: tokenId,
      sentinel: sentinel    
      
    }
  
return response;
  
});

    
///////////////////////Polygon Transfers//////////////////////////
  /*
Moralis.Cloud.afterSave("ElvesEthCheckIn", async(request) =>{
//This function modifies elf dna in polygon once a checkin has been requested in Eth.
  const tokenId =  request.object.get("tokenId") 
  const sentinelDna = request.object.get("sentinel") 
  const status = request.object.get("status") 
  
  logger.info("New elf checkedin");
  logger.info("tokenId");
  logger.info(status);

  const nonceOperator = await polyWeb3.eth.getTransactionCount(bridgeOperator)

  const transactionBody = {
    	to: polyElvesAddress,
      	nonce: nonceOperator,
      	data: polyElves.methods.modifyElfDNA([tokenId], [sentinelDna]).encodeABI(),
      	gas:400000
  }
  
  const signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, bridgeOperatorKey);  
  let fulfillTx
  
  if(status !== "completed"){
  fulfillTx = await polyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

  	
      if(fulfillTx.status === true){

       	  request.object.set("status", "completed")
          request.object.save();

          const Elves = Moralis.Object.extend("Elves");
          let query = new Moralis.Query(Elves);  
          query.equalTo("token_id", parseInt(tokenId));
          const res = await query.first();
          res.set("chain", "polygon");
          res.save();  
      }
    
  }
  
 
    
});
 

Moralis.Cloud.afterSave("ElvesRenTransferOut", async(request) =>{
//This function creates ren in Polygon
  
  const renAmount =  request.object.get("renAmount") 
  const address = request.object.get("from") 
  const status = request.object.get("status")
  
  const nonceOperator = await polyWeb3.eth.getTransactionCount(renOperator)

  const transactionBody = {
    	to: polyElvesAddress,
      	nonce: nonceOperator,
      	data: polyElves.methods.setAccountBalance(address, renAmount).encodeABI(),
      	gas:400000
  }
  
  const signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, renOperatorKey);  
  let fulfillTx
  
  if(status !== "completed"){
  fulfillTx = await polyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
     if(fulfillTx.status === true){
  			request.object.set("status", "completed")
  			request.object.save()  
  	}
  }
  
});
*/

Moralis.Cloud.afterSave("ElvesPolyCheckIn", async(request) =>{
//Wait for checkin to be initiated in Polygon then create transfer signature
  
  const tokenId =  request.object.get("tokenId") 
  const sentinel = request.object.get("sentinel") 
  const walletAddress = request.object.get("from") 
  
  const checkSumAddress = await ethWeb3.utils.toChecksumAddress(walletAddress);
  const solidhash = ethWeb3.utils.soliditySha3(tokenId, checkSumAddress, sentinel)
  const signedTransaction = await ethWeb3.eth.accounts.sign(solidhash,validatorKey);	
  
  request.object.set("signedTransaction", signedTransaction)
  request.object.save();  
  
});



Moralis.Cloud.afterSave("ElvesEthCheckOut", async(request) =>{
  //After returning to Eth, let the dapp know that the transfer is not pending, and that the asset is back in Eth.
  const tokenId =  request.object.get("tokenId")
  
  const Elves = Moralis.Object.extend("Elves");
  let query = new Moralis.Query(Elves);  
  query.equalTo("token_id", parseInt(tokenId));
  const r = await query.first();
  r.set("chain", "eth");
  r.save();   
  
  const ElvesPolyCheckIn = Moralis.Object.extend("ElvesPolyCheckIn");
  let q = new Moralis.Query(ElvesPolyCheckIn);  
  q.equalTo("tokenId", tokenId.toString());
  q.notEqualTo("status", "confirmed");
  const s = await q.first();

  s.set("status", "confirmed");
  s.save();  

  
});

Moralis.Cloud.afterSave("ElvesPolyCheckOut", async(request) =>{
  //After checking in to Eth, let the dapp know that the transfer is not pending, and that the asset is in Poly.
  const tokenId =  request.object.get("tokenId")
  const sentinel =  request.object.get("sentinel")
  
  const Elves = Moralis.Object.extend("Elves");
  let query = new Moralis.Query(Elves);  
  query.equalTo("token_id", parseInt(tokenId));
  const r = await query.first();
  r.set("chain", "polygon");
  r.save();   
  
  const ElvesEthCheckIn = Moralis.Object.extend("ElvesEthCheckIn");
  let q = new Moralis.Query(ElvesEthCheckIn);  
  q.equalTo("tokenId", tokenId.toString());
  q.equalTo("sentinel", sentinel);
  //q.notEqualTo("status", "completed");
  const s = await q.first();
  s.set("status", "completed");
  s.save();      
  
});

Moralis.Cloud.afterSave("ElvesRenTransferIn", async(request) =>{
//This function creates ren in Eth
  
  const renAmount =  request.object.get("renAmount") 
  const walletAddress = request.object.get("from") 
  const timestamp = request.object.get("timestamp") 
  const status = request.object.get("status")
  
  if(status !== "completed"){
  const checkSumAddress = await ethWeb3.utils.toChecksumAddress(walletAddress);
  const solidhash = ethWeb3.utils.soliditySha3(renAmount, checkSumAddress, timestamp)
  const signedTransaction = await ethWeb3.eth.accounts.sign(solidhash,validatorKey);	
  
  request.object.set("signedTransaction", signedTransaction)
  request.object.save();  
  }
  
});

Moralis.Cloud.afterSave("ElvesRenTransferOutConfirmed", async(request) =>{
  //After sending ren to poly.
  const from =  request.object.get("from")
  const renAmount =  request.object.get("renAmount")
  
  const ElvesRenTransferOut = Moralis.Object.extend("ElvesRenTransferOut");
  let query = new Moralis.Query(ElvesRenTransferOut);  
  query.equalTo("from", from);
  query.equalTo("renAmount", renAmount);
  query.equalTo("status", "initiated");
  const r = await query.first();
  r.set("status", "completed");
  r.save();   
});

///


Moralis.Cloud.define("operatorTransactor", async(request) => {

  	const functionCall =  request.params.functionCall
    let value =  request.params.value
    
    if(!value) value = 0
    
    const nonceOperator = await polyWeb3.eth.getTransactionCount(operator)

    const transactionBody = {
    	to: polyElvesAddress,
      	nonce: nonceOperator,
      	data: functionCall,
      	value: value,
      	gas:400000
     }
  
   const signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, operatorKey);
  
   let fulfillTx 
   let response
   
   try{
   fulfillTx = await polyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
   		
     if(fulfillTx.status){
        
        	response = {
        		status: true,
        		transaction: fulfillTx   
   			}
   	  }
     
   }catch(error){
   	
      response = {
      status: false,
      transaction: fulfillTx,   
      error: error  
      }
     
   }

return response;
  
});

///Gasless Functions...///
Moralis.Cloud.define("operatorTransactorSignedTransaction", async(request) => {

  	const functionCall =  request.params.functionCall
    let value =  request.params.value
    
    if(!value) value = 0
    
    const nonceOperator = await polyWeb3.eth.getTransactionCount(operator)

    const transactionBody = {
    	to: polyElvesAddress,
      	nonce: nonceOperator,
      	data: functionCall,
      	value: value,
      	gas:400000
     }
  
   const signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, operatorKey);
  


return signedTransaction;
  
});



Moralis.Cloud.define("confirmPendingToPolygon", async(request) => {			
    
   const asset =  request.params.asset
   const objectIds =  request.params.objectIds
   const owner =  request.params.owner

let param1 = []
let param2 = []

let ElvesClass
let operatorNonce
let operatorKey

let confirmedArray = []    

let transactionBody    
let signedTransaction
let fullfilltx
let txData

let error

if(asset === "elves"){

    ElvesClass = Moralis.Object.extend("ElvesEthCheckIn")
    operatorNonce = await polyWeb3.eth.getTransactionCount(bridgeOperator)
    operatorKey = bridgeOperatorKey
  
}else if(asset === "ren"){

    ElvesClass = Moralis.Object.extend("ElvesRenTransferOut")
    operatorNonce = await polyWeb3.eth.getTransactionCount(renOperator)
    operatorKey = renOperatorKey
}

let query = new Moralis.Query(ElvesClass);
query.equalTo("from", owner);             
query.containedIn("objectId", objectIds);
query.notContainedIn("status", ["initiated", "completed"]);

const results = await query.find();

if(asset === "elves"){

    results.map((item, index) => {
        param1.push(item.attributes.tokenId)
        param2.push(item.attributes.sentinel)
        confirmedArray.push(item)
    })

    txData = polyElves.methods.modifyElfDNA(param1, param2).encodeABI()

}else if(asset === "ren"){

     results.map((item, index) => {
        
        param1.push(item.attributes.from)        
        param2.push(item.attributes.renAmount)
        
        confirmedArray.push(item)
  
     })

    txData = polyElves.methods.setAccountBalances(param1, param2).encodeABI()
}

transactionBody = {
      to: polyElvesAddress,
      nonce: operatorNonce,
      data: txData,
      gas:400000
    }

signedTransaction = await polyWeb3.eth.accounts.signTransaction(transactionBody, operatorKey);


if(confirmedArray.length > 0) {
    
      fullfilltx = await polyWeb3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
       if(fullfilltx.status === true){

            confirmedArray.map((item, index) => {
                  item.set("status", "initiated")
                  item.save() 
      })
      }
    
  }

const statusMessages = {status: null, param1:param1, param2:param2, fullfilltx: fullfilltx, ca: confirmedArray, error: error}

return statusMessages

            
});



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

		/guilds/{guild.id}/members/{user.id}
		
      const roles = {roleName:roleForMintName, roleIndex: roleForMint, username: dataObj.user.username, userId: dataObj.user.id}
      return roles;
      
  }, function(httpResponse) {
    logger.info('Request failed with response code ' + httpResponse.status);
  });
    

    return response;
  }
  
});
*/

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
*/
