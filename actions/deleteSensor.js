/**
 * Deletes a sensor from the Sensor Registration.
 */
exports.action = {
    name:                   'deleteSensor',
    description:            'deleteSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        thingName: {required: true},
        sensorName: {required: true}
    },

    run: function(api, data, next){
        api.sensor.findOne({sensorID: data.params.sensorName, objectID: data.params.thingName}).remove(function (err) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }
};