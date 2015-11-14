'use strict';

var extend = require('lodash').assign;
var mysql = require('mysql');
var dateformat = require('dateformat');


module.exports = function(config) {

    function getConnection() {
        return mysql.createConnection(extend({
            database: 'dar'
        }, config.mysql));
    }


    // [START list]
    function list(limit, token, cb) {
        token = token ? parseInt(token, 10) : 0;
        var connection = getConnection();
        connection.query(
            'SELECT * FROM `account` LIMIT ? OFFSET ?', [limit, token],
            function(err, results) {
                if (err) { return cb(err); }
                var hasMore = results.length === limit ? token + results.length : false;
                cb(null, results, hasMore);
            }
        );
        connection.end();
    }
    // [END list]

    function create(data, cb) {
        var connection = getConnection();


        data.start = dateformat(new Date(), "yyyy-m-dd HH:MM:ss");

        connection.query(
            'INSERT INTO `state` SET ?', data,
            function(err, results) {
                if (err) { return cb(err); }
            }
        );
        connection.end();
    }


    return {
        list: list,
        create: create
    };

};
