/**
 * Created by armin on 27.09.15.
 */
function save() {
    $(".alert").remove();
    var url = location.protocol + "//" + location.host + "/sensor";
    var objectID = $('#objectID').val();
    var sensorID = $('#sensorID').val();
    var sensorUrl = $('#sensorUrl').val();
    var sensorType = $('#sensorType').val();
    var quality = $('#sensorQuality').val();
    var unit = $('#unit').val();
    var unitSymbol = $('#unitSymbol').val();
    var defaultValue = $('#defaultValue').val();
    if (!(sensorUrl == null || sensorUrl == "" || sensorID == null || sensorID == "" || sensorType == null || sensorType == "" || objectID == null || objectID == "" || quality == null || quality == "")) {
        $.post(url, {
            objectName: objectID,
            sensorName: sensorID,
            sensorUrl: sensorUrl,
            sensorType: sensorType,
            quality: quality,
            unit: unit,
            unitSymbol: unitSymbol,
            defaultValue: defaultValue
        }, function (res, code) {
            console.log(res);
            if (code == "success") {
                navbarClick($, document, 'listSensors');
            } else {
                console.log(JSON.stringify(res));
            }
        });
    } else {
        var error = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Not all fields are filled.</div>";
        $('#addSensorContent').prepend(error);
    }
}
