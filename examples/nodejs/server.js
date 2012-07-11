var http = require("http");

function start() {
    'use strict';

    function onRequest(request, response) {
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;
