var express = require('express');

module.exports = function(model) {
    var router = express.Router();
    var scheduled = {};

    function sendJson(res, status, msg) {
        var body = {success: status == 200};
        if (msg !== undefined) {
            body.reason = msg;
        }

        res.status(status).json(body);

        return false;
    }

    function checkIntParam(param, req, res) {
        if (req.body[param] === undefined) {
            console.error('No ' + param + ' specified');
            return sendJson(res, 500, 'Malformed request');
        }

        var value = parseInt(req.body[param]);

        if (isNaN(value)) {
            console.error('Malformed ' + param);
            return sendJson(res, 500, 'Malformed request');
        }

        return value;
    }

    function doUpdateState(id, code, model) {
        delete scheduled[id];
        console.log(code);
        var data = {
            code: code,
            'service_id': id
        };

        model.create(data, console.error);
    }

    router.get('/list', function(req, res, next) {
        model.list(10, 0,
            function(err, entities, cursor) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({success: false, msg: err});
                }

                res.status(200).json(entities);
            });
    });

    router.post('/schedule', function(req, res, next) {
        var id = checkIntParam('id', req, res);
        if (id === false) {
            return;
        }

        var timeoutTimestamp = checkIntParam('timeout', req, res);
        if (timeoutTimestamp === false) {
            return;
        }

        var code = checkIntParam('code', req, res);
        if (code === false) {
            return;
        }

        /*
        var oldCode = checkIntParam('oldCode', req, res);
        if (oldCode === false) {
            return;
        }
        */

        console.log('sent: ' + new Date(timeoutTimestamp));
        console.log('now: ' + new Date());

        if (scheduled[id] !== undefined) {
            return sendJson(res, 500, 'Already scheduled');
        }

        var ms = timeoutTimestamp - Date.now();
        if (ms < 0) {
            return sendJson(res, 500, 'Timeout must be in the future');
        }

        console.log('timeout: ' + (ms));

        scheduled[id] = setTimeout(doUpdateState.bind(this, id, code, model), ms);

        res.status(200).json({
            success: true
        });
    });

    router.post('/unschedule', function(req, res, next) {
        var id = checkParam('id', req, res);
        if (id === false) {
            return;
        }

        if (scheduled[id] === undefined) {
            return sendJson(res, 500, 'Not scheduled');
        }

        clearTimeout(scheduled[id]);

        return sendJson(res, 200);
    });

    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'Scheduler'
        });
    });

    return router;
};
