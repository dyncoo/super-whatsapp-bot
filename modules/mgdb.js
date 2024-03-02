const MongoClient = require('mongodb').MongoClient
const config_data = require('../config.js');

async function ytdb_err(id) {
    try{
        client = await MongoClient.connect(config_data.mongodb, { useUnifiedTopology: true });
        var db = client.db("ewb");
        id_obj = await db.collection("yt").findOne({ id: id})
        var yt_neu = id_obj.yt - 1
        await db.collection('yt').findOneAndUpdate(
                  { id : id },
                  {
                      $set: {
                          yt : yt_neu
                      }
                  },
                  { upsert : true }
                  )
                  .then(async result => {
                      console.log(`[mgdb-ytdb_err] id: ${id} updated to: ${yt_neu} because dl failed`)                                
                  })
                  .catch(error => console.log("[mgdb-ytdb_err] ERROR COLL: " + error))

        return id_obj
    } catch(err){
        console.log("[mgdb-ytdb_err] ERROR CON: " + err);
    }
}

async function ytdb(id) {
    try{
        var timestamp_neu = Math.floor(Date.now() / 1000)
        client = await MongoClient.connect(config_data.mongodb, { useUnifiedTopology: true });
        var db = client.db("ewb")
        id_obj = await db.collection("yt").findOne({ id: id})

        if(id_obj) {
          if(timestamp_neu-id_obj.timestamp > 3600) {
            var yt_neu = 1
            await db.collection('yt').findOneAndUpdate(
                          { id : id },
                          {
                              $set: {
                                  yt : yt_neu,
                                  timestamp : timestamp_neu
                              }
                          },
                          { upsert : true }
                          )
                          .then(async result => {
                              console.log(`[mgdb-ytdb] id: ${id} updated to: ${yt_neu} timestamp: ${timestamp_neu}`)                                
                          })
                          .catch(error => console.log("[mgdb-ytdb] ERROR(1): " + error))
            return { id : id, yt : 1, timestamp : timestamp_neu}
          } else {
            var yt_neu = id_obj.yt + 1
            await db.collection('yt').findOneAndUpdate(
                              { id : id },
                              {
                                  $set: {
                                      yt : yt_neu
                                  }
                              },
                              { upsert : true }
                              )
                              .then(async result => {
                                  console.log(`[mgdb-ytdb] id: ${id} updated to: ${yt_neu}`)                                
                              })
                              .catch(error => console.log("[mgdb-ytdb] ERROR(2): " + error))
            return id_obj
          }
        } else {
            await db.collection('yt').insertOne({ id : id, yt : 1, timestamp : timestamp_neu})
            .then(result => {
              console.log(result)              
            })
            .catch(error => console.log("[mgdb-ytdb] ERROR(3): " + error))
            return { id : id, yt : 1, timestamp : timestamp_neu}
        }
    } catch(err){
      console.log("[mgdb-ytdb] ERROR(4)" + err);
    }
}

async function mgdb(id, liegestuetzen) { 
 try{
    client = await MongoClient.connect(config_data.mongodb, { useUnifiedTopology: true });
    var db = client.db("ewb");
    id_obj = await db.collection("casino").findOne({ id: id})
    if(id_obj) {
      var liegestuetzen_vorher = parseInt(id_obj.liegestuetzen)
      var liegestuetzen_jetzt_int = liegestuetzen_vorher + liegestuetzen
      var liegestuetzen_jetzt_string = liegestuetzen_jetzt_int.toString()

      await db.collection('casino').findOneAndUpdate(
                          { id : id },
                          {
                              $set: {
                                  liegestuetzen : liegestuetzen_jetzt_string
                              }
                          },
                          { upsert : true }
                          )
                          .then(async result => {
                              console.log(`[mgdb-mgdb] id: ${id} has now: ${liegestuetzen_jetzt_string}`)                                
                          })
                          .catch(error => console.log("[mgdb-mgdb] ERROR(1): " + error))
      return id_obj
    } else {
        await db.collection('casino').insertOne({ id : id, liegestuetzen : liegestuetzen})
        .then(result => {
          var liegestuetzen_jetzt_string = liegestuetzen.toString()
          console.log(`[mgdb-mgdb] id: ${id} has now: ${liegestuetzen_jetzt_string}`)        
        })
        .catch(error => console.log("[mgdb-mgdb] ERROR(2) " + error))
        return { id : id, liegestuetzen : 0}
    }
  } catch(err){
    console.log("[mgdb-mgdb] ERROR(3): " + err);
  }
}

async function mgdb_set(id, liegestuetzen) { 
 try{
    client = await MongoClient.connect(config_data.mongodb, { useUnifiedTopology: true });
    var db = client.db("ewb");
    id_obj = await db.collection("casino").findOne({ id: id})
    if(id_obj) {
      await db.collection('casino').findOneAndUpdate(
                          { id : id },
                          {
                              $set: {
                                  liegestuetzen : liegestuetzen.toString()
                              }
                          },
                          { upsert : true }
                          )
                          .then(async result => {
                              console.log(`[mgdb-mgdb_set] id: ${id} has now: ${liegestuetzen}`)                                
                          })
                          .catch(error => console.log("[mgdb-mgdb_set] ERROR(1): " + error))
      return id_obj
    } else {
        await db.collection('casino').insertOne({ id : id, liegestuetzen : liegestuetzen.toString()})
        .then(result => {
          console.log(`[mgdb-mgdb_set] id: ${id} has now: ${liegestuetzen}`)
        })
        .catch(error => console.log("[mgdb-mgdb_set] ERROR(2): " + error))
        return { id : id, liegestuetzen : 0}
    }
  } catch(err){
    console.log("[mgdb-mgdb_set] ERROR(3): " + err);
  }
}

async function mgdb_del(username) { 
 try{
    client = await MongoClient.connect(config_data.mongodb, { useUnifiedTopology: true });
    var db = client.db("ewb");
    id_obj = await db.collection("casino").findOne({ id: username})
    if(id_obj) {
      var liegestuetzen_jetzt_int = 0
      var liegestuetzen_jetzt_string = liegestuetzen_jetzt_int.toString()
      await db.collection('casino').findOneAndUpdate(
                          { id : username },
                          {
                              $set: {
                                  liegestuetzen : liegestuetzen_jetzt_string
                              }
                          },
                          { upsert : true }
                          )
                          .then(async result => {
                              console.log(`[mgdb-mgdb_del] id: ${username} has now: ${liegestuetzen_jetzt_string}`)                                
                          })
                          .catch(error => console.log("[mgdb-mgdb_del] ERR(1): " + error))
      return id_obj
    }
  } catch(err){
    console.log("[mgdb-mgdb_del] ERR(2): " + err);
  }
}

module.exports = {
    ytdb_err,
    ytdb,
    mgdb,
    mgdb_set,
    mgdb_del    
}