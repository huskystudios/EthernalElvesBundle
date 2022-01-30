const web3 = Moralis.web3ByChain("0x1"); // Mainnet
const logger = Moralis.Cloud.getLogger();
logger.info("Cloudfunction is online captain...");

// //Global Variables////////////////////////////
const validator = "pk";

const elvesAddress = "0xA351B769A01B445C04AA1b8E6275e03ec05C1E75";
const elvesABI = [];
const elves = new web3.eth.Contract(elvesABI, elvesAddress);

const campaignsAddress = "0x367Dd3A23451B8Cc94F7EC1ecc5b3db3745D254e";
const campaignsABI = [];
const campaigns = new web3.eth.Contract(campaignsABI, campaignsAddress);


// //////////////////////////////////////////////////
// ////Start Whitelist Code/////////////////////////
// ////////////////////////////////////////////////
Moralis.Cloud.define("signMessage", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    // get whitelist object from database
    const Elves = Moralis.Object.extend("ElvesWhitelist");
    let query = new Moralis.Query(Elves);

    const walletAddress = request.params.wallet;
    const oauthData = request.params.oauthData;

    const fetchResponse = await Moralis.Cloud.httpRequest({

        method: 'GET',
        url: 'https://discord.com/api/users/@me/guilds/914739959271944233/member',
        headers: {

            'Content-Type': 'application/json;charset=utf-8',
            'authorization': `${
                oauthData.token_type
            } ${
                oauthData.access_token
            }`

        }

    }).then(function (httpResponse) {



        let dataObj = httpResponse.data;

        dataObj = JSON.stringify(dataObj);
        dataObj = JSON.parse(dataObj);

        const roleIds = dataObj.roles;
        const WLroles = {

            "sentinel": "923088191353937940",
            "whitelist": "923088451887304704",
            "ogwhitelist": "923088235465437205"

        };

        let roleForMint = 5;
        let roleForMintName = "No Role";

        roleIds.map((roleid) => {



            if (roleid === WLroles.whitelist) {

                roleForMintName = "Whitelist";
                roleForMint = 2;

            }
            if (roleid === WLroles.ogwhitelist) {

                roleForMintName = "OG Whitelist";
                roleForMint = 1;

            }
            if (roleid === WLroles.sentinel) {

                roleForMintName = "SENTINEL OG Whitelist";
                roleForMint = 0;

            }



        });

        const roles = {

            roleName: roleForMintName,
            roleIndex: roleForMint,
            username: dataObj.user.username,
            userId: dataObj.user.id

        };
        return roles;



    }, function (httpResponse) {

        logger.info('Request failed with response code ' + httpResponse.status);

    });
    const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
    const solidhash = web3.utils.soliditySha3(checkSumAddress, parseInt(fetchResponse.roleIndex));
    // Role and Wallet being passed to hashing function
    const signedTransaction = await web3.eth.accounts.sign(solidhash, validator);

    let response = {

        r: fetchResponse.roleIndex,
        n: fetchResponse.roleName,
        s: "***check back after we lock up server roles***", // signedTransaction.signature, CHANGE THIS
        w: checkSumAddress,
        username: fetchResponse.username,
        userId: fetchResponse.userId,
        message: "first call",
        // debug:fetchResponse,
        // debig1:signedTransaction

    };


    query.equalTo("discordUserId", fetchResponse.userId);
    const res = await query.first();

    if (! res) {

        const elvesObject = new Elves();
        elvesObject.set("discordUserId", fetchResponse.userId);
        elvesObject.set("walletAddress", checkSumAddress);
        elvesObject.set("signature", signedTransaction.signature);
        elvesObject.set("roleIndex", fetchResponse.roleIndex);
        elvesObject.set("roleName", fetchResponse.roleName);
        elvesObject.set("username", fetchResponse.username);
        elvesObject.save();
        return response;



    } else { // /LOCK THIS UP
        res.set("discordUserId", fetchResponse.userId);
        res.set("walletAddress", checkSumAddress);
        res.set("signature", signedTransaction.signature);
        res.set("roleIndex", fetchResponse.roleIndex);
        res.set("roleName", fetchResponse.roleName);
        res.set("username", fetchResponse.username);
        res.save();
        /*
    //from database
      response = {
      r:res.attributes.roleIndex, 
      n:res.attributes.roleName, 
      s:res.attributes.signature, 
      w:res.attributes.walletAddress,
      username: res.attributes.username,
      userId: res.attributes.userId,
      message: "from database"
    }*/

        return response;

    }



});
// ///////////////////////FOR MINT CREDS/////////////////////////////////////
Moralis.Cloud.define("getSigDatabase", async (request) => {



    const Elves = Moralis.Object.extend("ElvesWhitelist");
    let query = new Moralis.Query(Elves);

    const walletAddress = request.params.wallet;

    const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);

    query.equalTo("walletAddress", checkSumAddress);

    const res = await query.first();

    const error = {

        error: "Not on the list, contact devs on discord"

    };

    if (res) {



        return response = {

            r: res.attributes.roleIndex,
            n: res.attributes.roleName,
            s: res.attributes.signature,
            w: res.attributes.walletAddress,
            username: res.attributes.username,
            userId: res.attributes.userId,
            message: "from husky with love"

        };

    } else {

        return error;

    }





});
// //////////////////Add to Whitelist Manually/////////////////
Moralis.Cloud.define("addToWhitelist", async (request) => {



    const Elves = Moralis.Object.extend("ElvesWhitelist");
    let query = new Moralis.Query(Elves);

    const walletAddress = request.params.wallet;
    const roleIndex = request.params.roleIndex;
    const username = request.params.username;
    let roleName;
    if (parseInt(roleIndex) === 2) {

        roleName = "Whitelist";

    }
    if (parseInt(roleIndex) === 1) {

        roleName = "OG Whitelist";

    }
    if (parseInt(roleIndex) === 0) {

        roleName = "SENTINEL OG Whitelist";

    }

    const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
    const solidhash = web3.utils.soliditySha3(checkSumAddress, parseInt(roleIndex));
    // Role and Wallet being passed to hashing function
    const signedTransaction = await web3.eth.accounts.sign(solidhash, validator);

    query.equalTo("walletAddress", checkSumAddress);
    const res = await query.first();
    let response = "Nothing happened";

    if (! res) {

        const elvesObject = new Elves();
        elvesObject.set("walletAddress", checkSumAddress);
        elvesObject.set("signature", signedTransaction.signature);
        elvesObject.set("roleIndex", parseInt(roleIndex));
        elvesObject.set("roleName", roleName);
        elvesObject.set("username", username);
        response = await elvesObject.save().then((monster) => { // Execute any logic that should take place after the object is saved.
            return monster.id;



        }, (error) => {

            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            return error.message;

        });





    } else { // /LOCK THIS UP
        res.set("walletAddress", checkSumAddress);
        res.set("signature", signedTransaction.signature);
        res.set("roleIndex", parseInt(roleIndex));
        res.set("roleName", roleName);
        res.set("username", username);
        res.save().then((monster) => { // Execute any logic that should take place after the object is saved.
            return monster.id;

        }, (error) => {

            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            return error.message;

        });

    }

    return(response);



});
// //////////////////CHECK Whitelist/////////////////
Moralis.Cloud.define("checkWhitelist", async (request) => {



    const Elves = Moralis.Object.extend("ElvesWhitelist");
    let query = new Moralis.Query(Elves);

    const walletAddress = request.params.wallet;
    const checkSumAddress = await web3.utils.toChecksumAddress(walletAddress);
    logger.info(checkSumAddress, "tried to check wl");
    query.equalTo("walletAddress", checkSumAddress);
    const res = await query.first();

    let response;
    if (res) {



        response = {

            message: `on the list with role ${
                res.attributes.roleName
            }`

        };

    } else {



        response = {

            message: "not on the list"

        };

    }

    return response;

});

