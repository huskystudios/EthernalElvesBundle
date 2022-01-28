// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "../ERC721.sol"; 
import "../DataStructures.sol";
import "../Interfaces.sol";
import "hardhat/console.sol"; ///REMOVE BEFORE DEPLOYMENT

// We are the Ethernal. The Ethernal Elves         
// Written by 0xHusky & Beff Jezos. Everything is on-chain for all time to come.
// Version 0.0.9

//Race conditions: reentrancy: always make your state changes before transferring ether.

contract EthernalElvesX is ERC721 {

    function name() external pure returns (string memory) { return "Ethernal Elves"; }
    function symbol() external pure returns (string memory) { return "ELVx"; }
       
    using DataStructures for DataStructures.ActionVariables;
    using DataStructures for DataStructures.Elf;

    IElfMetaDataHandler elfmetaDataHandler;
    ICampaigns campaigns;
    IERC20Lite public ren;
    
    
//STATE
   

    bool public isGameActive;
    bool public isMintOpen;
    bool public isWlOpen;
    bool private initialized;

    address dev1Address;//Husky
    address dev2Address;//Beff
    address terminus;
    uint256 public INIT_SUPPLY; 
    uint256 public price;
    bytes32 internal ketchup;

    mapping(uint256 => uint256) public sentinels; //memory slot for Elfs
    mapping(address => uint256) public bankBalances; //memory slot for bank balances
    mapping(address => bool)    public auth;
    mapping(address => uint16)  public whitelist; //memory slot for whitelist and roles

    ////////////////////////////////////////////////////////////////////
    //
    //
    //
    //
    ////////////////////////////////////////////////////////////////////
    function sentinelClass(uint256 _id) external view returns(uint256 sentinelClass) {    
    uint256 character = sentinels[_id];
    sentinelClass = uint256(uint8(character>>248))/100 % 10;
    }


    function initialize(address _dev1Address, address _dev2Address) public {
    
       require(!initialized);
       admin                = msg.sender;   
       dev1Address          = _dev1Address;
       dev2Address          = _dev2Address;
       maxSupply            = 200; //6666
       INIT_SUPPLY          = 96; //3000
       initialized          = true;
       price                = .055 ether;   //CHANGE to .088!!
       
    }

    function setAddresses(address _ren, address _inventory, address _campaigns)  public {
       onlyOwner();
       ren                  = IERC20Lite(_ren);
       elfmetaDataHandler   = IElfMetaDataHandler(_inventory);
       campaigns            = ICampaigns(_campaigns);
    }
    
    function setTerminus(address _terminus)  public {
       onlyOwner();
       terminus             = _terminus;
    }

    function setAuth(address[] calldata adds_, bool status) public {
       onlyOwner();
       
        for (uint256 index = 0; index < adds_.length; index++) {
            auth[adds_[index]] = status;
        }
    }

//EVENTS

    event Action(address indexed from, uint256 indexed action, uint256 indexed tokenId);         
    event BalanceChanged(address indexed owner, uint256 indexed amount, bool indexed subtract);
        
//MINT

function whitelistMint(uint256 qty) public payable  {

    isPlayer();
    require(isWlOpen);
    require(whitelist[msg.sender] > 0); //not on whitelist
    //Checkpoint to stop whitelist from minting more than the initial supply
    require(INIT_SUPPLY <= totalSupply);
    require(qty > 0 && qty <= 2); //max 2
    
    //Role:1 SOG 2 free 
    //Role:2 OG 1 free 1 paid
    //Role:3 2 WL paid

    address whitelistAddress = msg.sender;
    uint256 role = whitelist[whitelistAddress];
    uint256 amount = msg.value;
    
    whitelist[whitelistAddress] = 0; //reset role

        if(role == 1){
            
           for (uint i = 0; i < qty; i++) {
                _mintElf(whitelistAddress);
            }

        }else if(role == 2){
            
            require(amount >= price * qty/2, "NotEnoughEther");
            for (uint i = 0; i < qty; i++) {
                _mintElf(whitelistAddress);
            }

        }else if(role == 3){
             require(amount >= price * qty, "NotEnoughEther");
             for (uint i = 0; i < qty; i++) {
                _mintElf(whitelistAddress);
             }

        }else if(role == 0){
            revert();
        }

    }


    function mint() external payable  returns (uint256 id) {
        isPlayer();
        require(isMintOpen);
        uint256 cost;
        (cost,) = _getMintPriceLevel();
        
        if (totalSupply <= INIT_SUPPLY) {            
             require(msg.value >= cost);
        }else{
            bankBalances[msg.sender] >= cost ? _setAccountBalance(msg.sender, cost, true) :  ren.burn(msg.sender, cost);
        }

        return _mintElf(msg.sender);

    }

//GAMEPLAY//

    function unStake(uint256[] calldata ids) external  {
          isPlayer();        

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 0, msg.sender, 0, 0, false, false, false, 0);
          }
    }

    function sendCampaign(uint256[] calldata ids, uint256 campaign_, uint256 sector_, bool rollWeapons_, bool rollItems_, bool useitem_) external {
          isPlayer();          

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, msg.sender, campaign_, sector_, rollWeapons_, rollItems_, useitem_, 1);
          }
    }

    function bloodThirst(uint256[] calldata ids, uint256 campaign_, uint256 sector_) external {
          isPlayer();          

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, msg.sender, campaign_, sector_, false, false, false, 2);
          }
    }

    function rampage(uint256[] calldata ids, uint256 campaign_, uint256 sector_) external {
          isPlayer();          

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 2, msg.sender, campaign_, sector_, true, true, false, 3);
          }
    }

    function passive(uint256[] calldata ids) external {
          isPlayer();         

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 3, msg.sender, 0, 0, false, false, false, 0);
          }
    }

    function returnPassive(uint256[] calldata ids) external  {
          isPlayer();        

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 4, msg.sender, 0, 0, false, false, false, 0);
          }
    }

    function forging(uint256[] calldata ids) external payable {
          isPlayer();         
        
          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 5, msg.sender, 0, 0, false, false, false, 0);
          }
    }

    function merchant(uint256[] calldata ids) external payable {
          isPlayer();   

          for (uint256 index = 0; index < ids.length; index++) {  
            _actions(ids[index], 6, msg.sender, 0, 0, false, false, false, 0);
          }

    }

    function heal(uint256 healer, uint256 target) external {
        isPlayer();
        _actions(healer, 7, msg.sender, target, 0, false, false, false, 0);
    }    


    function withdrawTokenBalance() external {
      
        require(bankBalances[msg.sender] > 0);
        ren.mint(msg.sender, bankBalances[msg.sender]); 
        bankBalances[msg.sender] = 0;

    }

