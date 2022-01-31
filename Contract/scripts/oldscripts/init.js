const hre = require("hardhat");

let invetoryAddress = "0xB8b20372bf0880359d96a3c5e51C09F670C80b87"
let campaignAddress = "0x6e8AAD4EbeBc5A61432c98DA05eBb62c621Df549"
let elvesImp = "0x252eca87fd7e46a872eeca7c49911f7abe8950ae"
let inventoryImp = ""
let renAddress =  "0xFfCB4a8e3616B07f8d01546c0Bb376aF9d6B8b02"
let elvesAddress = "0x13BdEE5Dfe487A055f3fa523feCdcF8ecDd3B889"
let validator = "0x80861814a8775de20F9506CF41932E95f80f7035"

async function main() {
  //Miren on Mainnet: 0xE6b055ABb1c40B6C0Bf3a4ae126b6B8dBE6C5F3f

  const Miren = await ethers.getContractFactory("Miren");
  const Elves = await ethers.getContractFactory("EthernalElves");
  const Campaigns = await ethers.getContractFactory("ElfCampaigns");
  const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandler");
  
//0x597d97b11a9cf0e491b69686d2ed7fee8e0deec8 IMP

await Miren.attach(renAddress).setMinter(elvesAddress, 1)
await Elves.attach(elvesAddress).setAddresses(renAddress, invetoryAddress, campaignAddress, validator);
await Campaigns.attach(campaignAddress).initialize(elvesAddress);
//await Elves.attach(elvesAddress).setAddresses(renAddress, invetoryAddress, campaignAddress, validator);


console.log("verifying contracts")
await hre.run("verify:verify", { address: renAddress });
await hre.run("verify:verify", { address: campaignAddress });
await hre.run("verify:verify", { address: elvesImp });
//await hre.run("verify:verify", { address: inventoryImp });


console.log("done")  

  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
