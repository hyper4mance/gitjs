/*globals buster:true, $:true, GitJs:true*/

(function (G) {
    'use strict';
    var assert = buster.assert,
        refute = buster.refute;

    buster.testCase("getReposByOrg", {
        setUp: function () {
            testSetUp.call(this, G);
        },
        tearDown: function () {
            testTearDown.call(this, G);
        },

        "test getReposByOrg method with minimal options": function () {
            this.gitjs.getReposByOrg(function () {}, 'org');
            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/orgs/org/repos', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.sort);
            refute.defined(this.apiRequest.data.type);
            refute.defined(this.apiRequest.data.direction);
        },

        "test getReposByOrg method with type": function () {
            var type = 'public';

            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/orgs/org/repos', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            refute.defined(this.apiRequest.data.sort);
            assert.equals(type, this.apiRequest.data.type);
            refute.defined(this.apiRequest.data.direction);
        },

        "test getReposByOrg method with type, date": function () {
            var type = 'public',
                sort = 'date';

            assert.isObject(this.apiRequest);
            assert(this.gitjs.sendApiRequestCalled);
            assert.equals('https://api.github.com/orgs/org/repos', this.apiRequest.url);
            assert.equals('jsonp', this.apiRequest.dataType);
            assert.equals('GET', this.apiRequest.httpVerb);
            assert.equals('date', his.apiRequest.data.sort);
            assert.equals(type, this.apiRequest.data.type);
            refute.defined(this.apiRequest.data.direction);
        }
    });
}(GitJs));
