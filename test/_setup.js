exports._setup = {
    serverPrototype: require("../node_modules/actionhero/actionhero.js").actionheroPrototype,
    testUrl:         "http://127.0.0.1:1337/api",

    init: function(callback){
        var self = this;
        if(!self.server){
            console.log("    starting test server...");
            self.server = new self.serverPrototype();
            self.server.start(function(err, api){
                self.api = api;
                callback();
            });
        }else{
            callback();
        }
    }

};