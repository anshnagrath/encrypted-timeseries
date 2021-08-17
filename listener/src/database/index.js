const { MongoClient , Decimal128  , Long} = require('mongodb')
const {SendErrorsToFlock} = require('../utility/index');
const moment = require('moment')
const dotenv = require('dotenv').config();
const url = process.env.DB_HOST;
const client = new MongoClient(url ,{ useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'test';
let dbConnection 


async function connectToDatabase() {
  try{  
  let dbCon = await client.connect();
  const db = dbCon.db(dbName);
  dbConnection = db;
  console.log('Connected To DB')
  return db;
  }catch(err){
      console.log("Error Connecting Database ===>" , err );
      await SendErrorsToFlock(err)
      return '';

  }
}

function getDbConnection(){
    return  dbConnection
}


async function dumpRecordsToDb(modeldDoc){

 try{   
 let result =   await dbConnection.collection('decoded').updateOne({time: modeldDoc.time, day: modeldDoc.day },
    {
             $push: { data: { $each : modeldDoc.data  } },
             $inc: { samples : modeldDoc.data.length } 
    }, 
     { upsert: true } )

     return  { err : null , result }

}catch(err){
    console.log('Error While Inserting Records to Database',err);
    await SendErrorsToFlock(err)
    return  { err : err , result :null }
}   
}


async function decodeStats (recieved , decoded , transmitionSize ,modeldDoc ){
    try{  
       
        let result =   await dbConnection.collection('decodeStats').updateOne({time: modeldDoc.time, day: modeldDoc.day },
           {
                    $inc: {totalrecievedStats  : Long.fromString(recieved.toString()) , totaldecodedStats  :  Long.fromString(decoded.toString()) , transmissonsize : Decimal128.fromString(transmitionSize.toString()) } 
           }, 
            { upsert: true } )
       
            return  { err : null , result }
       
       }catch(err){
           console.log('Error While Inserting Records to Database');
           await SendErrorsToFlock(err)
           return  { err : err , result :null }
       }   

}

async function fetchTodayRecord(  ){
try{
        let result =   await dbConnection.collection('decoded').find({ day:   moment().utcOffset("+05:30").format("DD-MM-YYYY")  }).sort({'_id':-1}).limit(1).toArray();
    
         return  { err : null , result : result[0] }


}catch(err){
    console.log('Error While Inserting Records to Database',err);
    await SendErrorsToFlock(err)
    return  { err : err , result :null }
} 

}


async function fetchTodayStats( ){

    try{
        let result =   await dbConnection.collection('decodeStats').find({ day:  moment().utcOffset("+05:30").format("DD-MM-YYYY") }).sort({'_id':-1}).limit(1).toArray();
    
         return  { err : null , result : result[0] }


}catch(err){
    console.log('Error While Inserting Records to Database',err);
    await SendErrorsToFlock(err)
    return  { err : err , result :null }
} 

}

module.exports = {
    connectToDatabase , getDbConnection , dumpRecordsToDb , fetchTodayRecord , decodeStats,fetchTodayStats
}