// ///////////////////START Dapp Code//////////////////////////

Moralis.Cloud.define("getBalance", async (request) => {

    const balance = request.params.address && await elves.methods.bankBalances(request.params.address).call();
    return balance;

});

Moralis.Cloud.define("getTokenSupply", async (request) => {



    let currentSupply;
    let maxSupply;
    let initialSupply;
    let mintPrice;
    let error;

    try {

        currentSupply = await elves.methods.totalSupply().call();

    } catch (e) {

        error = e;

    }
    try {

        maxSupply = await elves.methods.maxSupply().call();

    } catch (e) {

        error = e;

    }
    try {

        initialSupply = await elves.methods.INIT_SUPPLY().call();

    } catch (e) {

        error = e;

    }
    try {

        mintPrice = await elves.methods.getMintPriceLevel().call();

    } catch (e) {

        error = e;

    }


    return {

        supply: currentSupply,
        maxSupply: maxSupply,
        initialSupply: initialSupply,
        mintPrice: mintPrice.mintCost,
        error: error

    };

});

Moralis.Cloud.define("getCampaigns", async (request) => {

    const camps = await campaigns.methods.camps(request.params.id).call();

    return camps;

});

Moralis.Cloud.define("getElvesFromDb", async (request) => {



    const Elves = Moralis.Object.extend("Elves");
    let query = new Moralis.Query(Elves);

    query.equalTo("owner_of", request.params.address.toLowerCase());

    const results = await query.find();
    const tokenArr = [];

    results.map((elf) => {

        tokenArr.push(elf.attributes.token_id);

    });

    return tokenArr;

});

