/*globals buster:true, $:true, GitJs:true*/

(function (G) {
    'use strict';
    var assert = buster.assert,
        refute = buster.refute;

    buster.testCase("getGistComments", {
        setUp: function () {
            testSetUp.call(this, G);
        },
        tearDown: function () {
            testTearDown.call(this, G);
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
        }
    });
}(GitJs));