//INTERNALS
    
        function _mintElf(address _to) private returns (uint16 id) {
        
            uint256 rand = _rand();
          
            
            {        
                DataStructures.Elf memory elf;
                id = uint16(totalSupply + 1);   
                        
                elf.owner = address(0);
                elf.timestamp = block.timestamp;
                
                elf.action = elf.weaponTier = elf.inventory = elf.primaryWeapon = 0;

                (,elf.level) = _getMintPriceLevel();

                elf.sentinelClass = uint16(_randomize(rand, "Class", id)) % 3;
                
                elf.race = rand % 100 > 97 ? 3 : uint16(_randomize(rand, "Race", id)) % 3;//////Make 3:woodborne more rare. 

                elf.hair = elf.race == 3 ? 0 : uint16(_randomize(rand, "Hair", id)) % 3;/// 0:brown white dark

                elf.accessories = uint16(_randomize(rand, "Accessories", id)) % 2; //2 accessories MAX 7 

                uint256 _traits = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
                uint256 _class =  DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
                
                elf.healthPoints = DataStructures.calcHealthPoints(elf.sentinelClass, elf.level);
                elf.attackPoints = DataStructures.calcAttackPoints(elf.sentinelClass, elf.weaponTier); 

            sentinels[id] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, _traits, _class);
            
            }
                
            _mint(_to, id);           

        }


        function _actions(
            uint256 id_, 
            uint action, 
            address elfOwner, 
            uint256 campaign_, 
            uint256 sector_, 
            bool rollWeapons, 
            bool rollItems, 
            bool useItem, 
            uint256 gameMode_) 
        
        private {

            DataStructures.Elf memory elf = DataStructures.getElf(sentinels[id_]);
            DataStructures.ActionVariables memory actions;

            require(ownerOf[id_] == msg.sender || elf.owner == msg.sender);

            uint256 rand = _rand();
                
                if(action == 0){//Unstake if currently staked

                    require(ownerOf[id_] == address(this));
                    require(elf.timestamp < block.timestamp);

                    _transfer(address(this), elfOwner, id_);      

                    elf.owner = address(0);                            

                }else if(action == 2){//campaign loop - bloodthirst and rampage mode loop.

                    require(elf.timestamp < block.timestamp);
            
                        if(ownerOf[id_] != address(this)){
                        _transfer(elfOwner, address(this), id_);
                        elf.owner = elfOwner;
                        }
 
                    (elf.level, actions.reward, elf.timestamp, elf.inventory) = campaigns.gameEngine(campaign_, sector_, elf.level, elf.attackPoints, elf.healthPoints, elf.inventory, useItem);
                    
                    uint256 options;
                    if(rollWeapons && rollItems){
                        options = 3;
                        }else if(rollWeapons){
                        options = 1;
                        }else if(rollItems){
                        options = 2;
                        }else{
                        options = 0;
                    }
                  
                    if(options > 0){
                       (elf.weaponTier, elf.primaryWeapon, elf.inventory) 
                                    = rollWeapons ? DataStructures.roll(elf.level, sector_, _rand(), options, elf.weaponTier, elf.primaryWeapon, elf.inventory) 
                                    : (elf.weaponTier, elf.primaryWeapon, elf.inventory);
                    }
                    
                    if(gameMode_ == 1 || gameMode_ == 2) _setAccountBalance(msg.sender, actions.reward, false);
                    if(gameMode_ == 3) elf.level = elf.level + 1;

                
                }else if(action == 3){//passive campaign

                    require(elf.timestamp < block.timestamp);
                    
                        if(ownerOf[id_] != address(this)){
                            _transfer(elfOwner, address(this), id_);
                            elf.owner = elfOwner;
                         
                        }

                    elf.timestamp = block.timestamp; //set timestamp to current block time

                }else if(action == 4){///return from passive mode
                    
                    require(elf.action == 3);                    

                    actions.timeDiff = (block.timestamp - elf.timestamp) / 1 days; //set timestamp to current block time
                    
                    elf.level = elf.level + (actions.timeDiff * 2);
                    actions.reward = actions.timeDiff > 0 ? actions.timeDiff * 9/10 : 0;
                    actions.reward = actions.reward + 10;
                    
                    actions.reward = actions.reward * 1 ether; 
                    
                    actions.reward = actions.reward > 1000 ether ? 1000 ether : actions.reward;
                    elf.level = elf.level > 100 ? 100 : elf.level;

                    _setAccountBalance(msg.sender, actions.reward, false);
                
                }else if(action == 5){//forge loop for weapons
                   
                    require(msg.value >= .001 ether);                        
                    (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(elf.level, 0, rand, 1, elf.weaponTier, elf.primaryWeapon, elf.inventory);
                    
                
                }else if(action == 6){//item or merchant loop
                   
                    require(msg.value >= .001 ether); 
                    (elf.weaponTier, elf.primaryWeapon, elf.inventory) = DataStructures.roll(elf.level, 0, rand, 2, elf.weaponTier, elf.primaryWeapon, elf.inventory);                      

                }else if(action == 7){//healing loop

                    // require(druid.sentinelClass == 0); CHANGE THIS!!!
                
                    elf.timestamp = block.timestamp + (12 hours);

                    elf.level = elf.level + 1;
                    
                    {   

                        DataStructures.Elf memory hElf = DataStructures.getElf(sentinels[campaign_]);//using the campaign varialbe for elfId here.
                   
                                if(block.timestamp < hElf.timestamp){

                                        actions.timeDiff = hElf.timestamp - block.timestamp;
                
                                        actions.timeDiff = actions.timeDiff > 0 ? 
                                            
                                            hElf.sentinelClass == 0 ? 
                                                actions.timeDiff : 
                                            hElf.sentinelClass == 1 ? 
                                                actions.timeDiff * 3/4 : 
                                            actions.timeDiff * 1/2
                                        
                                        : actions.timeDiff;
                                        
                                        hElf.timestamp = hElf.timestamp - actions.timeDiff;                        
                                        
                                }
                            
                        actions.traits = DataStructures.packAttributes(hElf.hair, hElf.race, hElf.accessories);
                        actions.class =  DataStructures.packAttributes(hElf.sentinelClass, hElf.weaponTier, hElf.inventory);
                                
                        sentinels[campaign_] = DataStructures._setElf(hElf.owner, hElf.timestamp, hElf.action, hElf.healthPoints, hElf.attackPoints, hElf.primaryWeapon, hElf.level, actions.traits, actions.class);

                }
                }           
             
            actions.traits   = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
            actions.class    = DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
            elf.healthPoints = DataStructures.calcHealthPoints(elf.sentinelClass, elf.level); 
            elf.attackPoints = DataStructures.calcAttackPoints(elf.sentinelClass, elf.weaponTier);  
            elf.level        = elf.level > 100 ? 100 : elf.level; 
            elf.action       = action;

            sentinels[id_] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, actions.traits, actions.class);
            emit Action(msg.sender, action, id_); 
    }

    

    function _setAccountBalance(address _owner, uint256 _amount, bool _subtract) private {
            
            _subtract ? bankBalances[_owner] -= _amount : bankBalances[_owner] += _amount;
            emit BalanceChanged(_owner, _amount, _subtract);
    }

    function _getMintPriceLevel() internal view returns (uint256 mintCost, uint256 mintLevel) {
            
            if (totalSupply <= INIT_SUPPLY) return  (price, 1);
            if (totalSupply < 4500) return  (  30  ether, 3);
            if (totalSupply < 5500) return  (  90  ether, 5);
            if (totalSupply < 6000) return  ( 180  ether, 15);
            if (totalSupply < 6333) return  ( 300  ether, 25);
            if (totalSupply < 6666) return  ( 450  ether, 45);

    }

    function _randomize(uint256 ran, string memory dom, uint256 ness) internal pure returns (uint256) {
    return uint256(keccak256(abi.encode(ran,dom,ness)));}

    function _rand() internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(msg.sender, block.difficulty, block.timestamp, block.basefee, ketchup)));}

