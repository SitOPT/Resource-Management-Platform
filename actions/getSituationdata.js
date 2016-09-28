exports.action = {
    name:                   'getSituationdata',
    description:            'getSituationdata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        thing: {required: true},
        template: {required: true}
    },

    run: function(api, data, next) {
        api.situation.findOne({thing: data.params.thing, template: data.params.template}, function (err, situation) {
            if (err) {
                next(err);
            } else {
                data.response.payload = situation;
                next();
            }
        });
    }
};