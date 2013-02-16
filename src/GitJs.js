/*
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including
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

/**
 * GitJS is a JavaScript library for interacting with the version 3
 *   of the Github API.
 *
 * @overview
 * @author Levi Hackwith
 * @version 1.0
 * @copyright 2012 Levi Hackwith
 */

var GitJs = (function ($) {
    'use strict';
    var G,
        createApiRequest,
        getCommandMethod;

    /**
     * Class constructor.
     *
     * @public
     * @constructs GitJs
     * @param {object} config
     * @param {boolean} [config.inheriting=false] Whether or not the constructor is being
     *   called as part of the prototype for another object.
     * @param {string} [config.clientId] The client Id of your application.
     * @param {string} [config.accessToken] The access token of the currently logged in user.
     * @param {baseUrl} [config.baseUrl=https://api.github.com] The base url used to send all commands to the api.
     */
    G = function (config) {
        if (config === undefined) {
            config = {};
        }

        /**
         * Stores the configuration object passed into the constructor.
         *
         * @type Object
         */
        this.config = {
            inheriting: config.inheriting || false,
            clientId: config.clientId,
            accessToken: config.accessToken,
            baseUrl: config.baseUrl || 'https://api.github.com'
        };
    };

    /**
     * Gets the jQuery method that GitJs#createApiRequest is going to use to send the ajax request.
     *
     * @private
     * @param {string} httpVerb The HTTP verb that the request will use,
     * @return function
     */
    getCommandMethod = function (httpVerb) {
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

    /**
     * Generates a request to be sent to the Github API.
     *
     * @private
     * @scope GitJs
     * @param {string} apiCommand The Github API command (e.g., '/user') can start with a '/' but doesn't have to.
     * @param {object} [data] An object literal of command parameters to send along with the API request.
     * @param {string} [httpVerb=GET] The HTTP verb used to send the request. Defaults to 'GET'.
     * @param {string} [dataType=jsonp] The data type that the Github API will send its response in. Defaults to 'jsonp'
         * @example
         *     var gitJs = new GitJs(configObject),
         *         requestData = {};
         *
         *     GitJs.createApiRequest('/user/opnsrce/repos', requestData, 'GET', 'jsonp').send(myCallback);
     */
    createApiRequest = function (apiCommand, data, httpVerb, dataType) {
        var commandMethod,
            apiRequest,
            me = this;

        httpVerb = httpVerb || 'GET';
        dataType = httpVerb !== 'GET' ? 'json' : (dataType || 'jsonp');
        if (me.config.accessToken !== undefined) {
            apiCommand += '?access_token=' + this.config.accessToken;
        }
        commandMethod = getCommandMethod(httpVerb);

        if (apiCommand[0] !== '/') {
            apiCommand = '/' + apiCommand;
        }

        apiRequest = {
            url: me.baseUrl + apiCommand,
            data: data || {},
            dataType: dataType,
            httpVerb: httpVerb,
            send: function (callback) {
                if (typeof callback !== 'function') {
                    throw new TypeError('EnvatoMarketPlace::apiRequest callback must be a function');
                }
                commandMethod.call(me, me.url, (httpVerb === 'GET') ? data : JSON.stringify(me.data), callback, dataType);
                return apiRequest;
            }
        };

        return apiRequest;
    };

    G.prototype = {
        constructor: G,

        /**
         * Generates a link that, when clicked on, will prompt the user to grant the application access to their Github account.
         *
         * @public
         * @param {string} clientId The client ID of the application being authorized.
         * @param {object} [options] A CSV string representing what scope the application will request.
         * @param {string} [options.scope] A CSV string representing what scope the application will request.
         * @param {string} [options.redirectUri] The URI the browser should be redirected to once the app is authorized.
         * @example
         *     var gitJs = new GitJs(configObject),
         *         authorizationLink;
         *
         *     var authorizationLink = gitJs.generateAuthorizationLink('123345', {
         *         scope: 'user,public',
         *         redirectUri: 'http://www.mywebsite.com/requestToken'
         *     });
         *
         *     document.write('&lt;a href = "' + authorizationLink + '"&gt;Authorize My Application&lt;/a&gt;');
         *
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
         * Authenticates a user with the Github API.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} [accessToken] The access token to log the user in with. If not provided, the access token
         *   from the constructor's config object will be used.
         */
        authenticateUser: function (callback, accessToken) {
            var apiRequest = createApiRequest.call(this, '/user', {
                access_token: accessToken || this.config.accessToken
            });

            apiRequest.send(callback);

            return apiRequest;
        },

        /**
         * Get comments for a specific gist.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {integer} gistId
         * @param {object} options Additional options used when retrieving comments
         * @param {integer} [options.commentId] The Id of a specific comment that should be returned.
         *   If not specified, all comments for the given gist are returned.
         *
         */
        getGistComments: function (callback, gistId, options) {
            var apiCommand,
                commentId,
                apiRequest;

            options = options || {};
            commentId = options.commentId;

            if (commentId === undefined || isNaN(commentId) === true) {
                apiCommand = '/gists/' + gistId + '/comments';
            } else {
                apiCommand = '/gists/comments/' + options.commentId;
            }
            apiRequest = createApiRequest.call(this, apiCommand);

            apiRequest.send(callback);

            return apiRequest;
        },

        /**
         * Get a list of repos related to a user.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} [username] What user the repos should belong to. If not specified,
         *   repo date for the currently logged in user is returned.
         * @param {object} options
         * @param {string} [options.type] The type of data about a repo to return (e.g., 'public').
         *   See API documention for a list of possible values.
         * @param {string} [options.sort] What field to sort the data by.
         * @param {string} [options.direction] What direction to sort the data by (ascending or descending).
         */
        getReposByUser: function (callback, username, options) {
            var apiCommand = '',
                apiRequest;

            options = options || {};

            if (username !== undefined) {
                apiCommand = '/users/' + username + '/repos';
            } else {
                apiCommand = '/user/repos';
            }

            apiRequest = createApiRequest.call(this, apiCommand, {
                type: options.type,
                sort: options.sort,
                direction: options.direction

            });

            apiRequest.send(callback);

            return apiRequest;
        },

        /**
         * Gets information about respos belonging to a particular organization.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} organization
         * @param {object} options
         * @param {string} [options.type] The type of data about a repo to return (e.g., 'public'). See API documention for a list of possible values.
         * @param {string} [options.sort] What field to sort the data by.
         * @param {string} [options.direction] What direction to sort the data by (ascending or descending).
         */
        getReposByOrg: function (callback, organization, options) {
            var apiRequest,
                apiCommand = '/orgs/' + organization + '/repos';


            options = options || {};

            apiRequest = createApiRequest.call(this, apiCommand, {
                type: options.type,
                sort: options.sort,
                direction: options.direction
            });

            apiRequest.send(callback);

            return apiRequest;
        },

        /**
         * Gets a list of issues associated with the currently logged in user.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
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

            var apiCommand = '/issues',
                apiRequest;

            options = options || {};

            apiRequest = createApiRequest.call(this, apiCommand, {
                filter: options.filter,
                state: options.state,
                labels: options.labels,
                sort: options.sort,
                direction: options.direction,
                since: options.since
            }, 'GET').send(callback);

            return apiRequest;
        },

        /**
         * Get issues for a specific repo.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user that the repo should belong to.
         * @param {string} repo The repo that the issue should belong to.
         * @param {object} [options]
         * @param {string|integer} [options.milestone] The milestone the issue should belong to.
         *   Possible values are "none" (no milestone), "*" (any milestone), or an integer
         *   specifying the specific milestone the issues should belong to.
         * @param {string} [options.state] The state the issues should be in. Possible
         *   values are "open" or "closed".
         * @param {string} [options.assignee] The user that the issues should be assigned to.
         *   possible values are "none" (not assigned), "*" (assigned to anyone), or the name
         *   of the specific user the issue should be assigned to.
         * @param {string} [options.mentioned] The user that the issues should metion.
         * @param {string} [options.labels] A list of comma separated Label names. Example: bug,ui,@high.
         * @param {string} [options.sort] What field to sort the data by.
         * @param {string} [options.direction] What direction to sort the data by (ascending or descending).
         * @param {string} [options.since] Only show issues since the given timestamp.
         */
        getIssuesByRepo: function (callback, user, repo, options) {
            options = options || {};

            var apiCommand = '/repos/' + user + '/' + repo + '/issues',
                apiRequest,
                data = {
                    milestone: options.milestone,
                    state: options.state,
                    assignee: options.assignee,
                    mention: options.mentioned,
                    labels: options.labels,
                    sort: options.sort,
                    direction: options.direction,
                    since: options.since
                };

            apiRequest = createApiRequest.call(this, apiCommand, data).send(callback);

            return apiRequest;
        },

        /**
         * Create a new issue against a repository.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user that the repo should belong to.
         * @param {string} repo The repo that the issue should belong to.
         * @param {object} options
         * @param {string} options.title The title of the issue.
         * @param {string} [options.body] The body of the issue.
         * @param {string} [options.assignee] The login for the user that this issue should be assigned to.
         * @param {string} [options.milestone] The milestone to associate this issue with.
         * @param {string[]} [options.labels] An array of labels to associate with this issue.
         */
        createIssue: function (callback, user, repo, options) {
            var apiCommand = '/repos/' + user + '/' + repo + '/issues',
                apiRequest;

            options = options || {};

            apiRequest = createApiRequest.call(this, apiCommand, {
                title: options.title,
                body: options.body,
                assignee: options.assignee,
                milestone: options.milestone,
                labels: options.labels
            }, 'POST');

            apiRequest.send(callback);

            return apiRequest;
        },


        /**
         * Edit an issue.
         *
         * @public
         * @param {Function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user that the repo should belong to.
         * @param {string} repo The repo that the issue should belong to.
         * @param {integer} issueNumber The number of the issue to edit.
         * @param {string} options.title The title of the issue.
         * @param {string} [options.body] The body of the issue.
         * @param {string} [options.assignee] The Login for the user that this issue should be assigned to.
         * @param {string} [options.state] The state the issue should be set to ('open' or 'closed')
         * @param {string} [options.milestone] The milestone to associate this issue with.
         * @param {string[]} [options.labels] An array of labels to associate with this issue.
         * @param {object} options
         */
        editIssue: function (callback, user, repo, issueNumber, options) {
            options = options || {};

            var apiCommand = '/repos/' + user + '/' + repo + 'issues/' + issueNumber,
                apiRequest;

            apiRequest = createApiRequest.call(this, apiCommand, {
                title: options.title,
                body: options.body,
                assignee: options.assignee,
                state: options.state,
                milestone: options.milestone,
                labels: options.labels
            }, 'POST').send(callback);

            return apiRequest;
        },

        /**
         * Creates a comment on a gist.
         *
         * @public
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {integer} gistId The Id of the gist that the comment should belong to.
         * @param {string} comment
         */
        createGistComment: function (callback, gistId, comment) {
            var apiCommand = '/gists' + gistId + '/comments',
                apiRequest;

            apiRequest = createApiRequest.call(this, apiCommand, {
                body: comment
            }).send(callback);

            return apiRequest;
        },

        /**
         * Gets a tree.
         *
         * @public
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user the repo should belong to.
         * @param {string} repo The repo the tree data should belong to.
         * @param {string} sha The sha the tree data should belong to.
         * @param {boolean} [recursive=false] If true, the tree's data will be retrieved recursively.
         */
        getTree: function (callback, user, repo, sha, recursive) {
            recursive = recursive || false;

            var apiCommand = '/repos/' + user + '/' + repo + '/' + sha;

            if (recursive === true) {
                apiCommand += '?recursive=1';
            }
            this.generateApiRequest(apiCommand).send(callback);
        },

        /**
         * Creates a tree.
         *
         * @public
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user the repo belongs to.
         * @param {string} repo The repo the tree belongs to.
         * @param {object} options
         * @param {object[]} options.trees Array of Hash objects (of path, mode, type and sha) specifying a tree structure.
         *   See API documentation for hash properties.
         */
        createTree: function (callback, user, repo, options) {
            var apiCommand = '/repos/' + user + '/' + repo + '/git/trees',
                baseTree = options.baseTree,
                trees = options.tree;

            this.generateApiRequest(apiCommand, {
                baseTree: baseTree,
                tree: trees
            }).send(callback);
        },

        /**
         * Get info about a particular tag.
         *
         * @public
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user the repo belongs to.
         * @param {string} repo The repo the tag belongs to.
         * @param {string} sha The SHA of the tag.
         */
        getTagInfo: function (callback, user, repo, sha) {
            var apiCommand = '/repos/' + user + '/' + repo + '/git/tags/' + sha;

            this.generateApiRequest(apiCommand).send(callback);
        },

        createTag: function (callback, user, repo, options) {
            var apiCommand = '/repos/' + user + '/' + repo + '/git/tags',
                tags = options.tags,
                message = options.message,
                object = options.object,
                tagger = options.tagger;

            this.generateApiRequest(apiCommand, {
                tags: tags,
                message: message,
                object: object,
                tagger: tagger
            }).send(callback);
        },

        getBlobInfo: function (callback, user, repo, sha) {
            var apiCommand = '/repos/' + user + '/' + repo + 'git/blobs/' + sha;

            this.generateApiRequest(apiCommand).send(callback);
        },

        createBlob: function (callback, user, repo, options) {
            options = options || {};

            var apiCommand = '/repos/' + user + '/' + repo + '/git/blobs',
                content = options.content,
                encoding = options.encoding || 'UTF-8';

            this.generateApiRequest(apiCommand, {
                content: content,
                encoding: encoding
            }, 'POST').send(callback);
        },

        getCommitInfo: function (callback, user, repo, sha) {
            var apiCommand = '/repos/' + user + '/' + repo + '/commits/' + sha;

            this.generateApiRequest(apiCommand).send(callback);
        },

        createCommit: function (callback, user, repo, options) {
            var apiCommand = '/repos/' + user + '/' + repo + '/git/commits',
                message = options.message,
                tree = options.tree,
                parents = options.parents,
                author = options.author,
                committer = options.committer,
                data = {
                    message: message,
                    tree: tree,
                    parents: parents
                };

            if (committer !== undefined && typeof committer === 'object') {
                data.committer = committer;
            }
            if (author !== undefined && typeof author === 'object') {
                data.author = author;
            }

            this.generateApiRequest(apiCommand, data, 'POST').send(callback);
        },

        getReferenceInfo: function (callback, user, repo, options) {
            options = options || {};

            var apiCommand = '/repos/' + user + '/' + repo + '/git/refs/',
                reference = options.reference,
                getByTag = options.getByTag || false;

            if (reference) {
                apiCommand += reference;
            } else if (getByTag === true) {
                apiCommand += 'tag';
            }

            this.generateApiRequest(apiCommand).send(callback);
        },

        /**
         * Creates a reference.
         *
         * @public
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user the repo should belong to
         * @param {string} repo The repo the reference should belong to
         * @param {object} options
         * @param {string} options.ref The name of the fully qualified reference (ie: refs/heads/master).
         *   If it doesn’t start with ‘refs’ and have at least two slashes, it will be rejected.
         * @param {string} options.sha The SHA1 value to set this reference to.
         */
        createReference: function (callback, user, repo, options) {
            var apiCommand = '/repos/' + user + '/' + repo + '/git/refs',
                apiRequest;

            apiRequest = createApiRequest.call(this, apiCommand, {
                ref: options.ref,
                sha: options.sha
            }, 'POST').send(callback);

            return apiRequest;
        },

        /**
         * Deletes a reference.
         *
         * @public
         * @param {function(data, textStatus, jqXhr)} callback
         * @param {object} callback.data A JSON object containing the response from the server.
         * @param {object} callback.text The text response from the server.
         * @param {object} callback.jqXhr jqXR object ({@link http://api.jquery.com/types/#jqXHR})
         * @param {string} user The user the repo belongs to.
         * @param {string} repo The repo the reference belongs to.
         * @param {string} reference The reference to delete.
         */
        deleteReference: function (callback, user, repo, reference) {
            var apiCommand = '/repos/' + user + '/' + repo + '/git/refs/' + reference,
                apiRequest;

            apiRequest = createApiRequest.call(this, apiCommand, {}, 'POST').send(callback);

            return apiRequest;
        }
    };

    return G;
}($));