/**
 * used for setting the value of a situation. not to be used, situations are queried from the SitDB.
 */
exports.action = {
    name:                   'setSituationData',
    description:            'setSituationData',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectName: {required: true},
        situationtemplate: {required: true},
        occured: {required: true},
        timestamp: {required: false}
    },

    run: function(api, data, next){
        var id = data.params.thing + "." + data.params.situationtemplate;
        var quality = 100; //TODO: find real object structure
        var timeStamp = new Date(data.params.timestamp) || new Date().toString();
        var value = data.params.occured;
        api.sensorCache.findOneAndUpdate({sensorID: id}, {objectID: data.params.objectName, value: value, timeStamp: timeStamp, quality: quality}, {upsert: true}, function (error, rows, raw) {
            if (error) {
                next(error);
            } else {
                next();
            }
        });
    }
};
