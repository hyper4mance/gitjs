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
            this.gitjs.getGistComments(function () {}, 500);
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/gists/500/comments', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.commentId);
        }
    });
}(GitJs));
