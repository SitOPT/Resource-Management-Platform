/**
 * sets the data of a single sensor.
 */
exports.action = {
	name:                   'setSensordata',
	description:            'setSensordata',
	blockedConnectionTypes: [],
	outputExample:          {},
	matchExtensionMimeType: false,
	version:                1.0,
	toDocument:             true,
	middleware:             [],

	inputs: {
		sensorName: {required: true},
		thingName: {required: true},
		value: {required: true},
		timeStamp: {required: false},
		quality: {required: true}
	},


	run: function(api, data, next){
		api.sensorCache.findOne({'sensorID':data.params.sensorName, 'objectID': data.params.thingName}, function(error, sensordata){
			if (error){
				next(error);
			}else{
				if (sensordata != null) {
					api.sensor.findOne({'sensorID': data.params.sensorName, 'objectID': data.params.thingName}, function (err, sensor) {
						if (sensor != null) {
							sensor.defaultValueActive = false;
							sensor.save();
						}
						//var date = new Date().getTime();
						sensordata.value= data.params.value;
						sensordata.timeStamp= new Date().getTime();
						sensordata.quality = data.params.quality;
						sensordata.save(function(e){
							if (e){
								next(e);
							}else{
								data.response.payload = sensordata;
								next();
							}
						});
						next();
					});
				}else{
					api.sensor.findOne({'sensorID':data.params.sensorName, 'objectID': data.params.thingName}, function(err, sensor) {
						if (err) {
							next(err);
						} else {
							if (sensor != null) {
								sensor.defaultValueActive = false;
								sensor.save();
								var val = new api.sensorCache({sensorID: data.params.sensorName,
									value: data.params.value,
									timeStamp: new Date().getTime(),
									quality: data.params.quality,
									sensorQuality: 1,
									sensorType: 'generic',
									objectID: data.params.thingName
								});
								val.save(function (er) {
									if (er) {
										next(er);
									} else {
										data.response.payload = val;
										next();
									}
								});
								next();
							} else {
								next("Sensor not found");
							}
						}
					});
				}
			}
		});
	}
};