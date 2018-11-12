function UsuariosDAO(connection){
    this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function(usuario, res){
    // var dados = {
    //              operacao: "inserir",
    //              registros: usuario,
    //              collection: "usuarios"
    //             };

    //     this._connection(dados);


    this._connection.then(function(db) {
        db.collection('usuario').find({}).toArray().then(function(docs) {
        });
      });

      

  //  db.collection.insert(usuario);
       
}

UsuariosDAO.prototype.autenticar = function(usuario){
   //aqui tem que ser desenvolvido     
}

module.exports = function(){
    return UsuariosDAO;
}