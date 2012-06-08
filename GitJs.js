
/*
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*jslint browser: true, windows: true, safe: false, white: true */
/*global $:true */

'use strict';

/**
 * Creates a new GitJs object.
 * @constructor
 * @param {object} param - configuration object. See defaults variable for a list of possible properties.
 */
function GitJs(config) {
    var defaults = {
        inheriting: false,
        clientId: undefined,
        accessToken: undefined,
        baseUrl: 'https://api.github.com',
        mode: 'read'
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

GitJs.prototype.getReposByUser = function (callback, username, type, sort, direction) {
    var apiCommand = '';
    if (username !== undefined) {
        apiCommand = '/users/' + username + '/repos';
    } else {
        apiCommand = '/user/repos';
    }
    this.callApi(apiCommand, {
        type: type || undefined,
        sort: sort || undefined,
        direction: direction || undefined
    }).send(callback);
};

GitJs.prototype.getReposByOrg = function (callback, organization, type, sort, direction) {
    this.callApi('/orgs/' + organization + '/repos', {
        type: type || undefined,
        sort: sort || undefined,
        direction: direction || undefined
    }).send(callback);
};