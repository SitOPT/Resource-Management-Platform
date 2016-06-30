/**
 * Returns all registered sensors.
 */
exports.action = {
    name:                   'getAllSensors',
    description:            'getAllSensors',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {},

    run: function(api, data, next){
        api.sensor.find({}, function (err, result) {
            if (err) {
                next(err);
            } else {
                data.response.payload = result;
                next(err);
            }
        });
    }
};