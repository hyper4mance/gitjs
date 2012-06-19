/*newcap: true*/
/*globals TestCase, GitJs, AsyncTestCase, assertFunction, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

AsyncTestCase("getReposByOrg", {
    setUp: function () {
        this.gitjs = new GitJs();
    },
    tearDown: function () {
        delete this.gitJs;
    },

    "test getReposByOrg method with minimal options": function () {
        var organization = '',
            callback = function(data, textStatus, jqXhr) {
                assertTrue(data.length > 0);
                assertEquals(textStatus, '4500');    
            };
        this.gitjs.getReposByOrg(callback, organization);
    }
});