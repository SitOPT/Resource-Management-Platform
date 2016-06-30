/**
 * updates an already existing sensor.
 */
exports.action = {
    name:                   'updateSensor',
    description:            'updateSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorName: {required: true},
        thingName: {required: true},
        sensorUrl: {required: false},
        sensorType: {required: false},
        timeStamp: {required: false},
        quality: {required: false},
        unit: {required: false},
        unitSymbol: {required: false},
        defaultValue: {required: false}
    },

    run: function(api, data, next){
        var updates = {};
        updates.sensorID = data.params.sensorName;
        updates.objectID = data.params.thingName;
        if (data.params.defaultValue != '') {
            updates.defaultValue = data.params.defaultValue;
            updates.defaultValueActive = true;
        }
        if (data.params.sensorUrl != null) {
            updates.sensorUrl = data.params.sensorUrl;
        }
        if (data.params.sensorType != null) {
            updates.sensorType = data.params.sensorType;
        }
        if (data.params.timeStamp != null) {
            updates.timestamp = data.params.timeStamp;
        } else {
            updates.timestamp = new Date();
        }
        updates.timestamp = updates.timestamp.toString();
        if (data.params.quality != null) {
            updates.quality = data.params.quality;
        }
        if (data.params.unit != null) {
            updates.unit = data.params.unit;
        }
        if (data.params.unitSymbol != null) {
            updates.unitSymbol = data.params.unitSymbol;
        }
        if (!(data.params.sensorType == null && data.params.sensorUrl == null)) {
            api.sensor.update({sensorID: data.params.sensorName, objectID: data.params.thingName}, updates, function (err, amount) {
                if (err) {
                    next(err);
                } else {
                    data.response.amountAffectedRows = amount;
                    next();
                }
            });
        } else {
            next('Not all needed parameters were given.');
        }
    }
};