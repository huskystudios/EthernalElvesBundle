const fs = require('fs-extra')
const path = require('path')

const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const {initEthers, assertThrowsMessage, signPackedData, getTimestamp, increaseBlockTimestampBy} = require('./helpers')


const increaseWorldTimeinSeconds = async (seconds, mine = false) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  if (mine) {
    await ethers.provider.send("evm_mine", []);
  }
};

const mintPrice = ".088"


describe("Ethernal Elves Contracts", function () {
  let owner;
  let beff;
  let addr3;
  let addr4;
  let addr5;
  let addrs;
  let ren
  let elves
  let inventory
  let campaigns
  let terminus
  let fxBaseRootTunnel


  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
  // Get the ContractFactory and Signers here.
  // Deploy each contract and Initialize main contract with varialbes 
    
  [owner, beff, addr3, addr4, addr5, ...addrs] = await ethers.getSigners();
  
  //owner and beff are dev wallets. addr3 and addr4 will be used to test the game and transfer/banking functions
  
  const MetadataHandler = await ethers.getContractFactory("ElfMetadataHandler");
  const Miren = await ethers.getContractFactory("Miren");
  //const Elves = await ethers.getContractFactory("EthernalElves");
  const Elves = await ethers.getContractFactory("EthernalElvesV2");
  const Campaigns = await ethers.getContractFactory("ElfCampaigns");
  //const Terminus = await ethers.getContractFactory("Terminus");
  //const Bridge = await ethers.getContractFactory("FxBaseRootTunnel");

  ///Deploy art contracts
  const Hair = await ethers.getContractFactory("Hair");
  const Race1 = await ethers.getContractFactory("Race1");
  const Race2 = await ethers.getContractFactory("Race2");
  const Weapons1 = await ethers.getContractFactory("Weapons1");
  const Weapons2 = await ethers.getContractFactory("Weapons2");
  const Weapons3 = await ethers.getContractFactory("Weapons3");
  const Weapons4 = await ethers.getContractFactory("Weapons4");
  const Weapons5 = await ethers.getContractFactory("Weapons5");
  const Weapons6 = await ethers.getContractFactory("Weapons6");
  const Accessories = await ethers.getContractFactory("Accessories1");

  const hair = await Hair.deploy();
  const race1 = await Race1.deploy();
  const race2 = await Race2.deploy();
  const weapons1 = await Weapons1.deploy();
  const weapons2 = await Weapons2.deploy();
  const weapons3 = await Weapons3.deploy();
  const weapons4 = await Weapons4.deploy();
  const weapons5 = await Weapons5.deploy();
  const weapons6 = await Weapons6.deploy();
  const accessories = await Accessories.deploy();
  
  ///Body x 3, Hair x 3, Weapons x 3, 
  
 //Deploying the contracts
  ren = await Miren.deploy(); 
   //whitelist = await Whitelist.deploy();
  
  //terminus = await Terminus.deploy();
  //fxBaseRootTunnel = await Bridge.deploy();

  //fxBaseRootTunnel.initialize(terminus.address,terminus.address)
  //fxBaseRootTunnel.setAuth([terminus.address], true)
  elves = await upgrades.deployProxy(Elves, [owner.address, beff.address]);
  
  inventory = await upgrades.deployProxy(MetadataHandler);

  await elves.deployed();
  campaigns = await upgrades.deployProxy(Campaigns, [elves.address]);
  await campaigns.deployed();

  await elves.setAddresses(ren.address, inventory.address, campaigns.address, "0x80861814a8775de20F9506CF41932E95f80f7035");
  //await elves.setTerminus(terminus.address);

  await inventory.setRace([1,10,11,12,2,3], race1.address)
  await inventory.setRace([4,5,6,7,8,9], race2.address)
  
  await inventory.setHair([1,2,3,4,5,6,7,8,9], hair.address)

  await inventory.setWeapons([1,10,11,12,13,14,15], weapons1.address)
  await inventory.setWeapons([23,24,25,26,27,28,29], weapons2.address)
  await inventory.setWeapons([38,39,4,40,41,42], weapons3.address)
  await inventory.setWeapons([16,17,18,19,2,20,21,22], weapons4.address)  
  await inventory.setWeapons([3,30,31,32,33,34,35,36,37], weapons5.address)
  await inventory.setWeapons([43,44,45,5,6,7,8,9, 69], weapons6.address)

  await inventory.setAccessories([15,16,4,5,8,9,1,2,3,6,7,10,11,12,13,14,17,18,19,20,21], accessories.address)
   
//  await campaigns.initialize(elves.address);

  //await terminus.initialize(fxBaseRootTunnel.address, elves.address, ren.address);
 
  await ren.setMinter(elves.address, 1)
  await ren.setMinter(owner.address, 1)
 //await ren.setMinter(terminus.address, 1)

  await elves.flipWhitelist();
  await elves.flipMint();
  await elves.flipActiveStatus();
  
  

  });

  describe("Test Transfers", function () {
    it("Testing all the erc721 transfer functions", async function () {

      

        console.log("testing")
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)}); //1
        await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)}); //2
        await elves.connect(addr5).mint({ value: ethers.utils.parseEther(mintPrice)}); //3

        console.log(await elves.ownerOf(1))
        console.log(await elves.ownerOf(2))
        console.log(await elves.ownerOf(3))


        await elves.connect(addr3).approve(addr4.address, 1)

        await elves.connect(addr4).transferFrom(addr3.address, addr5.address, 1)
        //await elves.connect(addr5).safeTransferFrom(addr5.address, addr3.address, 3)
        
        console.log(await elves.ownerOf(1))
        console.log(await elves.ownerOf(2))
        console.log(await elves.ownerOf(3))
      

  expect(await elves.ownerOf(1)).to.equal(addr5.address);

    })});



    /*
  describe("Testing for random stuff", function () {
    it("Testbench", async function () {




    });});
*/


 
/*
  describe("Whitelist Mint", function () {
    it("WL Mint Qty 2", async function () {
    

      let sig3 = "0xdc32af9449379cbe2590d10906a4d75a54068b567d1bc7e5e513e60c560805944c850fd88b42e23415a939e18c85c39c4026faa2642d185b282e3cf1d88c666c1b"
      let sig4 = "0x839627587bd83e3c53f33a3d9ee73568c5120f65ab17359815a7b0cd40d61be00ad95184ca00101af08fcfa88e1802533980bae3f151166f794c95e5bccf1d061b"
      let sig5 = "0x20868c80932018ff173bb5eca6628b8071c0664e547cebcf040eab374a525af22ee2669a8afb218e1c56709ac4058898f82298e3a83b10a0e5454e6b6fa4bc3d1c" 

      console.log("Is Signature valid?", await elves.validSignature(addr3.address,0, sig3))

      await elves.connect(addr3).whitelistMint(2,addr3.address, 0, sig3, { value: ethers.utils.parseEther("0.00")})
      await elves.connect(addr4).whitelistMint(2,addr4.address, 1, sig4, { value: ethers.utils.parseEther("0.088")})
      await elves.connect(addr5).whitelistMint(2,addr5.address, 2, sig5, { value: ethers.utils.parseEther("0.176")})
    
      });
    it("WL Mint Qty 1", async function () {
    

        let sig3 = "0xdc32af9449379cbe2590d10906a4d75a54068b567d1bc7e5e513e60c560805944c850fd88b42e23415a939e18c85c39c4026faa2642d185b282e3cf1d88c666c1b"
        let sig4 = "0x839627587bd83e3c53f33a3d9ee73568c5120f65ab17359815a7b0cd40d61be00ad95184ca00101af08fcfa88e1802533980bae3f151166f794c95e5bccf1d061b"
        let sig5 = "0x20868c80932018ff173bb5eca6628b8071c0664e547cebcf040eab374a525af22ee2669a8afb218e1c56709ac4058898f82298e3a83b10a0e5454e6b6fa4bc3d1c" 
  
        await elves.connect(addr3).whitelistMint(1,addr3.address, 0, sig3, { value: ethers.utils.parseEther("0.00")})
        await elves.connect(addr4).whitelistMint(1,addr4.address, 1, sig4, { value: ethers.utils.parseEther("0.044")})
        await elves.connect(addr5).whitelistMint(1,addr5.address, 2, sig5, { value: ethers.utils.parseEther("0.088")})
      
        });
    it("Withdraw funds from player credit account to player wallet", async function () {
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("1000000000000000000000"));
      await elves.connect(addr3).withdrawTokenBalance();
  
    expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("1000000000000000000000").value);
      });

    });  

*/
/*

  describe("Deployment and ERC20 and ERC721 Minting", function () {
    it("Check contract deployer is owner", async function () {
      expect(await elves.admin()).to.equal(owner.address); 
    })
    it("Mint entire NFT collection", async function () {

      await ren.mint(beff.address,  ethers.BigNumber.from("6000000000000000000000")); 
      await ren.mint(addr3.address, ethers.BigNumber.from("6000000000000000000000")); 
      await ren.mint(addr4.address, ethers.BigNumber.from("6000000000000000000000")); 
      await ren.mint(addr5.address, ethers.BigNumber.from("6000000000000000000000")); 

      await elves.setAccountBalance(beff.address, ethers.BigNumber.from("120000000000000000000"));
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("120000000000000000000"));
      await elves.setAccountBalance(addr4.address, ethers.BigNumber.from("120000000000000000000"));
      await elves.setAccountBalance(addr5.address, ethers.BigNumber.from("100000000000000000000"));
      
      let totalsupply = 1
      let maxSupply = 6//parseInt(await elves.maxSupply())
      await elves.setInitialSupply(2)
      let initialSupply = parseInt(await elves.INIT_SUPPLY())
      let i = 1

      console.log("Actual Max Mint", parseInt(await elves.maxSupply()))
      
      while (totalsupply < maxSupply) {
        
          totalsupply<=initialSupply ? await elves.connect(beff).mint({ value: ethers.utils.parseEther(mintPrice)}) :   await elves.connect(beff).mint();
          console.log(i)
          elves.tokenURI(i)
          i++;
          console.log(i)
          totalsupply<=initialSupply ? await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)}) :  await elves.connect(addr3).mint(); 
          elves.tokenURI(i)
          i++;
          console.log(i)
          totalsupply<=initialSupply ? await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)}) :  await elves.connect(addr4).mint();
          elves.tokenURI(i)
          i++;
          console.log(i)
          totalsupply<=initialSupply ? await elves.connect(addr5).mint({ value: ethers.utils.parseEther(mintPrice)}) :  await elves.connect(addr5).mint();
          elves.tokenURI(i)
          i++;
          console.log(i)
          
        totalsupply = parseInt(await elves.totalSupply())
        
        increaseWorldTimeinSeconds(1,true);
        
    
      }
     
      expect(parseInt(await elves.totalSupply())).to.equal(maxSupply);
    })   

        
  })
*/

