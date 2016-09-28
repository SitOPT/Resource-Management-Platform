/**
 * returns the newest value of a sensortype for a thing
 */
exports.action = {
	name:                   'getSensordata',
	description:            'getSensordata',
	blockedConnectionTypes: [],
	outputExample:          {},
	matchExtensionMimeType: false,
	version:                1.0,
	toDocument:             true,
	middleware:             [],

	inputs: {
		thingName : {required : true},
		sensorName : {required : true}
	},

	run: function(api, data, next) {
		if (typeof api.sensor != 'undefined') {
			api.sensor.findOne({objectID: data.params.thingName, sensorID: data.params.sensorName}, function (err, sensor) {
				if (sensor != null && sensor.defaultValueActive) {
					data.response.payload = {};
					data.response.payload.value = sensor.defaultValue;
					next();
				} else if (sensor != null || err != null) {
					if (err) {
						next(err);
					} else {
						api.sensorCache.find({sensorID: sensor.sensorID, objectID: sensor.objectID}, function (error, cache) {
							console.log(cache);
							var val = cache[0];
							for (var i = 1; i < cache.length; i++) {
								if (val.timeStamp < cache[i].timeStamp) {
									val = cache[i];
								}
							}
							data.response.payload = val;
							next();
						});
					}
				} else {
					next("Sensor not found");
				}
			});
		}
	}
};