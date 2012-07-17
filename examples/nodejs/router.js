function route(handle, pathname, request, response) {
    'use strict';
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    }
}
exports.route = route;