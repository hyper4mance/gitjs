/*newcap: true*/
/*globals TestCase, GitJs, assertFunction, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

TestCase("callApiTest", {
    setUp: function () {
        this.gitjs = new GitJs();
    },
    tearDown: function () {
        delete this.gitJs;
    },

    "test callApi with minimal options": function () {
        var apiCommand = '/user/opnsrce/repos',
            expectedResult = {
                data: undefined,
                url: 'https://api.github.com' + apiCommand,
                send: function (callback) {
                    commandMethod.call(me, this.url, this.data, callback, dataType || 'jsonp');
                }                
            };
        this.assertEquals(this.gitjs.generateApiRequest(apiCommand), expectedResult);
            
    },
});