Moralis.Cloud.afterSave("ElfTransfers", async (request) => {



    const tokenId = parseInt(request.object.get("tokenId"));
    const elf = await elves.methods.elves(tokenId).call();
    const elfOwner = await elves.methods.ownerOf(tokenId).call();

    let elfFromOwnerOf = elfOwner.toLowerCase(); // actual owner
    let elfFromElves = elf.owner.toLowerCase(); // recorded owner
    let tokenHolder = elfFromElves;

    if (elfFromElves === "0x0000000000000000000000000000000000000000") {

        tokenHolder = elfFromOwnerOf;

    }
    tokenHolder = tokenHolder.toLowerCase();

    const Elves = Moralis.Object.extend("Elves");
    let query = new Moralis.Query(Elves);
    query.equalTo("token_id", tokenId);
    const res = await query.first();

    if (! res) {

        const elvesObject = new Elves();
        elvesObject.set("owner_of", tokenHolder);
        elvesObject.set("token_id", tokenId);
        elvesObject.save().then((elf) => { // Execute any logic that should take place after the object is saved.
            logger.info('Object created with objectId: ' + elf.id);

        }, (error) => {

            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            logger.info('Failed to create new object, with error code: ' + error.message);

        });

    } else {

        res.set("owner_of", tokenHolder);
        res.save().then((elf) => { // Execute any logic that should take place after the object is saved.
            logger.info('Object updated with objectId: ' + elf.id);

        }, (error) => {

            // Execute any logic that should take place if the save fails.
            // error is a Moralis.Error with an error code and message.
            logger.info('Failed to update object, with error code: ' + error.message);

        });

    }





});

Moralis.Cloud.define("getGameStatus", async (request) => {



    let gameActive;
    let wlMint;
    let publicMint;
    let error;

    try {

        gameActive = await elves.methods.isGameActive().call();

    } catch (e) {

        error = e;

    }
    try {

        wlMint = await elves.methods.isWlOpen().call();

    } catch (e) {

        error = e;

    }
    try {

        publicMint = await elves.methods.isMintOpen().call();

    } catch (e) {

        error = e;

    }

    return {gameActive: gameActive, wlMint: wlMint, publicMint: publicMint, error: error};

});


Moralis.Cloud.define("getSignature", async (request) => {





    const checkSumAddress = await web3.utils.toChecksumAddress(request.params.address);
    const solidhash = web3.utils.soliditySha3(checkSumAddress, parseInt(request.params.roleIndex));

    const signedTransaction = await web3.eth.accounts.sign(solidhash, validator);

    return signedTransaction.signature;

});
