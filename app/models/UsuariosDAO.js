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
            console.log('Registro inserido na collection "usuarios" com _id: '+insertedId);
        },
        endCalback => {
            database.close();
        }); 
    });      
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

        const db = database.db(this._DBName).collection('usuarios'); 

        db.find({usuario: {$eq: usuario.usuario}, senha:{$eq: usuario.senha}}).toArray(function(err, result) {
 
            if(result[0] != undefined){
               req.session.autorizado = true;
               req.session.usuario = result[0].usuario;
               req.session.casa = result[0].casa;
           } 

           if(req.session.autorizado){
               res.redirect("jogo");
           } else {
              res.render('index', { validacao: {} }); 
           }

        });

        database.close();
    });     
}

module.exports = function(){
    return UsuariosDAO;
}