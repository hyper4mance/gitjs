function start(route, handle) {
    'use strict';
    var http = require("http"),
        url = require("url");
    function onRequest(request, response) {
        var requestUrl = url.parse(request.url, true),
            pathname = requestUrl.pathname;

        route(handle, pathname, request, response);
        response.end();
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;