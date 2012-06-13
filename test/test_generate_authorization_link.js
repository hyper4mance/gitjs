/*newcap: true*/
/*globals TestCase, GitJs, assertFunction, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

TestCase("generateAuthorizationLinksTest", {
    setUp: function () {
        this.gitjs = new GitJs();
    },
    tearDown: function () {
        delete this.gitJs;
    },

    "test generateAuthorizationLink method with minimal options": function () {
        var expectedResult = 'https://github.com/login/oauth/authorize?client_id=123';
        assertEquals(this.gitjs.generateAuthorizationLink('123'), expectedResult);
    },
    "test generateAuthorizationLink method with all options": function () {
        var expectedResult = 'https://github.com/login/oauth/authorize?client_id=123&scope=public&redirect_uri=http://www.cnn.com';
        assertEquals(this.gitjs.generateAuthorizationLink('123', 'public', 'http://www.cnn.com'), expectedResult);
    }
});