/**
 * Adds a sensor to the MongoDB, in the Sensor Registration part.
 */
exports.action = {
    name:                   'addSensor',
    description:            'addSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorName: {required: true},
        objectName: {required: true},
        sensorUrl: {required: true},
        sensorType: {required: true},
        timeStamp: {required: false},
        quality: {required: true},
        unit: {required: true},
        unitSymbol: {required: true},
        defaultValue: {required: false}
    },

    run: function(api, data, next){
        var async = require('async');
        var timestamp = data.params.timeStamp || new Date();
        var sensorUrl = data.params.sensorUrl;
        api.sensor.find({sensorID: data.params.sensorName, objectID: data.params.objectName}, function (err, result) {
            if (err) {
                data.response.error = err;
                next(err);
            } else if (result.length > 0) {
                data.response.error = 'Sensor already exists';
                //Sensor does not need to be added.
                next('Sensor already exists');
            } else {
                // Add Sensor
                var sensor = new api.sensor({
                    sensorID: data.params.sensorName,
                    objectID: data.params.objectName,
                    sensorType: data.params.sensorType,
                    sensorUrl: sensorUrl,
                    timestamp: timestamp.toString(),
                    quality: data.params.quality,
                    unit: data.params.unit,
                    unitSymbol: data.params.unitSymbol,
                    defaultValue: data.params.defaultValue,
                    defaultValueActive: data.params.defaultValue != null
                });
                sensor.save(function (err) {
                    if (err) {
                        data.response.error = err;
                        next(err);
                    } else {
                        data.response.payload = sensor;
                        next();
                    }
                });
            };
        });
    }
};