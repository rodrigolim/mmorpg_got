var mongo = require('mongodb').MongoClient;

function UsuariosDAO(application){
    this._app = application;
    this._DBurl = application.get('DB_URI');
    this._DBName = application.get('DB_NAME');
}

UsuariosDAO.prototype.inserirUsuario = function(usuario, res){
    mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

        const db = database.db(this._DBName).collection('usuarios'); 

        db
        .insertOne(usuario)
        .then(result => {
            const { insertedId } = result;
            console.log('Registro inserido com _id: '+insertedId);
        },
        endCalback => {
            database.close();
        });
    });      
}

UsuariosDAO.prototype.autenticar = function(usuario){
   //aqui tem que ser desenvolvido     
}

module.exports = function(){
    return UsuariosDAO;
}