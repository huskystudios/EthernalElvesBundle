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