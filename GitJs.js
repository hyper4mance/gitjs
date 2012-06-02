function GitJs(config) {
    'use strict';
    var defaults = {
        inheriting: false,
        clientId: undefined,
        accessToken: undefined,
        baseUrl: 'https://api.github.com',
        mode: 'read',
        apiErrorHandler: function () {},
        apiSuccessHandler: function () {}
    },
    init = function () {
        switch(this.config.mode) {
            case 'read':
                break;
            case 'write':
                break;
            default:
                throw this.config.mode + " is not a valid 'mode' value. Accepted values are 'read' and 'write'.";
        }
    };
    $.extend(config, defaults);
    this.config = config;
    if(this.config.inheriting == false) {
        init();
    }
}

GitJs.prototype.getCommandMethod = function (httpVerb) {
    var method = $.get;
    switch(httpVerb) {
        case 'GET':
            method = $.get;
            break;
        case 'POST':
            method = $.post;
            break;
    }
    return method;
}

GitJs.prototype.callApi = function (apiCommand, data, httpVerb) {
    'use strict';

    var commandMethod = this.getCommandMethod(httpVerb || 'GET'),
        me = this;

    if (apiCommand[0] !== '/') {
        apiCommand = '/' + apiCommand;
    }

    return {
        url: 'https://api.github.com' + apiCommand,
        data: data || {},
        send: function (callback) {
            commandMethod.call(me, this.url, this.data, callback, 'json');
        }
    };
};

GitJs.prototype.authenticateUser = function (accessToken) {
    accessToken = accessToken || this.config.accessToken;
    this.config.accessToken = accessToken;
    this.callApi('/', {
        access_token: this.accessToken
    });
}

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

GitJs.prototype.getReposByUser = function(username, type, callback) {
    var apiCommand = '';
    if(username !== undefined) {
        apiCommand = '/users/' + username + '/repos';
    } else {
        apiCommand = '/users/repos';
    }
    this.callApi(apiCommand, {
        type: type || 'all'
    }).send(callback);
}