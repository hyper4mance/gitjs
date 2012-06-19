/*newcap: true*/
/*globals TestCase, GitJs, assertFunction, commandMethod, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

TestCase("generateApiRequestTest", {
    setUp: function () {
        this.gitjs = new GitJs();
    },
    tearDown: function () {
        delete this.gitJs;
    },

    "test generateApiRequest with minimal options": function () {
        var apiCommand = '/user/opnsrce/repos',
            apiRequest = this.generateApiRequest(apiCommand);
            
        this.assertTypeOf('function' , this.gitjs.generateApiRequest);
        this.assertUndefined(apiRequest.data);
        this.assertEquals('https://api.github.com' + apiCommand, apiRequest.url);
        this.assertTypeOf('function', apiRequest.send);
    }
});