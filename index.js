var _ = require('lodash');

/**
 * Custom reporter that dumps a MUCH lighter JSON report out
 * Built using the original JSON reporter as a template
 *
 * @param {Object} newman - The collection run object, with event hooks for reporting run details.
 * @param {Object} options - A set of collection run options.
 * @param {String} options.export - The path to which the summary object must be written.
 * @returns {*}
 */

function createLightSummary(summary) {
    var failures = [];
    var collection = {};
    Object.assign(collection, summary.collection.info)
    summary.run.failures.forEach(function(failureReport) {
        var failure = _.omit(failureReport,['parent','cursor','at']);
        var source = {};
        Object.assign(source, {'name':failureReport.source.name});
        Object.assign(failure,{'source':source});
        var error = {}
        Object.assign(error, {'message':failureReport.error.message});
        Object.assign(failure,{'error':error});
        failures.push(failure);
        print error
    });
    


    var lightSummary = {};
    
    Object.assign(lightSummary, {
        'collection':collection,
        'run': {
            'stats': summary.run.stats,
            'transfers':summary.run.transfers,
            'timings':summary.run.timings,
            'failures': failures
        }
    });
    return lightSummary
}



module.exports = function(newman, options) {
    newman.on('beforeDone', function(err, o) {
        newman.exports.push({
            name: 'newman-reporter-json-lite',
            default: 'newman-run-report.json',
            path:  options.jsonExport,
            content: JSON.stringify(createLightSummary(o.summary))
        });
    });
};