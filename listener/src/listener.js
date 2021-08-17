const {checkSHA,modelDocuments , SendErrorsToFlock} = require('./utility/index.js');
const { connectToDatabase ,  dumpRecordsToDb ,decodeStats } = require('./database/')

const db = connectToDatabase()

async function listenToEmitedData(data) {
    try{
    let splitedPayload = data.split('|');
    let transmitionSizeINMB =( Buffer.byteLength(data) /  (1024*1024) );

    let numRecordsRecieved = splitedPayload.length; 
    let allValidData = []
    for(let i = 0;i< splitedPayload.length;i++){
        let dataToProcess = splitedPayload[i];
         //verify integrity
        let {valid , decodedObj  , decodeTime} = checkSHA(dataToProcess);     
        if(valid) {
            valid['decodeTime'] = decodeTime;
            allValidData.push(decodedObj);     
        }
     

    }

    if(allValidData.length){    

    const allModeledDocs = modelDocuments(allValidData);
    const allDbRequest = [];
    let numRecordsDecoded = allValidData.length; 
    allDbRequest.push(dumpRecordsToDb(allModeledDocs) , decodeStats(numRecordsRecieved , numRecordsDecoded , transmitionSizeINMB ,allModeledDocs ))
    let allReq = await Promise.all(allDbRequest);
     
    return  { status : 'success' , err: null  }

    }
}catch(err){
    console.log('Error Occured While Processing Emitted Data',err)
    await SendErrorsToFlock(err);
    return  { status : 'success' , err: err  }
}
}


module.exports = listenToEmitedData