//PUBLIC VIEWS
    function tokenURI(uint256 _id) external view returns(string memory) {
    return elfmetaDataHandler.getTokenURI(uint16(_id), sentinels[_id]);
    }

    function attributes(uint256 _id) external view returns(uint hair, uint race, uint accessories, uint sentinelClass, uint weaponTier, uint inventory){
    uint256 character = sentinels[_id];

    uint _traits =        uint256(uint8(character>>240));
    uint _class =         uint256(uint8(character>>248));

    hair           = (_traits / 100) % 10;
    race           = (_traits / 10) % 10;
    accessories    = (_traits) % 10;
    sentinelClass  = (_class / 100) % 10;
    weaponTier     = (_class / 10) % 10;
    inventory      = (_class) % 10; 

}

function getSentinel(uint256 _id) external view returns(uint256 sentinel){
    return sentinel = sentinels[_id];
}

function elves(uint256 _id) external view returns(address owner, uint timestamp, uint action, uint healthPoints, uint attackPoints, uint primaryWeapon, uint level) {

    uint256 character = sentinels[_id];

    owner =          address(uint160(uint256(character)));
    timestamp =      uint(uint40(character>>160));
    action =         uint(uint8(character>>200));
    healthPoints =   uint(uint8(character>>208));
    attackPoints =   uint(uint8(character>>216));
    primaryWeapon =  uint(uint8(character>>224));
    level =          uint(uint8(character>>232));   

}

