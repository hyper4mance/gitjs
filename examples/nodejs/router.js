function route(handle, pathname, request, response) {
    'use strict';
    var fs = require('fs'),
        html;
        
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else {
        try {
            html = fs.readFileSync('./' + pathname, 'ascii');
            response.write(html);
            response.end();
        } catch (err) {
            response.write(err);
        }
    }
    response.end();
}

exports.route = route;