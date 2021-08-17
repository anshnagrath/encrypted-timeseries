

const { createDecipher,createHash } = require('crypto');
const moment = require('moment');
const request = require('request');
const bactchSize = 150;

function checkSHA ( dataToProcess  ){
    

    let decodedObj = decrypt(dataToProcess);
    let decodeTime =moment().utcOffset("+05:30").format("HH:mm");

    
    if(decodedObj && decodedObj['secret_key']){
            let oldsha = decodedObj['secret_key'];
            let newhash =  generateSha256(decodedObj['name'] + decodedObj['destination']+decodedObj['origin'])  
        
            if(oldsha == newhash){
               
                 return { valid : true , decodedObj  , decodeTime : decodeTime }


            }else{

              return { valid : false , decodedObj  , decodeTime : decodeTime}

            }


    }else{

        return { valid : false , decodedObj : { }  , decodeTime : decodeTime}

    }

}


function decrypt(text) {
    var decipher = createDecipher('aes-256-ctr','test@1234')
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return JSON.parse(dec)
    
  }

  const generateSha256 = function (str){
    return createHash('sha256').update(str).digest('base64');
 }

const modelDocuments = function (docArr) {

   return createDbObjects(docArr)

}

const createDbDoc  = function (allDoc ,time ) {
  let date =moment().utcOffset("+05:30").format("DD-MM-YYYY");
  return {
    samples : allDoc.length,
    day: date,
    time ,
    data: allDoc
  } 


}




 function SendErrorsToFlock(err) {
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



const createDbObjects = function (docArr) {

  let allSameTimeDoc = [];
  let currentTime = moment().utcOffset("+05:30").format("HH:mm");
  for(let i = 0 ; i < docArr.length ; i++){
    let cureentDoc = docArr[i];
   
      allSameTimeDoc.push(cureentDoc);
   
    
   
  } 

  
  return createDbDoc(allSameTimeDoc ,currentTime)

}



  module.exports = {
    checkSHA,
    decrypt,
    SendErrorsToFlock,
    modelDocuments
  }