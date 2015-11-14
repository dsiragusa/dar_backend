'use strict';


module.exports = {
    port: process.env.PORT || 8080,

    // dataBackend can be 'datastore', 'cloudsql', or 'mongodb'. Be sure to
    // configure the appropriate settings for each storage engine below.
    // If you are unsure, use datastore as it requires no additional
    // configuration.
    dataBackend: 'cloudsql',

    // This is the id of your project in the Google Developers Console.
    gcloud: {
        projectId: 'pariservice-metronomo-1'
    },

    mysql: {
        user: 'root',
        password: '',
        host: '173.194.247.9'
    }
};