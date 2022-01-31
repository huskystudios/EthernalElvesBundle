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
  const Elves = await ethers.getContractFactory("EthernalElves");
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
  const Accessories = await ethers.getContractFactory("Accessories");

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
  describe("Testing for random stuff", function () {
    it("Testbench", async function () {

///loop to run this 20 times

      for (let i = 0; i < 20; i++) {

        await elves.connect(addr3).mint({ value: ethers.utils.parseEther(mintPrice)});

      }



      let elfDNA1  = "49968264009275017539535670417909670943111024596189459600049271000653441505398"
      let elfDNA2  = "90639261325515095916550229504372966434485488009035142111393150935086015709184"
      let elfDNA3  = "95199535037357583831230196232214470496524951124881320671361977318428717079228"
      let elfDNA4  = "176733018922766793863456232764223026231761172710780386921529813803013918803"
      let elfDNA5  = "104033998254104457207711809265765656967889567937609029390669730133219418002369"
      let elfDNA6  = "59191419749820083844107925745858946274976875014918368020617787010845471101889"
      let elfDNA7  = "90815946031992934349508562257833123001073733307295035239166916948156653502464"
      let elfDNA8  = "45584661173457321254210612575540283532315034336415019445197323810554419236947"
      let elfDNA9  = "49773876323416838558183632265792507461038671773506009186207359560517675620470"
      let elfDNA10 = "6901966021651367493376097821974886246768691696752418565839722454712320"
      let elfDNA11 = "59173772011371700022731505099784111231298686074016119538850815865905960715602"
      let elfDNA12 = "4735198446261624554463632327648465479673774052825815774396680581171493685145"
      let elfDNA13 = "95356784453082806703713815866790210446375368577071444989389267502054795149410"
      let elfDNA14 = "50127245682452623696737260134537041351245350833946112612745239999574885826658"
      let elfDNA15 = "45407976466979478000438069827830037564784373802913882425348141403720501952512"
      let elfDNA16 = "68202754074119754718325224628472035297083319101600443536698985813728326463356"
      let elfDNA17 = "96794991062066071185182783707510834643536423770272588297922691022990101710162"
      let elfDNA18 = "45233741880468332057974432411730820454743962524764814876565262334216502390652"
      let elfDNA19 = "18465802039954328031528884409992477310725845948101327756316868140935397126012"
      let elfDNA20 = "49968264009275017539535670417909670943111024596189459600049271000653441505398"

      const arrayofDNA = [elfDNA1, elfDNA2, elfDNA3, elfDNA4, elfDNA5, elfDNA6, elfDNA7, elfDNA8, elfDNA9, elfDNA10, elfDNA11, elfDNA12, elfDNA13, elfDNA14, elfDNA15, elfDNA16, elfDNA17, elfDNA18, elfDNA19, elfDNA20]

      await elves.modifyElfDNA(1, elfDNA4)
      await elves.modifyElfDNA(2, elfDNA10)
      await elves.modifyElfDNA(3, elfDNA12)
      await elves.modifyElfDNA(4, elfDNA19)

      await elves.tokenURI(1)
      await elves.tokenURI(2)
      await elves.tokenURI(3)
      await elves.tokenURI(4)

      console.log("Why fail?")
/*

      let results = arrayofDNA.forEach(async (dna, index) => {

        await elves.modifyElfDNA(index+1, dna)

      

      })

      //loop 20 times

      for (let i = 0; i < 20; i++) {

        try{
         await elves.tokenURI(i+1)
        }catch(e){
          console.log("token", i+1, "FAILED")
          console.log(await elves.attributes(i+1))
        }

        
        

      }

*/



    });});

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
      let maxSupply = 8//parseInt(await elves.maxSupply())
      await elves.setInitialSupply(4)
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
      console.log("After Campai4gn:");
      //await elves.connect(addr3).heal(3,4)
      await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(100000,true);
      console.log("After Campa5ign:");
      await elves.connect(addr3).bloodThirst([5],1,1)
      increaseWorldTimeinSeconds(100000,true);
      console.log("After Campai6gn:");
      await elves.connect(addr3).rampage([5],1,1)

      

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

