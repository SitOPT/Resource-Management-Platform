/**
 * Created by armin on 26.04.16.
 */
var request = require('request');
var should = require('should');
var setup = require('./../_setup.js')._setup;
var location = 'http://localhost:1337/';

describe('general startup', function () {
    before(function (done) {
        setup.init(done);
    });

    it('server should be started', function (done) {
        request(location, function (err, httpResponse, body) {
            should.not.exist(err);
            should.exist(setup.api);
            done();
        })
    })
});