describe("Game Play", function () {
    it("Tests staking and actions", async function () {
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
      await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});

      increaseWorldTimeinSeconds(10,true);


      await elves.connect(addr3).sendCampaign([1],1,4,0,1,0);
      console.log (await elves.attributes(1))
      increaseWorldTimeinSeconds(100000,true);
      console.log("FAIL")
//      await elves.connect(addr3).sendCampaign([1],1,4,0,1,0);
      increaseWorldTimeinSeconds(100000,true);
      console.log (await elves.attributes(1))
      await elves.connect(addr3).sendCampaign([1],1,5,1,1,2);

      increaseWorldTimeinSeconds(100000,true);
      
      console.log("After Campaig1n:");
      await elves.connect(addr3).passive([3])
      increaseWorldTimeinSeconds(100000,true);
      await elves.connect(addr3).unStake([1])
      console.log("After Campaig2n:");
      await elves.connect(addr3).returnPassive([3]);
      await elves.connect(addr3).forging([4], {value: ethers.utils.parseEther("0.01")})
      console.log("After Campaig3n:");
      await elves.connect(addr3).merchant([4], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).forging([5], {value: ethers.utils.parseEther("0.01")})
      console.log("After Campaig3n:");
      await elves.connect(addr3).merchant([5], {value: ethers.utils.parseEther("0.01")})
      await elves.connect(addr3).forging([6], {value: ethers.utils.parseEther("0.01")})
      console.log("After Campaig3n:");
      await elves.connect(addr3).merchant([6], {value: ethers.utils.parseEther("0.01")})

      console.log("After Campai4gn:");
      await elves.connect(addr3).heal(3,4)
      //await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(100000,true);
      console.log("After Campa5ign:");
      //await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(100000,true);
      console.log("After Campai6gn:");
      //await elves.connect(addr3).rampage([5],1,1)

      

      // await elves.connect(addr3).unStake([1])
      increaseWorldTimeinSeconds(100000,true);
      await elves.connect(addr3).passive([6])
      
      //await elves.connect(addr3).test(2)

      console.log("Creatures left in camps", await campaigns.camps(1))
      
      elves.tokenURI(1)
      elves.tokenURI(2)
      elves.tokenURI(3)
      elves.tokenURI(4)
      elves.tokenURI(5)
      elves.tokenURI(6)
      
      });

      it("Passive Campaigns", async function () {
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
        await elves.connect(addr3).passive([1])
        await elves.connect(addr3).passive([2])
        await elves.connect(addr3).passive([3])
        await elves.connect(addr3).passive([4])

        increaseWorldTimeinSeconds(604700,true);
        await elves.connect(addr3).returnPassive([1]);
        increaseWorldTimeinSeconds(800,true);
        await elves.connect(addr3).returnPassive([2]);

        increaseWorldTimeinSeconds(604800,true);
        await elves.connect(addr3).returnPassive([3]);
        increaseWorldTimeinSeconds(604800,true);
        increaseWorldTimeinSeconds(604800,true);
        increaseWorldTimeinSeconds(604800,true);
        await elves.connect(addr3).returnPassive([4]);


        elves.tokenURI(1)
        elves.tokenURI(2)
        elves.tokenURI(3)
        elves.tokenURI(4)
        
        
        
        });
  


  });


describe("Bank Functions", function () {
    it("Deposit funds to player credit account", async function () {
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("1000000000000000000000"));

      expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("1000000000000000000000").value);
      });
    it("Withdraw funds from player credit account to player wallet", async function () {
      await elves.setAccountBalance(addr3.address, ethers.BigNumber.from("1000000000000000000000"));
      await elves.connect(addr3).withdrawTokenBalance();
  
    expect(await elves.bankBalances(addr3.address).value).to.equal(ethers.BigNumber.from("1000000000000000000000").value);
      });
    });

  

describe("Admin Functions", function () {
  it("Withdraw funds from contract", async function () {
    await elves.connect(addr4).mint({ value: ethers.utils.parseEther(mintPrice)});
    await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});
    elves.withdrawAll();
    expect(await owner.getBalance().value).to.equal(await beff.getBalance().value);
    });
  it("Add new camp for quests and see if correct rewards are loaded", async function () {
      await campaigns.addCamp(6, 99, 500, 9, 10, 1);
     
      
    });
    it("Flip game active status", async function () {
      await elves.flipActiveStatus()
      expect(await elves.isGameActive()).to.equal(false);
      
    });
  });

});

