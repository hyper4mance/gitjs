var http = require('https'),
    url = require('url'),
    queryString = require('querystring');

function getToken(request) {
    'use strict';

    var parsedUrl = url.parse(request.url, true),
        options,
        req,
        clientId = '9161914a06ffaf898a7e',
        appSecret = '22689d87189698f4bbf05c90585b9ff7bd8602e7',
        temporaryCode = parsedUrl.query.code,
        state = parsedUrl.query.state,
        data = {
            client_id: clientId,
            client_secret: appSecret,
            code: temporaryCode,
            state: state
        },
        requestParams = queryString.stringify(data);

    options = {
        host: 'github.com',
        port: 443,
        path: '/login/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': requestParams.length
        }
    };
    req = http.request(options, function (response) {
        response.setEncoding('utf8');
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            console.log(str);
        });
    });

    req.on('error', function (e) {
        console.log(e);
        console.log('problem with request: ' + e.message);
    });
    req.write(requestParams);

    req.end();
}

exports.getToken = getToken;