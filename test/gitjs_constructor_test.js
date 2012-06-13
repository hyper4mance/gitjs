/*newcap: true*/
/*globals TestCase, GitJs, assertFunction, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

TestCase("configDefaultsTest", {
    setUp: function () {
        this.gitjs = new GitJs();
    },
    tearDown: function () {
        delete this.gitJs;
    },
    "test default config options": function () {
        var configDefaults = {
            inheriting: false,
            clientId: undefined,
            accessToken: undefined,
            baseUrl: 'https://api.github.com',
            mode: 'read'
        };
        assertEquals(this.gitjs.config, configDefaults);
    },
    "test that this.gitjs is instance of GitJS": function () {
        assertTrue(this.gitjs instanceof GitJs);
    },
    "test that this.gitjs constructor is GitJs": function () {
        assertEquals(this.gitjs.constructor, GitJs);
    },
    "test default config override": function () {
        var expectedConfig = {
            inheriting: true,
            clientId: '123',
            accessToken: '456',
            baseUrl: 'https://www.cnn.com',
            mode: 'write'
        };

        this.gitjs = new GitJs(expectedConfig);

        assertEquals(this.gitjs.config, expectedConfig);
    }
});