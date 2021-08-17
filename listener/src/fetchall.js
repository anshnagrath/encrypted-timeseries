const { fetchTodayRecord  ,  fetchTodayStats} = require('../src/database');
const dotenv = require('dotenv').config();
const { SendErrorsToFlock } = require('../src/utility/index');



async function fetchAllData() {
    try{    
    let allRec =     await fetchTodayRecord();

    let allTodayStats = await fetchTodayStats();

    if(allRec.err || allTodayStats.err){

        return {err  : allRec.err || allTodayStats.err , result: null}
    }
    
    return{ err  : null , result: {data: allRec.result ,stats : allTodayStats.result } }

    }catch(err){
         await SendErrorsToFlock(err)
         return {  err  , result: null}
    }

}

module.exports =  fetchAllData 