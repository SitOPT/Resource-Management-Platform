exports.action = {
    name:                   'getSpecificSensordata',
    description:            'getSpecificSensordata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {sensorName: {required: true}},

    run: function(api, data, next){
        api.cache.find({sensorID: data.params.sensorName}, function (err, doc) {
            data.response.payload = doc;
            next(err);
        });
    }
};