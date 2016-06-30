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
        sitTempID: {required: true},
        thingID: {required: true}
    },

    run: function(api, data, next){
        var error = null;

        var config = require("../config/sitdb.config");
        var server = config.server;
        var port = config.port;
        var protocol = config.protocol;
        var ssl = require("../config/servers/web.js").default.servers.web(api).sercure;
        var ownPort = require("../config/servers/web.js").default.servers.web(api).port;
        var callbackurl = (ssl == true ? "https" : "http") + "://" + api.utils.getExternalIPAddress() + ":" + ownPort +
            "/setSituationData/" + data.params.sitTempID + "/" + data.params.thingID;
        var postData = {
            "SitTempID": data.params.sitTempID,
            "ThingID": data.params.thingID,
            "CallbackUrl": callbackurl,
            "once": false
        };
        var module = null;
        var options = {
            "host": server,
            "port": port,
            "path": "/situations/changes",
            "method": "POST",
            "headers": {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };

        if (protocol.toLowerCase() === "http") {
            module = require("http");
        } else {
            module = require("https");
        }

        var request = module.request(options, function (res) {
            if (res.statusCode == 400 || res.statusCode == 404) {
                next("Error while registering the sensor.");
            } else {
                postData.params.sensorID = postData.params.sitTempID;
                postData.params.objectID = postData.params.thingID;
                postData.params.sensorUrl = protocol + "://" + server + ":" + port + "/situation/changes";
                postData.params.sensorType = "situation";
                postData.params.quality = "100";
                require("./addSensor").action(api, postData, next);
            }
        });

        request.on('error', function (error) {
            next(error)
        });

        request.write(postData);
        request.end();
    }
};