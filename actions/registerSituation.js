/**
 * used for registering a situation as sensor. not to be used, situations are queried from the SitDB.
 */
exports.action = {
    name:                   'registerSituation',
    description:            'registerSituation',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        template: {required: true},
        thing: {required: true}
    },

    run: function(api, data, next){
        var error = null;

        var config = require("../config/sitdb.config");
        var server = config.server;
        var port = config.port;
        var protocol = config.protocol;
        var ssl = require("../config/servers/web.js").default.servers.web(api).secure;
        var ownPort = require("../config/servers/web.js").default.servers.web(api).port;
        var callbackurl = (ssl == true ? "https" : "http") + "://" + api.utils.getExternalIPAddress() + ":" + ownPort +
            "/situation";
        var postData = JSON.stringify({
            "SitTempName": data.params.template,
            "ThingName": data.params.thing,
            "CallbackURL": callbackurl,
            "once": false
        });
        var module = require(protocol);
        var options = {
            "host": server,
            "port": port,
            "path": "/situations/changes",
            "method": "POST",
            "headers": {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        var request = module.request(options, function (res) {
            res.on('data', function (chunk) {});
            res.on('end', function () {
            console.log("end");
                next();
            });
        });

        request.on('error', function (error) {
        console.log("error");
            next(error)
        });
        console.log(postData)

        request.write(postData);
        request.end();
    }
};
