function auth(req, res, next){
    console.log("autenticando...");
    next();
}

module.exports = auth;