//Modifiers but as functions. Less Gas
    function isPlayer() internal {    
        uint256 size = 0;
        address acc = msg.sender;
        assembly { size := extcodesize(acc)}
        require((msg.sender == tx.origin && size == 0));
        require(isGameActive);
        ketchup = keccak256(abi.encodePacked(acc, block.coinbase));
    }


    function onlyOwner() internal view {    
        require(admin == msg.sender || auth[msg.sender] == true || dev1Address == msg.sender || dev2Address == msg.sender);
    }

//Bridge and Tunnel Stuff

    function modifyElfDNA(uint256 id, uint256 sentinel) external {
        require (msg.sender == terminus, "not terminus");
        sentinels[id] = sentinel;
    }

    function pull(address owner_, uint256[] calldata ids) external {
        require (msg.sender == terminus, "not terminus"); 
        for (uint256 index = 0; index < ids.length; index++) {
              _transfer(owner_, msg.sender, ids[index]);
        }
        ITerminus(msg.sender).pullCallback(owner_, ids);
    }
    

//ADMIN Only
    function withdrawAll() public {
        onlyOwner();
        uint256 balance = address(this).balance;
        
        uint256 devShare = balance/2;      

        require(balance > 0);
        _withdraw(dev1Address, devShare);
        _withdraw(dev2Address, devShare);
    }

    //Internal withdraw
    function _withdraw(address _address, uint256 _amount) private {

        (bool success, ) = _address.call{value: _amount}("");
        require(success);
    }

    function flipActiveStatus() external {
        onlyOwner();
        isGameActive = !isGameActive;
    }

    function flipMint() external {
        onlyOwner();
        isMintOpen = !isMintOpen;
    }

    function flipWhitelist() external {
        onlyOwner();
        isWlOpen = !isWlOpen;
    }
    
    function setAccountBalance(address _owner, uint256 _amount) public {                
        onlyOwner();
        bankBalances[_owner] += _amount;
    }
 
    function reserve(uint256 _reserveAmount, address _to) public {    
        onlyOwner();        
        for (uint i = 0; i < _reserveAmount; i++) {
            _mintElf(_to);
        }

    }


    function setElfManually(uint id, uint8 _primaryWeapon, uint8 _weaponTier, uint8 _attackPoints, uint8 _healthPoints, uint8 _level, uint8 _inventory) external {
        onlyOwner();
        DataStructures.Elf memory elf = DataStructures.getElf(sentinels[id]);
        DataStructures.ActionVariables memory actions;

        elf.owner           = elf.owner;
        elf.timestamp       = elf.timestamp;
        elf.action          = elf.action;
        elf.healthPoints    = _healthPoints;
        elf.attackPoints    = _attackPoints;
        elf.primaryWeapon   = _primaryWeapon;
        elf.level           = _level;
        elf.weaponTier      = _weaponTier;
        elf.inventory       = _inventory;

        actions.traits = DataStructures.packAttributes(elf.hair, elf.race, elf.accessories);
        actions.class =  DataStructures.packAttributes(elf.sentinelClass, elf.weaponTier, elf.inventory);
                       
        sentinels[id] = DataStructures._setElf(elf.owner, elf.timestamp, elf.action, elf.healthPoints, elf.attackPoints, elf.primaryWeapon, elf.level, actions.traits, actions.class);
        
    }
    
    function addManyToWhitelist(address[] calldata _addr, uint256 _whitelistRole) public {
        onlyOwner();
        
            for (uint256 index = 0; index < _addr.length; index++) {
                whitelist[_addr[index]] = uint16(_whitelistRole);
            }
    }    

}





