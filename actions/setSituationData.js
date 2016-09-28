/**
 * used for setting the value of a situation. not to be used, situations are queried from the SitDB.
 */
exports.action = {
    name:                   'setSituationData',
    description:            'setSituationData',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        thing: {required: true},
        situationtemplate: {required: true},
        occured: {required: true},
        timestamp: {required: false}
    },

    run: function(api, data, next){
        console.log(data.params);
        var quality = 100; //TODO: find real object structure
        if (!data.params.timestamp || isNaN(data.params.timestamp)) {
            var timestamp = new Date().getTime();
        } else {
            timestamp = data.params.timestamp;
        }
        var value = data.params.occured;
        api.situation.findOneAndUpdate({thing: data.params.thing, template: data.params.situationtemplate},
            {thing: data.params.thing, template: data.params.situationtemplate, value: value, timestamp: timestamp, quality: quality},
            {upsert: true}, function (error, rows, raw) {
            if (error) {
                next(error);
            } else {
                next();
            }
        });
    }
};
