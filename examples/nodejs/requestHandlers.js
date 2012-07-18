var http = require('https'),
    url = require('url'),
    queryString = require('querystring');

function getToken(request, response) {
    'use strict';
    console.log('routing request for getToken');
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
    req = http.request(options, function (reqResponse) {
        var str = '';
        reqResponse.setEncoding('utf8');
        reqResponse.on('data', function (chunk) {
            str += chunk;
            console.log(str);
        });

        reqResponse.on('end', function () {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write('<script>');

            response.write('window.opener.postMessage("' + str + '", "*");');
            response.write('console.log(window.opener);');
            response.write('</script>');
            response.end();
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    req.write(requestParams);
    req.end();
}

function checkStatus(request, response) {
    'use strict';
    var parsedUrl = url.parse(request.url, true),
        callback = parsedUrl.query.callback;

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(callback + '()');
    response.end();
}

exports.getToken = getToken;
exports.checkStatus = checkStatus;