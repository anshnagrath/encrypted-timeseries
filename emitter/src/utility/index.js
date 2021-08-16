const dataSouce  =  require('./data.json');
const request = require('request');
const { createHash , createCipher,createDecipher ,randomBytes} =  require('crypto');



 const genateRandomDataFromDataSource = function ( ) {

    let nameIdx = getRandomInt(101);
    let destinationIdx  = getRandomInt(101);
    let  originIdx =  getRandomInt(101);
   
    return {
        name: dataSouce.names[nameIdx],
        origin: dataSouce.cities[originIdx],
        destination:  dataSouce.cities[destinationIdx]

    } 


}



 const getRandomInt = function ( max , min = 1 ) {
    return Math.floor(  Math.random() * (max - min) + min ) ;
  }


 const generateSha256 = function (str){
    return createHash('sha256').update(str).digest('base64');
 }



  function encodeAES(string , password) {
    var cipher = createCipher( 'aes-256-ctr',password)
    var crypted = cipher.update(string,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}


export function SendErrorsToFlock(err) {
   return new Promise(async (resolve, reject) => {
     try {
   
       request({ url : process.env.FLOCK_URL , method: "POST", json: { 'text': "Emitter Error : :" + JSON.stringify(err) }, headers: { "content-type": "application/json" } }, function (err, response, body) {
         resolve({ err, body: body })
       })
     } catch (err) {
       console.log("Error Occured ===>", err);
       resolve({ err, body: {} })
       
     }
 
   })
 
 }

 function aesEncryption(text , password){
    
    return  encodeAES(text , password)
  }



  module.exports = { genateRandomDataFromDataSource ,  getRandomInt , generateSha256 , aesEncryption }