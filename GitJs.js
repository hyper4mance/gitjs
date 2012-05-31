function GitJs(config) {
    'use strict';
    var defaults = {
        baseUrl: 'https://api.github.com',
        mode: 'read'
    };
    $.extend(config, defaults);
    this.config = config;
}

GitJs.prototype.callApi = function (apiCommand, data) {
    'use strict';
    data = data || {};

    if (apiCommand[0] !== '/') {
        apiCommand = '/' + apiCommand;
    }

    return {
        url: 'https://api.github.com' + apiCommand,
        data: data,
        send: function (callback) {
            $.get(this.url, this.data, callback);
        }
    };
};

GitJs.prototype.getGistComments = function (gistId, commentId, callback) {
    'use strict';
    var apiCommand = '';
    if (commentId === undefined || isNaN(commentId) === true) {
        apiCommand = '/gists/' + gistId + '/comments';
    } else {
        apiCommand = '/gits/comments/' + commentId;
    }
    this.callApi(apiCommand).send(callback);
};