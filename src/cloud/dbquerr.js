const query = new Parse.Query("RenTransfers");
const pipeline = [
 
  { group: { objectId: '$subtract', sumOftx: { $sum: "$amount_decimal"  }}},
 
  
];
  
const renAmounts = await query.aggregate(pipeline, { useMasterKey: true })

console.log(renAmounts)


///////////////////////////////

const query = new Parse.Query("Elves");
const pipeline = [
  {project: {token_id: 1, owner_of:1}},
  { group: { objectId: '$owner_of', tokens: { $sum: 1 } } },
];


const ownerCount = await query.aggregate(pipeline, { useMasterKey: true })

console.log(ownerCount)

const query = new Parse.Query("ElfCampaignsActivity");
const pipeline = [
 {project: {campaign:1, sector:1, tokenId:1, block_number:1, createdAt:1}},
 {match: {tokenId: "8"}},
 { sort : { block_number : -1 } },
 { limit: 1 }
 
 
  
];
  
const lastCampaign = await query.aggregate(pipeline, { useMasterKey: true })

console.log(lastCampaign)

//////////////////////

const query = new Parse.Query("Elves");
const pipeline = [
  {project: {elf_class:1, elf_timestamp:1, elf_level:1, token_id:1, elf_weaponTier:1}},
  {match: {elf_class: "Druid", elf_weaponTier: { $gt: 0}, elf_timestamp: { $gt: "1644728688"}}},
  {sort: {token_id: -1}}
  //{ group: { objectId: '$owner_of', tokens: { $sum: 1 } } },
];


const ownerCount = await query.aggregate(pipeline, { useMasterKey: true })

console.log(ownerCount)

///////////////////////////////

const tokenIdCheck = "4826"

const query = new Parse.Query("ElfActions");
const pipeline = [
 //{project: {campaign:1, sector:1, tokenId:1, block_number:1, createdAt:1}},
 {match: {tokenId: tokenIdCheck}},
 { sort : { block_number : -1 } },
 { limit: 1 }
 
  
];
  
const actions = await query.aggregate(pipeline, { useMasterKey: true })


const query1 = new Parse.Query("ElfCampaignsActivity");
const pipeline1 = [
 {project: {campaign:1, sector:1, tokenId:1, block_number:1, createdAt:1}},
 {match: {tokenId: tokenIdCheck}},
 { sort : { block_number : -1 } },
 { limit: 1 }
 
];
  
const lastCampaign = await query1.aggregate(pipeline1, { useMasterKey: true })

console.log(lastCampaign)
console.log(actions)


