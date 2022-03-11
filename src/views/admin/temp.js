
////////////////////////////////////////////////////////////////////////////////////////
//                              UPDATE FULL METADATA                            ///////
///////////////////////////////////////////////////////////////////////////////////////

Moralis.Cloud.afterSave("ElfActions", async(request) =>{
    logger.info("ETH Action Ping...");
    
    const tokenId = parseInt(request.object.get("tokenId"));
    
    const confirmed = request.object.get("confirmed");   
    const chain = "eth"   
      
    if(confirmed){
      
    const elf = await elves.methods.elves(tokenId).call();
    const elfOwner = await elves.methods.ownerOf(tokenId).call();
    const elfAttributes = await elves.methods.attributes(tokenId).call();
    const elfTokenURI = await elves.methods.tokenURI(tokenId).call();
    
    let b = elfTokenURI.split(",")
    const elfTokenObj = JSON.parse(atob(b[1]))  
    
    const elfClass = elfTokenObj.attributes[0].value
    const elfRace = elfTokenObj.attributes[1].value 
    const elfHair = elfTokenObj.attributes[2].value
    const elfWeapon = elfTokenObj.attributes[3].value
    const elfWeaponTier = elfTokenObj.attributes[4].value 
    const elfAccessories = elfTokenObj.attributes[5].value
    const elfLevel = elfTokenObj.attributes[6].value
    const elfAp = elfTokenObj.attributes[7].value
    const elfHp = elfTokenObj.attributes[8].value
    const elfInventory = elfAttributes.inventory
    const elfAction = elf.action
    const timestamp = elf.timestamp
     
    let elfFromOwnerOf = elfOwner.toLowerCase()//actual owner
    let elfFromElves = elf.owner.toLowerCase()//recorded owner
    let tokenHolder = elfFromElves
    let elfStatus = "staked"
    
    if(elfFromElves === "0x0000000000000000000000000000000000000000"){
      tokenHolder = elfFromOwnerOf
      elfStatus = "unstaked"
    }
      tokenHolder = tokenHolder.toLowerCase();
    
    const Elves = Moralis.Object.extend("ElvesAdmin");
    let query = new Moralis.Query(Elves);  
    query.equalTo("token_id", tokenId);
      
    const res = await query.first();
      
      if(res){
        res.set("owner_of", tokenHolder);
        res.set("elf_status", elfStatus)
        res.set("elf_class", elfClass)
        res.set("elf_race", elfRace)
        res.set("elf_hair", elfHair)
        res.set("elf_weapon", elfWeapon)
        res.set("elf_weaponTier", elfWeaponTier)
        res.set("elf_inventory", elfInventory)
        res.set("elf_accessories", elfAccessories)
        res.set("elf_level", elfLevel)
        res.set("elf_ap", elfAp)
        res.set("elf_hp", elfHp)
        res.set("elf_action", elfAction)
        res.set("elf_timestamp", timestamp)
        res.set("chain", "eth")
        res.save().then((elf)=>{
        // Execute any logic that should take place after the object is saved.
        logger.info('Object updated with objectId: ' + elf.id );
      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        logger.info('Failed to update object, with error code: ' + error.message);
      });
      } 
    }
      
    });
    
    
    Moralis.Cloud.afterSave("ElfActionsPolygon", async(request) =>{
    logger.info("POLY Action Ping...");
    
    const tokenId = parseInt(request.object.get("tokenId"));
    const confirmed = request.object.get("confirmed");   
    const chain = "polygon"   
    
      
    if(confirmed){
      
    const elf = await polyElves.methods.elves(tokenId).call();
    const elfOwner = await polyElves.methods.ownerOf(tokenId).call();
    const elfAttributes = await polyElves.methods.attributes(tokenId).call();
    const elfTokenURI = await polyElves.methods.tokenURI(tokenId).call();
    
    let b = elfTokenURI.split(",")
    const elfTokenObj = JSON.parse(atob(b[1]))  
    
    const elfClass = elfTokenObj.attributes[0].value
    const elfRace = elfTokenObj.attributes[1].value 
    const elfHair = elfTokenObj.attributes[2].value
    const elfWeapon = elfTokenObj.attributes[3].value
    const elfWeaponTier = elfTokenObj.attributes[4].value 
    const elfAccessories = elfTokenObj.attributes[5].value
    const elfLevel = elfTokenObj.attributes[6].value
    const elfAp = elfTokenObj.attributes[7].value
    const elfHp = elfTokenObj.attributes[8].value
    const elfInventory = elfAttributes.inventory
    const elfAction = elf.action
    const timestamp = elf.timestamp
     
    const Elves = Moralis.Object.extend("ElvesAdmin");
    let query = new Moralis.Query(Elves);  
    query.equalTo("token_id", tokenId);
      
    const res = await query.first();
      
      if(res){
        res.set("elf_class", elfClass)
        res.set("elf_race", elfRace)
        res.set("elf_hair", elfHair)
        res.set("elf_weapon", elfWeapon)
        res.set("elf_weaponTier", elfWeaponTier)
        res.set("elf_inventory", elfInventory)
        res.set("elf_accessories", elfAccessories)
        res.set("elf_level", elfLevel)
        res.set("elf_ap", elfAp)
        res.set("elf_hp", elfHp)
        res.set("elf_action", elfAction)
        res.set("elf_timestamp", timestamp)
        res.set("chain", "polygon")
        res.save().then((elf)=>{
        // Execute any logic that should take place after the object is saved.
        logger.info('Object updated with objectId: ' + elf.id );
      }, (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        logger.info('Failed to update object, with error code: ' + error.message);
      });
      } 
    }
      
    });
    
    