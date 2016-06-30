exports.action = {
    name:                   'getSituationdata',
    description:            'getSituationdata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectName: {required: true},
        situationName: {required: true}
    },

    run: function(api, data, next) {
        var http = require('http');
        var sitdb = require('../config/sitdb.config.js');

        http.get('http://' + sitdb.server + ':' + sitdb.port + '/situations/ByID?ID=' + data.params.situationID, function (result) {
            //data.response.payload = result;
            result.resume();
            result.on('data', function (chunks) {
                data.response.payload = JSON.stringify(JSON.parse(chunks).occured);
                next();
            })
        }).on('error', function (error) {
            next(error);
        });
    }
};