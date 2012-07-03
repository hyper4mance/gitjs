/*newcap: true*/
/*globals TestCase, GitJs, AsyncTestCase, assertFunction, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

TestCase("getReposByOrg", {
    setUp: function () {
        var me = this;

        this.gitjs = new GitJs();
        this.generateApiRequestOriginal = this.gitjs.generateApiRequest
        this.gitjs.generateApiRequest = function (apiCommand, data, httpVerb, dataType) {
            var request = me.generateApiRequestOriginal.apply(new GitJs(), arguments);
            request.send = function() {
                me.gitjs.sendApiRequestCalled = true;
            }
            me.apiRequest = request;
            return request;
        }
    },
    tearDown: function () {
        this.gitjs.generateApiRequest = this.generateApiRequestOriginal;

        delete this.generateApiRequestOriginal;
        delete this.gitjs;
        delete this.apiRequest;
    },


    "test getReposByOrg method with minimal options": function () {
        this.gitjs.getReposByOrg(function(){}, 'org');
        assertTypeOf('object', this.apiRequest);
        assertTrue(this.gitjs.sendApiRequestCalled);
        assertEquals('https://api.github.com/orgs/org/repos', this.apiRequest.url);
        assertEquals('jsonp', this.apiRequest.dataType);
        assertEquals('GET', this.apiRequest.httpVerb);
        assertUndefined(this.apiRequest.data.sort);
        assertUndefined(this.apiRequest.data.type);
        assertUndefined(this.apiRequest.data.direction);
    }
});