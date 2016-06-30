exports.action = {
    name:                   'getStaticdata',
    description:            'getStaticdata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectName: {required: true},
        attribute: {required: true}
    },

    run: function(api, data, next) {
        var http = require('http');
        var sitdb = require('../config/sitdb.config.js');
        var attributes = data.params.attribute.split(".");

        http.get('http://' + sitdb.server + ':' + sitdb.port + '/things/ByID?ID=' + data.params.objectName, function (result) {
            //data.response.payload = result;
            result.resume();
            result.on('data', function (chunks) {
                var att = chunks;
                for (var i = 0; i < attributes.length; i++) {
                    att = JSON.stringify(JSON.parse(att)[attributes[i]]);
                }
                data.response.payload = att;
                next();
            })
        }).on('error', function (error) {
            next(error);
        });
    }
};