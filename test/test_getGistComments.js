/*globals buster:true, $:true, GitJs:true*/

(function (G) {
    'use strict';
    var assert = buster.assert,
        refute = buster.refute;

    buster.testCase("getGistComments", {
        setUp: function () {
            var me = this;

            this.gitjs = new G();
            this.generateApiRequestOriginal = this.gitjs.generateApiRequest;
            this.gitjs.generateApiRequest = function (apiCommand, data, httpVerb, dataType) {
                var request = me.generateApiRequestOriginal.apply(new GitJs(), arguments);
                request.send = function () {
                    me.gitjs.sendApiRequestCalled = true;
                };
                me.apiRequest = request;
                return request;
            };
        },
        tearDown: function () {
            this.gitjs.generateApiRequest = this.generateApiRequestOriginal;

            delete this.generateApiRequestOriginal;
            delete this.gitjs;
            delete this.apiRequest;
        },


        "test getGistComments method with minimal options": function () {
            var gistId = 500;

            this.gitjs.getGistComments(function () {}, gistId);
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/gists/' + gistId + '/comments', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.commentId);
        },

        "test getGistComments with all commentId": function() {
            var commentId = 1234;

            this.gitjs.getGistComments(function () {}, undefined, {commentId: commentId});
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/gists/comments/' + commentId, this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.commentId);
        },

        "test getGistComments method with invalid comment ID": function () {
            var gistId = 500,
                commentId = 'badValue';
            this.gitjs.getGistComments(function () {}, gistId, {commentId: commentId});
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/gists/' + gistId + '/comments', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.commentId);
        },
    });
}(GitJs));
