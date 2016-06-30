/**
 * Returns a s single sensor.
 */
exports.action = {
    name:                   'getSensor',
    description:            'getSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorName: {required: true},
        objectName: {required: true}
    },

    run: function(api, data, next) {
        api.sensor.findOne({sensorID: data.params.sensorName, objectID: data.params.objectName}, function (err, sensor) {
            if (err) {
                next(err);
            } else {
                data.response.payload = sensor;
                next();
            }
        });
    }
};