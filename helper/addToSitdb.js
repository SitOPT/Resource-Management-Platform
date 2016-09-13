/**
 * Created by armin on 07.09.16.
 */
var http = require('http');
var https = require('https');
var sitdb = require('../config/sitdb.config.js');


module.exports = function(sensor) {
    if (!sitdb.enabled) {
        return;
    }
    var sitdbSensor = JSON.stringify({
        name: sensor.sensorID,
        SensorType: sensor.sensorType,
        url: sensor.sensorUrl,
        quality: sensor.quality,
        description: "",
        location: "",
        thing: sensor.objectID
    });
    var sitdbThing = JSON.stringify({
        "state": [],
        "name": sensor.objectID,
        "url": "",
        "description": "",
        "sensors": [],
        "location": "",
        "owners": []
    });

    if (sitdb.protocol === 'http') {
        var protocol = http;
    } else if (sitdb.protocol === 'https') {
        protocol = https;
    } else {
        return;
    }

    var options = {
        host: sitdb.server,
        port: sitdb.port,
        path: '/things',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(sitdbThing)
        }
    };

    var request = protocol.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function () {});
        res.on('end', function () {});
    });

    request.write(sitdbThing);
    request.end();

    options.path = '/sensors';
    options.headers['Content-Length'] = Buffer.byteLength(sitdbSensor);

    request = protocol.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function () {});
        res.on('end', function () {})
    });

    request.write(sitdbSensor);
    request.end();


};
