function route(handle, pathname, request, response) {
    'use strict';
    var fs = require('fs'),
        html,
        filePath;

    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else {
        if (pathname !== '/favicon.ico') {
            try {
                filePath = './' + pathname;
                console.log('Loading ' + filePath);
                html = fs.readFileSync(filePath);
                response.write(html);
                response.end();
            } catch (err) {
                console.log('Unable to load ' + filePath);
                response.end();
            }
        }
    }
}

exports.route = route;