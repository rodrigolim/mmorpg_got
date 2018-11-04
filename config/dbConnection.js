/* importar o mongodb */
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

const url = "mongodb://localhost:27017";
const dbName = "got";

var connMongoDB = function(dados) {
    mongo.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName).collection(dados.collection);  
        query(db, dados);
        client.close();
    });
};

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