/**
 * Returns the newest value for each sensor of an object.
 */
exports.action = {
    name:                   'getObjectdata',
    description:            'getObjectdata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectName: {required: true}
    },

    run: function(api, data, next){
        var object = data.params.objectName;
        api.sensorCache.find({objectID: object}, "sensorType", function (error, cache) {
            if (error) {
                next(error);
            } else {
                var keys = [];
                var keyValues = {};
                for (var index in cache) {
                    var value = JSON.parse(JSON.stringify(cache[index]));
                    // check if sensorType already checked.
                    if (keys.indexOf(value.sensorType) > -1) {
                        if (keyValues[value.sensorType].timestamp < value.timestamp) {
                            keyValues[value.sensorType] = value;
                        }
                    } else {
                        keyValues[value.sensorType] = value;
                        keys.push(value.sensorType);
                    }
                }
                data.response.payload = keyValues;
                next();
            }
        });
    }
};