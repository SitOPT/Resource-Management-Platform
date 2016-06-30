exports.task = {
    name: 'scanWatchdogs',
    description: 'scanWatchdogs',
    frequency: 5000,
    queue: 'default',
    plugins: [],
    pluginOptions: {},

    run: function (api, params, next) {
        var http = require('http');
        var https = require('https');
        var module = http;
        api.sensor.find({sensorType: 'watchdog'}, function (error, result) {
            if (error) {
                next(error);
            } else if (result != null && result.length > 0) {
                for (var i = 0; i < result.length; i++) {
                    var value = result[i];
                    var url = value.sensorUrl;
                    if (url.toLowerCase().startsWith("https")) {
                        module = https;
                    }
                    var splits = url.split("/");
                    var hostPort = splits[2];
                    if (!url.startsWith("http")) {
                        hostPort = splits[0];
                    }
                    splits = hostPort.split(":");
                    var options = {
                        path: url.substr(url.indexOf(hostPort) + hostPort.length),
                        host: splits[0],
                        method: 'GET'
                    };
                    if (splits.length == 2) {
                        options.port = splits[1];
                    }
                    var request = module.request(options, function (res) {
                        var val = new api.sensorCache({
                            sensorID: value.sensorID,
                            objectID: value.objectID,
                            timeStamp: new Date(),
                            value: res.statusCode
                        });
                        var returned = false;
                        require('async').waterfall([
                            function () {
                                val.save(function (err) {
                                    if (err) {
                                        returned = true;
                                        next(err);
                                    }
                                });
                            },
                            function () {
                                if (!returned) {
                                    next();
                                }
                            }
                        ]);
                    })
                }
            }
        });
    }
}
