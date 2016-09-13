/**
 * Created by armin on 27.09.15.
 */
function save() {
    $(".alert").remove();
    var url = location.protocol + "//" + location.host + "/sensor";
    var objectID = $('#objectID').val();
    var sensorID = $('#sensorID').val();
    var sensorUrl = $('#sensorUrl').val() || "";
    var sensorType = $('#sensorType').val();
    var quality = $('#sensorQuality').val();
    var unit = $('#unit').val();
    var unitSymbol = $('#unitSymbol').val();
    var defaultValue = $('#defaultValue').val();
    if (isNaN(quality) || 0 > quality || 100 < quality) {
        alert("Quality has to be a number between 0 and 100");
        return;
    }
    if (!(sensorUrl == null || sensorID == null || sensorID == "" || sensorType == null || sensorType == "" || objectID == null || objectID == "" || quality == null || quality == "")) {
        $.post(url, {
            objectName: objectID,
            sensorName: sensorID,
            sensorUrl: sensorUrl,
            sensorType: sensorType,
            quality: quality,
            unit: unit,
            unitSymbol: unitSymbol,
            defaultValue: defaultValue
        }, function () {
            navbarClick($, document, 'listSensors');
        }).fail(function () {
            alert("An error occurred.\nA Thing cannot have multiple Sensors with the same name.")
        });
    } else {
        var error = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Not all fields are filled.</div>";
        $('#addSensorContent').prepend(error);
    }
}
