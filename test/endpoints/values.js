/**
 * Created by armin on 27.04.16.
 */
var http = require('http');
var querystring = require('querystring');
var should = require('should');
var setup = require('./../_setup.js')._setup;

describe('value tests', function () {
    var sensorId = "super secret sensor id which will nowhere else be used.";
    var sensorData = {
        sensorName: sensorId,
        objectName: "123",
        sensorUrl: "123",
        sensorType: "1",
        timeStamp: new Date().toDateString(),
        quality: "100",
        unit: "test",
        unitSymbol: "t"
    };
    var valueData = {
        sensorName: sensorId,
        objectName: "123",
        value: 20,
        timeStamp: Date.now(),
        quality: 75
    };
    var options = {
        host: "localhost",
        port: 1337,
        path: "/sensor",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    before(function (done) {
        setup.init(function () {
            var d = querystring.stringify(sensorData);
            options.headers["Content-Length"] = Buffer.byteLength(d);
            options.method = "POST";
            var request = http.request(options, function (res) {
                res.on('error', function (error) {
                    should.fail();
                });
                res.on('data', function (data) {
                });
                res.on('end', function (data) {
                    done();
                })
            });
            request.write(d);
            request.end();
        });
    });
    after(function () {
        setup.api.sensor.find({sensorID: sensorId}).remove().exec();
    });

    it('should create value', function (done) {
        options.path = '/value';
        var d = querystring.stringify(valueData);
        options.headers["Content-Length"] = Buffer.byteLength(d);
        var request = http.request(options, function (res) {
            res.on('error', function (err) {
                should.fail();
            });
            res.on('data', function (data) {
            });
            res.on('end', function (data) {
                setup.api.sensorCache.find({sensorID: sensorId}, function (err, docs) {
                    should.not.exist(err);
                    setup.api.sensorCache.find({sensorID: sensorId}).remove().exec();
                    should.equal(docs.length, 1);
                    done();
                });
            });
        });
        request.write(d);
        request.end();
    });

    it('should not create second value but update old', function (done) {
        options.path = '/value';
        var d = querystring.stringify(valueData);
        options.headers["Content-Length"] = Buffer.byteLength(d);
        var request = http.request(options, function (response) {
            response.on('error', function (err) {
                should.fail();
            });
            response.on('data', function (data) {
            });
            response.on('end', function (data) {
                valueData.value = 30;
                d = querystring.stringify(valueData);
                var req = http.request(options, function (res) {
                    res.on('error', function (err) {
                        should.fail();
                        done();
                    });
                    res.on('data', function (data) {
                    });
                    res.on('end', function (data) {
                        setup.api.sensorCache.find({sensorID: sensorId, objectID: "123"}, function (err, docs) {
                            should.not.exist(err);
                            setup.api.sensorCache.find({sensorID: sensorId}).remove().exec();
                            should.equal(docs.length, 1);
                            should.equal(docs[0].value, 30);
                            done();
                        });
                    });
                });
                req.write(d);
                req.end();
            });
        });
        request.write(d);
        request.end();
    })
});