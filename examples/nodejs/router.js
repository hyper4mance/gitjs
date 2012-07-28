function route(handle, pathname, request, response) {
    'use strict';
    var fs = require('fs'),
        html;

    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else {
        if (pathname !== '/favicon.ico') {
            try {
                html = fs.readFileSync('./' + pathname, 'ascii');
                response.write(html);
                response.end();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

exports.route = route;