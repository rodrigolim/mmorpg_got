module.exports.cadastro = function(application, req, res){
    res.render('cadastro', {validacao: {}, dadosForm: {} });      
}

module.exports.cadastrar = function(application, req, res){
    
    var dadosForm = req.body;

    req.assert('nome', 'Nome não pode ser vázio.').notEmpty();
    req.assert('usuario', 'Usuario não pode ser vázio.').notEmpty();
    req.assert('senha', 'Senha não pode ser vázio.').notEmpty();
    req.assert('casa', 'Casa não pode ser vázio.').notEmpty();

    var erros = req.validationErrors();

    if (erros){
        res.render('cadastro', {validacao: erros, dadosForm: dadosForm});
        return;
    }

    res.send('podemos cadastrar');
}