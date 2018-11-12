/* importar o mongodb */
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

const url = "mongodb://asterix:qw123456@ds061391.mlab.com:61391/got";
const dbName = "got";

// var connMongoDB = function() {
//     mongo.connect(url, { useNewUrlParser: true }, function(err, dataBase) {
//         assert.equal(null, err);
//         console.log("Connected successfully to server");

//         return dataBase;

//         // const db = dataBase.db(dbName).collection(dados.collection);  
//         // query(db, dados);
//         // dataBase.close();
//     });
// };


var connMongoDB = mongo.connect(url, { useNewUrlParser: true });

function query(db, dados) {     
    switch (dados.operacao) {
        case "inserir":
                db
                .insertOne(dados.registros)
                .then(result => {
                    const { insertedId } = result;
                    // Do something with the insertedId
                    console.log('Inserted document with _id: '+insertedId);
                    });
            break;
        default:
            break;
    }
}

module.exports = function(){
    return connMongoDB;
}