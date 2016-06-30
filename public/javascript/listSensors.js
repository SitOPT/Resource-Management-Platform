/**
 * Created by armin on 27.09.15.
 */
function tableclick(e) {
    var row = $($(e.target).parent()[0]);
    row.unbind('click');
    for (var i = 0; i < row.children().length; i++) {
        var child = $(row.children()[i]);
        var text = child.text();
        child.text("");
        if (text != null && (text != "" || i == 8)) {
            $("body").append("<p style='display:none;'>" + text + "</p>");
            var input = "";
            if (i < 2) {
                input = "<input type='text' value='" + text + "' name='" + i + "' disabled />";
            } else if (i == 8) {
                input = "<input type='text' value='' placeholder='default value (" + text + ")' name='" + i + "' />"
            } else {
                input = "<input type='text' value='" + text + "' name='" + i + "' />";
            }
            child.append(input);
        }
    }
    var navbar = '<nav class="navbar navbar-default navbar-fixed-bottom">'
        + '<div class="container">'
        + '<div>'
        + '<ul class="nav navbar-nav">'
        + '<li><button name="save" class="btn btn-default navbar-btn" onclick="buttonclick(\'save\')">Save Changes</button></li>'
        + '<li><button name="cancel" class="btn btn-default navbar-btn" onclick="buttonclick(\'cancel\')">Cancel</button></li>'
        + '</ul>'
        + '<ul class="nav navbar-nav navbar-right">'
        + '<li><button name="delete" class="btn btn-default navbar-btn" onclick="buttonclick(\'delete\')">Delete Sensor</button></li>'
        + '</ul>'
        + '</div>'
        + '</div>'
        + '</nav>';

    $("body").append(navbar);
}

function formatSensors(sensors) {
    var table = "<table class='table table-striped table-bordered table-hover'><tbody><tr id='header'><th>ObjectID</th><th>SensorID</th><th>Sensor Type</th><th>Sensor Quality</th><th>Sensor URL</th><th>Last Changed</th><th>Sensor Unit</th><th>Unit Symbol</th><th>Default Value</th></tr>";
    var entries = "";
    for (var index in sensors) {
        var sensor = sensors[index];
        entries += "<tr><td>" + sensor.objectID + "</td><td>" + sensor.sensorID + "</td><td>" + sensor.sensorType + "</td><td>" + sensor.quality + "</td><td>" + sensor.sensorUrl +
            "</td><td>" + new Date(sensor.timeStamp) + "</td><td>" + sensor.unit + "</td><td>" + sensor.unitSymbol + "</td>" +
            "<td>" + sensor.defaultValue + "</td></tr>";
    }
    return table + entries + "</tbody></table>";
}

function buttonclick(action) {
    $('.alert').remove();
    var url;
    if (action == 'delete') {
        url = location.protocol + "//" + location.host + "/sensor/" + $($("p")[0]).text() + "/" + $($("p")[1]).text();
        $.delete(url, function(res, code) {
            if (code == "success") {
                $("nav.navbar-fixed-bottom").remove();
                $("p").remove();
                load();
            }
        });
    } else if (action == 'save') {
        url = location.protocol + "//" + location.host + "/sensor/" + $($("p")[0]).text() + "/" + $($("p")[1]).text();
        var unitSymbol = $($("input")[7]).val();
        var unit = $($("input")[6]).val();
        var surl = $($("input")[4]).val();
        var qual = $($("input")[3]).val();
        var type = $($("input")[2]).val();
        var defaultValue = $($("input")[8]).val();
        if (!(surl == null || surl == "" || type == null || type == "")) {
            var match = [surl];
            if (match != null && match[0].length == surl.length) {
                $.put(url, {sensorUrl: surl, sensorType: type, quality: qual, unit: unit, unitSymbol: unitSymbol, defaultValue: defaultValue}, function(res, code) {
                    if (code == "success") {
                        $("nav.navbar-fixed-bottom").remove();
                        $("p").remove();
                        load();
                    }
                });
            } else {
                var error = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Enter a valid URL for the Sensor URL.</div>";
                $('#listSensorsContent').prepend(error);
            }
        } else {
            var error = "<div class='alert alert-danger' role='alert'><span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span><span class='sr-only'>Error:</span>Not all fields are filled.</div>";
            $('#listSensorsContent').prepend(error);
        }

    } else if (action == 'cancel') {
        $("nav.navbar-fixed-bottom").remove();
        $("p").remove();
        load();
    }
}