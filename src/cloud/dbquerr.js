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