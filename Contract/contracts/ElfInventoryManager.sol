// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

import "./DataStructures.sol";
import "hardhat/console.sol";

contract ElfMetadataHandler {
    using DataStructures for DataStructures.Token;

    address impl_;
    address public manager;
    bool private initialized;

    enum Part {
        race,
        hair,
        primaryWeapon,
        accessories
    }

    mapping(uint8 => address) public race;
    mapping(uint8 => address) public hair;
    mapping(uint8 => address) public primaryWeapon;
    mapping(uint8 => address) public accessories;

    struct Attributes {
        uint8 hair; //MAX 3
        uint8 race; //MAX 6 Body
        uint8 accessories; //MAX 7
        uint8 sentinelClass; //MAX 3
        uint8 weaponTier; //MAX 6
        uint8 inventory; //MAX 7
    }

    string public constant header =
        '<svg id="elf" width="100%" height="100%" version="1.1" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    string public constant footer =
        "<style>#elf{shape-rendering: crispedges; image-rendering: -webkit-crisp-edges; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; image-rendering: pixelated; -ms-interpolation-mode: nearest-neighbor;}</style></svg>";

   
    //initialize function
    function initialize() public {
        require(!initialized, "Already initialized");
        manager = msg.sender;
        initialized = true;
    }
   
    function getSVG(
        uint8 race_,
        uint8 hair_,
        uint8 primaryWeapon_,
        uint8 accessories_
    ) public view returns (string memory) {
      
    
        return
            string(
                abi.encodePacked(
                    header,
                    get(Part.race, race_),
                    get(Part.hair, hair_),
                    primaryWeapon_ == 69 ? "" : get(Part.primaryWeapon, primaryWeapon_),                    
                    get(Part.accessories, accessories_),
                    footer
                )
            );
    }

    function getTokenURI(uint16 id_, uint256 sentinel)
        external
        view
        returns (string memory)
    {
        DataStructures.Token memory token = DataStructures.getToken(sentinel);
         //console.log( token.primaryWeapon);
         //console.log( token.weaponTier);

        string memory svg = Base64.encode(
            bytes(
                getSVG(
                    token.race,
                    token.hair,
                    token.primaryWeapon,
                    token.accessories
                )
            )
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"Elf #',
                                toString(id_),
                                '", "description":"EthernalElves is a collection of 6666 Sentinel Elves racing to awaken the Elders. With no IPFS or API, these Elves a 100% on-chain. Play EthernalElves to upgrade your abilities and grow your army. !onward", "image": "',
                                "data:image/svg+xml;base64,",
                                svg,
                                '",',
                                getAttributes(
                                    token.race,
                                    token.hair,
                                    token.primaryWeapon,
                                    token.accessories,
                                    token.level,
                                    token.healthPoints,
                                    token.attackPoints,
                                    token.sentinelClass,
                                    token.weaponTier
                                ),
                                "}"
                            )
                        )
                    )
                )
            );
    }

    /*///////////////////////////////////////////////////////////////
                    INVENTORY MANAGEMENT
    //////////////////////////////////////////////////////////////*/

    function setRace(uint8[] calldata ids, address source) external {
        require(msg.sender == manager, "Not authorized");

        for (uint256 index = 0; index < ids.length; index++) {
            race[ids[index]] = source;
        }
    }

    function setHair(uint8[] calldata ids, address source) external {
        require(msg.sender == manager, "Not authorized");

        for (uint256 index = 0; index < ids.length; index++) {
            hair[ids[index]] = source;
        }
    }

    function setWeapons(uint8[] calldata ids, address source) external {
        require(msg.sender == manager, "Not authorized");

        for (uint256 index = 0; index < ids.length; index++) {
            primaryWeapon[ids[index]] = source;
        }
    }

    function setAccessories(uint8[] calldata ids, address source) external {
        require(msg.sender == manager, "Not authorized");

        for (uint256 index = 0; index < ids.length; index++) {
            accessories[ids[index]] = source;
        }
    }

    /*///////////////////////////////////////////////////////////////
                    INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function call(address source, bytes memory sig)
        internal
        view
        returns (string memory svg)
    {
        (bool succ, bytes memory ret) = source.staticcall(sig);
        require(succ, "failed to get data");

        svg = abi.decode(ret, (string));
       
    }

    function get(Part part, uint8 id)
        internal
        view
        returns (string memory data_)
    {   
       
        
        address source = part == Part.race ? race[id]
        : part == Part.hair ? hair[id]
        : part == Part.primaryWeapon ? primaryWeapon[id] : accessories[id];
        
        data_ = wrapTag(call(source, getData(part, id)));
         
        return data_;
    }

    function wrapTag(string memory uri) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<image x="1" y="1" width="160" height="160" image-rendering="pixelated" preserveAspectRatio="xMidYMid" xlink:href="data:image/png;base64,',
                    uri,
                    '"/>'
                )
            );
    }

    function getData(Part part, uint8 id)
        internal
        pure
        returns (bytes memory data)
    {
        string memory s = string(
            abi.encodePacked(
                part == Part.race ? "race" 
                    : part == Part.hair ? "hair"
                    : part == Part.primaryWeapon ? "weapon"
                    : "accessories",
                toString(id),
                "()"
            )
        );

        return abi.encodeWithSignature(s, "");
    }

     function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function getAttributes(
        uint8 race_,
        uint8 hair_,
        uint8 primaryWeapon_,
        uint8 accessories_,
        uint8 level_,
        uint8 healthPoints_,
        uint8 attackPoints_,
        uint8 sentinelClass_,
        uint8 weaponTier_
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '"attributes": [',
                    getClassAttributes(sentinelClass_),
                    ",",
                    getRaceAttributes(race_),
                    ",",
                    getHairAttributes(hair_),
                    ",",
                    getPrimaryWeaponAttributes(primaryWeapon_, weaponTier_),
                    ",",
                    getAccessoriesAttributes(accessories_),
                    ',{"trait_type": "Level", "value":',
                    toString(level_),
                    '},{"display_type": "boost_number","trait_type": "Attack Points", "value":',
                    toString(attackPoints_),
                    '},{"display_type": "boost_number","trait_type": "Health Points", "value":',
                    toString(healthPoints_),
                    "}]"
                )
            );
    }

    function getClassAttributes(uint8 sentinelClass_)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Class","value":"',
                    getClassName(sentinelClass_),
                    '"}'
                )
            );
    }

    function getRaceAttributes(uint8 race_)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Race","value":"',
                    getRaceName(race_),
                    '"}'
                )
            );
    }

    function getHairAttributes(uint8 hair_)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Head","value":"',
                    getHairName(hair_),
                    '"}'
                )
            );
    }

    function getPrimaryWeaponAttributes(uint8 primaryWeapon_, uint8 weaponTier_)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Weapon","value":"',
                    getPrimaryWeapon(primaryWeapon_),
                    '"},{"display_type":"number","trait_type":"Weapon Tier","value":',
                    toString(weaponTier_),
                    "}"
                )
            );
    }

    function getAccessoriesAttributes(uint8 accessory_)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '{"trait_type":"Accessory","value":"',
                    getAccessoriesName(accessory_),
                    '"}'
                )
            );
    }

    function getTier(uint16 id) internal pure returns (uint16) {
        if (id > 40) return 100;
        if (id == 0) return 0;
        return ((id - 1) / 4);
    }

   /*
   JANKY
    function getWeaponTier(uint16 id) internal pure returns (uint16) {
        
        if (id == 0) return 0;
        
        if (id <= 15){
            id = id/15 + 1;
        }
        if (id >= 15 && id <= 30){
            id = (id-15)/15 + 1;
        }
        if (id >= 30 && id <= 45){
            id = (id-30)/15 + 1;
        }
        
        
        return (id);
    }
    */

   
    function getClassName(uint8 id)
        public
        pure
        returns (string memory className)
    {
        className = id == 0 ? "Druid" : id == 1 ? "Assassin" : "Ranger";
    }

    function getRaceName(uint8 id)
        public
        pure
        returns (string memory raceName)
    {   
        //Dont you just fucking love modulus? 
        id = id % 4 + 1;
        raceName = id == 2 ? "Darkborne" : id == 3 ? "Lightborne" : id == 4 ? "Primeborne" : "Woodborne";
       
    }

    function getHairName(uint8 id)
        public
        pure
        returns (string memory hairName)
    {
        ///create a binary search for the hair name from ids 1 to 9
        hairName = id == 1 ? "Short" : id == 2 ? 
        "Medium" : id == 3 ? "Long" : id == 4 ? "Bald" : id == 5 ? 
        "Short" : id == 6 ? "Medium" : id == 7 ? "Long" : id == 8 ? 
        "Bald" : "Medium";

    }

    function getPrimaryWeapon(uint8 id) public pure returns (string memory) {
        if(id == 69){
            return "Fist";
        }
        if (id < 20) {
            if (id < 10) {
                if (id < 5) {
                    if (id < 3) {
                        return id == 1 ? "Pickaxe" : "Nothing";
                    }
                    return id == 3 ? "Club" : "Pleb Staff";
                }
                if (id < 7) return id == 5 ? "Short Sword +1" : "Dagger +1";
                return
                    id == 7 ? "Simple Axe +1" : id == 8
                        ? "Fiery Poker +1"
                        : "Large Axe +2";
            }
            if (id <= 15) {
                if (id < 13) {
                    return
                        id == 10 ? "Iron Hammer +2" : id == 11
                            ? "Iron Mace +2"
                            : "Jagged Axe +2";
                }
                return
                    id == 13 ? "Enchanted Poker +3" : id == 14
                        ? "Curved Sword +3"
                        : "Ultra Mallet +3";
            }
            if (id < 18)
                return id == 16 ? "Disciple Staff +3" : "Assassin Blade +4";
            return id == 18 ? "Swamp Staff +4" : "Simple Wand +4";
        }

        if (id < 30) {
            if (id < 25) {
                if (id < 23) {
                    return
                        id == 20 ? "Royal Blade +4" : id == 21
                            ? "Skull Shield +5"
                            : "Skull Crusher Axe +5";
                }
                return id == 23 ? "Flaming Staff +5" : "Flaming Royal Blade +5";
            }

            if (id < 27)
                return id == 25 ? "Berserker Sword +6" : "Necromancer Staff +6";
            return
                id == 27 ? "Flaming Skull Shield +6" : id == 28
                    ? "Frozen Scythe +6"
                    : "Blood Sword +7";
        }
        if (id <= 35) {
            if (id < 33) {
                return
                    id == 30 ? "Dark Lord Staff +7" : id == 31
                        ? "Bow of Artemis +7"
                        : "Ice Sword +7";
            }
            return
                id == 33 ? "Cryptic Staff +8" : id == 34
                    ? "Nether Lance +8"
                    : "Demonic Axe +8";
        }

        if (id <= 40) {
            if (id < 39) {
                return
                    id == 36 ? "Royal Blade +4" : id == 37
                        ? "Skull Shield +5"
                        : "Skull Crusher Axe +5";
            }
            return id == 39 ? "Flaming Staff +5" : "Flaming Royal Blade +5";
        }
        if (id <= 45) {
            if (id < 44) {
                return
                    id == 41 ? "Royal Blade +4" : id == 42
                        ? "Skull Shield +5"
                        : "Skull Crusher Axe +43";
            }
            return id == 44 ? "Flaming Staff +5" : "Flaming Royal Blade +45";
        }
    }

    function getAccessoriesName(uint8 id) public pure returns (string memory) {
        if (id < 20) {
            if (id < 10) {
                if (id < 5) {
                    if (id < 3) {
                        return id == 1 ? "None" : "None";
                    }
                    return id == 3 ? "None" : "None";
                }
                if (id < 7)
                    return
                        id == 5 ? "Wooden Shield +1" : "Paper Hands Shield +1";
                return
                    id == 7 ? "Dagger +1" : id == 8
                        ? "Pirate Hook +1"
                        : "Offhand Axe +2";
            }
            if (id <= 15) {
                if (id < 13) {
                    return
                        id == 10 ? "Offhand Slasher +2" : id == 11
                            ? "Large Shield +2"
                            : "Bomb +2";
                }
                return
                    id == 13 ? "Offhand Poker +3" : id == 14
                        ? "Reinforced Shield +3"
                        : "War Banner +3";
            }
            if (id < 18)
                return id == 16 ? "Hand Cannon +3" : "Metal Kite Shield +4";
            return id == 18 ? "Crossbow +4" : "Cursed Skull +4";
        }

       
       
        
    }
}

/// @title Base64
/// @author Brecht Devos - <brecht@loopring.org>
/// @notice Provides a function for encoding some bytes in base64
/// @notice NOT BUILT BY ETHERNAL ELVES TEAM.
library Base64 {
    string internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // load the table into memory
        string memory table = TABLE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)

            // prepare the lookup table
            let tablePtr := add(table, 1)

            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))

            // result ptr, jump over length
            let resultPtr := add(result, 32)

            // run over the input, 3 bytes at a time
            for {

            } lt(dataPtr, endPtr) {

            } {
                dataPtr := add(dataPtr, 3)

                // read 3 bytes
                let input := mload(dataPtr)

                // write 4 characters
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
                mstore(
                    resultPtr,
                    shl(248, mload(add(tablePtr, and(input, 0x3F))))
                )
                resultPtr := add(resultPtr, 1)
            }

            // padding with '='
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }

        return result;
    }
}
