var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;


function JogoDAO(application){
    this._app = application;
    this._DBurl = application.get('DB_URI');
    this._DBName = application.get('DB_NAME');
}

JogoDAO.prototype.gerarParametros = function(usuario){
	mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

		const db = database.db(this._DBName).collection('jogo'); 
	   
		db
        .insertOne({
			usuario: usuario,
			moeda: 15,
			suditos: 10,
			temor: Math.floor(Math.random() * 1000),
			sabedoria: Math.floor(Math.random() * 1000),
			comercio: Math.floor(Math.random() * 1000),
			magia: Math.floor(Math.random() * 1000)
		})
        .then(result => {
            const { insertedId } = result;
            console.log('Registro inserido na collection "jogo" com _id: '+insertedId);
        },
        endCalback => {
            database.close();
        }); 
    }); 
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
	mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

        const db = database.db(this._DBName).collection('jogo'); 

		db.find({usuario : usuario}).toArray(function(err, result) {
			res.render("jogo", {img_casa: casa, jogo: result[0], msg : msg});
        });

        database.close(); 
    }); 
}

JogoDAO.prototype.acao = function(acao){
	mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

		const dbAcao = database.db(this._DBName).collection('acao'); 
		var date = new Date();
		var tempo = null;
		switch(parseInt(acao.acao)){
			case 1: tempo = 1 * 60 * 60000; break;
			case 2: tempo = 2 * 60 * 60000; break;
			case 3: tempo = 5 * 60 * 60000; break;
			case 4: tempo = 5 * 60 * 60000; break;
		}	
		acao.acao_termina_em = date.getTime() + tempo;
		
		dbAcao
        .insertOne(acao)
        .then(result => {
            const { insertedId } = result;
            console.log('Registro inserido na collection "acao" com _id: '+insertedId);
        }); 

		
		const dbJogo = database.db(this._DBName).collection('jogo'); 
		var moedas = null;
		switch(parseInt(acao.acao)){
			case 1: moedas = -2 * acao.quantidade; break;
			case 2: moedas = -3 * acao.quantidade; break;
			case 3: moedas = -1 * acao.quantidade; break;
			case 4: moedas = -1 * acao.quantidade; break;
		}	

		dbJogo.updateOne({usuario: acao.usuario}, { $inc: {moeda: moedas}});

		database.close();
	});
}

JogoDAO.prototype.getAcoes = function(usuario, res){
	mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

		const db = database.db(this._DBName).collection('acao'); 

		var date = new Date();
		var momento_atual = date.getTime();

		db.find({usuario : usuario, acao_termina_em: {$gt:momento_atual}}).toArray(function(err, result) {
			res.render("pergaminhos", {acoes: result});
		},
        endCalback => {
            database.close();
        }); 
    }); 
}

JogoDAO.prototype.revogarAcao = function(_id, res){
	mongo.connect(this._DBurl, { useNewUrlParser: true }, function(err, database) {
        if(err) console.log('Problemas ao conectar na base de dados.');         

        const db = database.db(this._DBName).collection('acao'); 

		db.remove({_id : ObjectID(_id)}).toArray(function(err, result) {
			res.render("jogo?msg=D");
			database.close(); 
        });        
	}); 
}

module.exports = function(){
	return JogoDAO;
}