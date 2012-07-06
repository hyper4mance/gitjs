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

var GitJs = (function ($) {
    'use strict';

    /**
     * Constructor
     *
     * @param {object} config
     * @param {boolean} [config.inheriting=false] Whether or not the constructor is being
     *   called as part of the prototype for another object.
     * @param {string} [config.clientId] The client Id of your application.
     * @param {string} [config.accessToken] The access token of the currently logged in user.
     * @param {baseUrl} [config.baseUrl=https://api.github.com] The base url used to send all commands to the api.
     */
    var G = function (config) {
        if (config === undefined) {
            config = {};
        }
        this.config = {
            inheriting: config.inheriting || false,
            clientId: config.clientId,
            accessToken: config.accessToken,
            baseUrl: config.baseUrl || 'https://api.github.com'
        };
    };

    /**
     * Gets the jQuery method that GitJs#generateApiRequest is going to use to send the ajax request.
     *
     * @param {string} httpVerb The HTTP verb that the request will use,
     * @return string
     */
    function getCommandMethod(httpVerb) {
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
    }

    G.prototype = {
        constructor: G,

        /**
         * Generates a request to be sent to the Github API.
         *
         * @param {string} apiCommand The Github API command (e.g., '/user') can start with a '/' but doesn't have to.
         * @param {object} [data] An object literal of command parameters to send along with the API request.
         * @param {string} [httpVerb=GET] The HTTP verb used to send the request. Defaults to 'GET'.
         * @param {string} [dataType=jsonp] The data type that the Github API will send its response in. Defaults to 'jsonp'
         */
        generateApiRequest: function (apiCommand, data, httpVerb, dataType) {
            var commandMethod,
                apiRequest,
                requestSendMethod,
                me = this;

            httpVerb = httpVerb || 'GET';
            dataType = dataType || 'jsonp';
            commandMethod = getCommandMethod();

            if (apiCommand[0] !== '/') {
                apiCommand = '/' + apiCommand;
            }

            apiRequest = {
                url: 'https://api.github.com' + apiCommand,
                data: data || {},
                dataType: dataType,
                httpVerb: httpVerb,
                send: function (callback) {
                    commandMethod.call(me, this.url, this.data, callback);
                    return apiRequest;
                }
            };

            return apiRequest;
        },

        /**
         * Generates a link that, when clicked on, will prompt the user to grant the application access to their Github account.
         *
         * @param {string} clientId The client ID of the application being authorized.
         * @param {object} [options] A CSV string representing what scope the application will request.
         * @param {string} [options.scope] A CSV string representing what scope the application will request.
         * @param {string} [options.redirectUri] The URI the browser should be redirected to once the app is authorized.
         */
        generateAuthorizationLink: function (clientId, options) {
            options = options || {};

            var urlParams = ['client_id=' + clientId],
                scope = options.scope,
                redirectUri = options.redirectUri;

            if (scope !== undefined) {
                urlParams.push('scope=' + scope);
            }
            if (redirectUri !== undefined) {
                urlParams.push('redirect_uri=' + redirectUri);
            }
            return 'https://github.com/login/oauth/authorize?' + urlParams.join('&');
        },

        /**
         * Get comments for a specific gist.
         *
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {integer} gistId
         * @param {object} options Additional options used when retrieving comments
         * @param {integer} [options.commentId] The Id of a specific comment that should be returned.
         *   If not specified, all comments for the given gist are returned.
         *
         */
        getGistComments: function (callback, gistId, options) {
            options = options || {};

            var apiCommand = '',
                commentId = options.commentId;

            if (commentId === undefined || isNaN(commentId) === true) {
                apiCommand = '/gists/' + gistId + '/comments';
            } else {
                apiCommand = '/gits/comments/' + options.commentId;
            }
            this.generateApiRequest(apiCommand).send(callback);
        },
        /**
         * Get a list of repos related to a user.
         *
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {string=} [username] What user the repos should belong to. If not specified,
         *   repo date for the currently logged in user is returned.
         * @param {object} options
         * @param {string} [options.type] The type of data about a repo to return (e.g., 'public').
         *   See API documention for a list of possible values.
         * @param {string} [options.sort] What field to sort the data by.
         * @param {string} [options.direction] What direction to sort the data by (ascending or descending).
         */
        getReposByUser: function (callback, username, options) {
            options = options || {};

            var apiCommand = '',
                type = options.type,
                sort = options.sort,
                direction = options.direction;
            if (username !== undefined) {
                apiCommand = '/users/' + username + '/repos';
            } else {
                apiCommand = '/user/repos';
            }
            this.generateApiRequest(apiCommand, {
                type: type,
                sort: sort,
                direction: direction
            }).send(callback);
        },

        /**
         * Gets information about respos belonging to a particular organization.
         *
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {string} organization
         * @param {object} options
         * @param {string} [options.type] The type of data about a repo to return (e.g., 'public'). See API documention for a list of possible values.
         * @param {string} [options.sort] What field to sort the data by.
         * @param {string} [options.direction] What direction to sort the data by (ascending or descending).
         */
        getReposByOrg: function (callback, organization, options) {
            options = options || {};

            var apiCommand = '/orgs/' + organization + '/repos',
                type = options.type,
                sort = options.sort,
                direction = options.direction;

            this.generateApiRequest(apiCommand, {
                type: type,
                sort: sort,
                direction: direction
            }).send(callback);
        },

        /**
         * Gets a list of issues associated with the currently logged in user
         *
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} [options]
         * @param {string} [options.filter] What kinds of issues to show (e.g., 'created' only shows issues created by you).
         * @param {string} [options.state] What state the issues should be in (e.g., 'open').
         * @param {string} [options.labels] String list of comma separated label names (e.g., bug, ui, @high).
         * @param {string} [options.sort] What field to sort the data by.
         * @param {string} [options.direction] What direction to sort the data by (ascending or descending).
         * @param {string} [options.since] Only show issues since the given timestamp
         *
         */
        getIssuesByUser: function (callback, options) {
            options = options || {};

            var apiCommand = '/issues?access_token=' + this.config.accessToken,
                filter = options.filter,
                state = options.state,
                labels = options.labels,
                sort = options.sort,
                direction = options.direction,
                since = options.since;

            this.generateApiRequest(apiCommand, {
                filter: filter,
                state: state,
                labels: labels,
                sort: sort,
                direction: direction,
                since: since
            }, 'GET').send(callback);
        },
        getIssue: function (callback, user, repo, issueNumber) {
            this.generateApiRequest('/repos/' + user + '/' + repo + '/issues/' + issueNumber).send(callback);
        },

        createIssue: function (callback, user, repo, options) {
            options = options || {};

            var apiCommand = '/repos/' + user + '/' + repo + '/issues',
                title = options.title,
                body = options.body,
                assignee = options.assignee,
                milestone = options.milestone,
                labels = options.labels;

            this.generateApiRequest(apiCommand, {
                title: title,
                body: body,
                assignee: assignee,
                milestone: milestone,
                labels: labels
            }, 'POST').send(callback);

        },

        editIssue: function (callback, user, repo, issueNumber, options) {
            options = options || {};

            var apiCommand = '/repos/' + user + '/' + repo + 'issues/' + issueNumber,
                title = options.title,
                body = options.body,
                assignee = options.assignee,
                state = options.state,
                milestone = options.milestone,
                labels = options.labels;

            this.generateApiRequest(apiCommand, {
                title: title,
                body: body,
                assignee: assignee,
                state: state,
                milestone: milestone,
                labels: labels
            }, 'POST').send(callback);
        },

        /**
         * Creates a comment on a gist.
         *
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {integer} gistId The Id of the gist that the comment should belong to.
         * @param {string} comment
         */
        createGistComment: function (callback, gistId, comment) {
            var apiCommand = '/gists' + gistId + '/comments';

            this.generateApiRequest(apiCommand, {
                body: comment
            }).send(callback);
        },
        getTree: function (callback, user, repo, sha, recursive) {
            var apiCommand = '/repos/' + user + '/' + repo + '/' + sha;

            if (recursive === true) {
                apiCommand += '?recursive=1';
            }
            this.generateApiRequest(apiCommand).send(callback);
        }
    };

    return G;
}($));
