/**
 * Created by armin on 26.04.16.
 */
exports.sensor = function (setup, id, callback) {
    console.log("    start remove");
    setup.api.sensor.findOneAndRemove({"sensorID": id}, function (error, document) {
        console.log("    call cb");
        cb();
    });
}