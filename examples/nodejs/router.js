function route(handle, pathname, request) {
    'use strict';
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request);
    }
}
exports.route = route;