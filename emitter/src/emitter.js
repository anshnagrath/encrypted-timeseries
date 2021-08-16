const {genateRandomDataFromDataSource ,  generateSha256,aesEncryption ,getRandomInt , SendErrorsToFlock } = require('./utility');
const dotenv = require('dotenv').config();

  async function emitEvents( ) {
    try{
    
    let  encryptedStr = '';

    let strLength = getRandomInt(499,49);


    for( let i = 0 ; i < strLength ; i++ ) {

   const randomData  = genateRandomDataFromDataSource();

   const hashStr =  randomData.name + randomData.destination + randomData.origin;

   const hash = generateSha256(hashStr);


   randomData['secret_key'] = hash;

   const encrypted = aesEncryption(JSON.stringify(randomData),process.env.SECRET_KEY);


    (encryptedStr.length == 0 ) ? encryptedStr += encrypted :   encryptedStr += '|' + encrypted 




    }

    return encryptedStr
  }catch(err){
    console.log("Error Occured ==>",err )
    await  SendErrorsToFlock(err)
    return null
  }

}

module.exports = { emitEvents }