/*jslint browser: true, windows: true, safe: false, white: true */
/*global $:true */

'use strict';
function GitJs(config) {
    var defaults = {
        inheriting: false,
        clientId: undefined,
        accessToken: undefined,
        baseUrl: 'https://api.github.com',
        mode: 'read',
        apiErrorHandler: function () {},
        apiSuccessHandler: function () {}
    };

    this.config = $.extend(config, defaults);
    if (this.config.inheriting === false) {
        if (this.config.mode === 'write') {
            this.authenticateUser(this.config.accessToken);
        }
    }
}

GitJs.prototype.getCommandMethod = function (httpVerb) {
    var method = $.get;

    switch (httpVerb) {
        case 'GET':
            method = $.get;
            break;
        case 'POST':
            method = $.post;
            break;
    }
    return method;
};

GitJs.prototype.callApi = function (apiCommand, data, httpVerb, dataType) {
    var commandMethod = this.getCommandMethod(httpVerb || 'GET'),
        me = this;

    if (apiCommand[0] !== '/') {
        apiCommand = '/' + apiCommand;
    }

    return {
        url: 'https://api.github.com' + apiCommand,
        data: data || {},
        send: function (callback) {
            commandMethod.call(me, this.url, this.data, callback, dataType || 'jsonp');
        }
    };
};

GitJs.prototype.authenticateUser = function (callback) {
    this.callApi('/user', {
        access_token: this.config.accessToken
    }).send(callback);
};

GitJs.prototype.getGistComments = function (callback, gistId, commentId) {
    var apiCommand = '';
    if (commentId === undefined || isNaN(commentId) === true) {
        apiCommand = '/gists/' + gistId + '/comments';
    } else {
        apiCommand = '/gits/comments/' + commentId;
    }
    this.callApi(apiCommand).send(callback);
};

GitJs.prototype.getReposByUser = function (callback, username, type) {
    var apiCommand = '';
    if (username !== undefined) {
        apiCommand = '/users/' + username + '/repos';
    } else {
        apiCommand = '/user/repos';
    }
    this.callApi(apiCommand, {
        type: type || 'all'
    }).send(callback);
};

GitJs.prototype.getReposByOrg = function (callback, organization, type) {
    this.callApi('/orgs/' + organization + '/repos', {
        type: type || 'all'
    }).send(callback);
};