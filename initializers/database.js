module.exports = {
    loadPriority:  1000,
    startPriority: 1001,
    stopPriority:  1000,
    initialize: function(api, next){
        next();
    },
    start: function(api, next){
        var mongoose = require('mongoose');
        var config = require('../config/database.config.js');
        var url = "mongodb://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.name;
        mongoose.connect(url);
        api.database = mongoose.connection;
        api.database.on('error', function(error) {
            console.log(error);
        });
        api.database.once('open', function(callback) {
            var cacheSchema = new mongoose.Schema({
                objectID: String,
                sensorID: String,
                value: String,
                timeStamp: Number,
                quality: Number,
                sensorQuality: Number
            });

            api.sensorCache = mongoose.model('Cache', cacheSchema);

            var sensorSchema = new mongoose.Schema({
                objectID: String,
                sensorID: String,
                sensorUrl: String,
                timestamp: Number,
                quality: Number,
                sensorType: String,
                unit: String,
                unitSymbol: String,
                defaultValue: { type: String, default: '' },
                defaultValueActive: { type: Boolean, default: false}
            });

            api.sensor = mongoose.model('Sensor', sensorSchema);
        });
        next();
    },
    stop: function(api, next){
        next();
    }
};
