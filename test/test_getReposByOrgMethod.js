/*globals buster:true, $:true, GitJs:true*/
'use strict';
(function(G, $) {
    var assert = buster.assert,
        refute = buster.refute;

    buster.testCase("getReposByOrg", {
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


        "test getReposByOrg method with minimal options": function () {
            this.gitjs.getReposByOrg(function(){}, 'org');
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/orgs/org/repos', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.sort);
            refute.defined(this.apiRequest.data.type);
            refute.defined(this.apiRequest.data.direction);
        }
    });
}(GitJs));
