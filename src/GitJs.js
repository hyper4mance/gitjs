
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
 *
 * @constructor
 * @param {object} config - configuration object. See defaults variable for a list of possible properties.
 */
function GitJs(config) {
    var defaults = {
        inheriting: false,
        clientId: undefined,
        accessToken: undefined,
        baseUrl: 'https://api.github.com',
        mode: 'read'
    };

    this.config = $.extend(defaults, config);
}

/**
 * Gets the jQuery method that GitJs#generateApiRequest is going to use to send the ajax request.
 *
 * @param {string} httpVerb The HTTP verb that the request will use,
 * @return string
 */
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

/**
 * Generates a request to be sent to the Github API.
 *
 * @param {string} apiCommand The Github API command (e.g., '/user') can start with a '/' but doesn't have to.
 * @param {object={}} data An object literal of command parameters to send along with the API request.
 * @param {string=GET} httpVerb The HTTP verb used to send the request. Defaults to 'GET'.
 * @param {string=jsonP} dataType The data type that the Github API will send its response in. Defaults to 'jsonp'
 */
GitJs.prototype.generateApiRequest = function (apiCommand, data, httpVerb, dataType) {
    
    var commandMethod,
        apiRequest,
        me = this;
    
    httpVerb = httpVerb || 'GET';
    dataType = dataType || 'jsonp';
    commandMethod = this.getCommandMethod();
    
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
};

/**
 * Authenticates a user with the Github API using an access token.
 *
 * @param {function(data, textStatus, jqXhr)=} callback
 */
GitJs.prototype.authenticateUser = function (callback) {
    this.generateApiRequest('/user', {
        access_token: this.config.accessToken
    }).send(callback);
};

/**
 * Get comments for a specific gist.
 *
 * @param {function(data, textStatus, jqXhr)} callback
 * @param {integer} gistId
 * @param {integer=} commentId If specified, only data about the specified comment will be returned.
 *
 */
GitJs.prototype.getGistComments = function (callback, gistId, commentId) {
    var apiCommand = '';
    if (commentId === undefined || isNaN(commentId) === true) {
        apiCommand = '/gists/' + gistId + '/comments';
    } else {
        apiCommand = '/gits/comments/' + commentId;
    }
    this.generateApiRequest(apiCommand).send(callback);
};

/**
 * Get a list of repos related to a user.
 *
 * @param {function(data, textStatus, jqXhr)} callback
 * @param {string=} username If not specified, repo date for the currently logged in user is returned.
 * @param {string=} type The type of data about a repo to return (e.g., 'public'). See API documention for a list of possible values.
 * @param {string=} sort What field to sort the data by.
 * @param {string=} direction What direction to sort the data by (ascending or descending).
 */
GitJs.prototype.getReposByUser = function (callback, username, type, sort, direction) {
    var apiCommand = '';
    if (username !== undefined) {
        apiCommand = '/users/' + username + '/repos';
    } else {
        apiCommand = '/user/repos';
    }
    this.generateApiRequest(apiCommand, {
        type: type || undefined,
        sort: sort || undefined,
        direction: direction || undefined
    }).send(callback);
};

/**
 * Gets information about respos belonging to a particular organization.
 *
 * @param {function(data, textStatus, jqXhr)} callback
 * @param {string} organization
 * @param {string=} type The type of data about a repo to return (e.g., 'public'). See API documention for a list of possible values.
 * @param {string=} sort What field to sort the data by.
 * @param {string=} direction What direction to sort the data by (ascending or descending).
 */
GitJs.prototype.getReposByOrg = function (callback, organization, type, sort, direction) {
    this.generateApiRequest('/orgs/' + organization + '/repos', {
        type: type || undefined,
        sort: sort || undefined,
        direction: direction || undefined
    }).send(callback);
};

/**
 * Gets a list of issues associated with the currently logged in user
 *
 * @param {function(data, textStatus, jqXhr)} callback
 * @param {string=} filter What kinds of issues to show (e.g., 'created' only shows issues created by you).
 * @param {string=} state What state the issues should be in (e.g., 'open').
 * @param {string=} labels String list of comma separated label names (e.g., bug, ui, @high).
 * @param {string=} sort What field to sort the data by.
 * @param {string=} direction What direction to sort the data by (ascending or descending).
 * @param {string=} since Only show issues since... (timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ).
 *
 */
GitJs.prototype.getIssuesByUser = function(callback, filter, state, labels, sort, direction, since) {
    this.generateApiRequest('/issues?access_token='+ this.config.accessToken, {
        filter: filter || undefined,
        state: state || undefined,
        labels: labels || undefined,
        sort: sort || undefined,
        direction: direction || undefined,
        since: since || undefined
    }, 'GET').send(callback);
};

GitJs.prototype.getIssue = function(callback, user, repo, issueNumber) {
    this.generateApiRequest('/repos/' + user + '/' + repo + '/issues/' + issueNumber).send(callback);
};

GitJs.prototype.createIssue = function(callback, user, repo, options) {
    options = options || {};
    this.generateApiRequest('/repos/' + user + '/' + repo + '/issues', {
        title: options.title || undefined, 
        body: options.body || undefined,
        assignee: options.assignee || undefined, 
        milestone: options.milestone || undefined,
        labels: options.labels || undefined     
    }, 'POST').send(callback);
    
};

/**
* Generates a link that, when clicked on, will prompt the user to grant the application access to their Github account.
*
* @param {string} clientId The client ID of the application being authorized.
* @param {scope=} string A CSV string representing what scope the application will request.
* @param {redirectUri} The URI the browser should be redirected to once the app is authorized.
*/
GitJs.prototype.generateAuthorizationLink = function(clientId, scope, redirectUri) {
    var urlParams = [
        'client_id=' + clientId
    ];
    if(scope !== undefined) {
        urlParams.push('scope=' + scope);
    }
    if(redirectUri !== undefined) {
        urlParams.push('redirect_uri=' + redirectUri);
    }
    return 'https://github.com/login/oauth/authorize?' + urlParams.join('&');
};

/**
* Gets information about comments on a gist.
*
* @param {function(data, textStatus, jqXhr)} callback
* @param {integer=} gistId The Id of the gist that the comments belong to.
* @param {integer=} commentId The Id of an individual comment to be retrieved. If absent, all gist comments are returned. 
*/
GitJs.prototype.getGistComments = function(callback, gistId, commentId) {
    var apiCommand = '/gists/:gist_id/comments';
    if(commentId !== undefined) {
        apiCommand = '/gists/comments/' + commentId;
    }
    this.generateApiRequest(apiCommand).send(callback);
};

/**
* Creates a comment on a gist.
*
* @param {function(data, textStatus, jqXhr)} callback
* @param {integer} gistId The Id of the gist that the comment should belong to.
* @param {string} comment
*/
GitJs.prototype.createGistComment = function(callback, gistId, comment) {
    this.generateApiRequest('/gists' + gistId + '/comments', {
        body: comment
    }).send(callback);
};