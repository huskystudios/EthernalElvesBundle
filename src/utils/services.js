

export const updateMoralisDb = async ({elf, elves}) => {

  elves.set("owner_of", elf.owner.toLowerCase())
  elves.set("action", elf.action)
  elves.set("token_id", parseInt(elf.id))
  elves.set("level", parseInt(elf.level))
  elves.set("time", elf.time)
  
  elves.save()
  .then((elf) => {
    // Execute any logic that should take place after the object is saved.
    console.log('Object updated with objectId: ' + elf.id );
  }, (error) => {
    // Execute any logic that should take place if the save fails.
    // error is a Moralis.Error with an error code and message.
    console.log('Failed to create new object, with error code: ' + error.message);
  });
  
}

