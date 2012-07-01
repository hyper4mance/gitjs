/*newcap: true*/
/*globals TestCase, GitJs, assertFunction, assertTypeOf, commandMethod, assertException, assertNoException, assertEquals, assert, assertNull, assertSame, assertFalse, assertTrue*/

'use strict';

TestCase("generateApiRequestTest", {
    setUp: function () {
        this.$get = $.get;
        this.$post = $.post;
        $.get = function() {
            $.get.called = true;
        };        
        this.gitjs = new GitJs();
    },
    tearDown: function () {
        $.get = this.$get;
        $.post = this.$post;
        
        delete this.gitjs;
        delete this.$get;
        delete this.$post;
    },

    "test generateApiRequest with minimal options": function () {
        var apiCommand = '/user/opnsrce/repos',
            apiRequest = this.gitjs.generateApiRequest(apiCommand);
        
        apiRequest.send();
        
        assertTypeOf('object', apiRequest.data);
        assertEquals(0, Object.keys(apiRequest.data).length);
        assertEquals('https://api.github.com' + apiCommand, apiRequest.url);
        assertTypeOf('function', apiRequest.send);
        assertEquals('GET', apiRequest.httpVerb);
        assertEquals('jsonp', apiRequest.dataType);
        assertTrue($.get.called);
    },
    "test generateApiRequest with all options": function () {
        var apiCommand = '/user/opnsrce/repos',
            testData = {
                username: 'opnsrce'
            },
            httpVerb = 'POST',
            dataType = 'json',
            apiRequest = this.gitjs.generateApiRequest(apiCommand, testData, httpVerb, dataType);
            
        apiRequest.send();
        
        assertEquals(testData, apiRequest.data);
        assertEquals('https://api.github.com' + apiCommand, apiRequest.url);
        assertTypeOf('function', apiRequest.send);
        assertEquals(httpVerb, apiRequest.httpVerb);
        assertEquals(dataType, apiRequest.dataType);
        assertTrue($.get.called);
    },
    "test slash added to non-slashed commands": function() {
        var apiCommand = 'user/opnsrce/repos',
            apiRequest = this.gitjs.generateApiRequest(apiCommand);
        
        assertEquals(apiRequest.url, 'https://api.github.com/' + apiCommand);
        
    }
});
