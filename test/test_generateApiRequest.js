/*globals buster:true, $:true, GitJs:true*/
(function (G, $) {
    'use strict';
    var assert = buster.assert;

    buster.testCase("generateApiRequestTest", {
        setUp: function () {
            this.$get = $.get;
            this.$post = $.post;
            $.get = function () {
                $.get.called = true;
            };
            $.post = function () {
                $.post.called = true;
            };
            this.gitjs = new G();
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

            assert.isObject(apiRequest.data);
            assert.equals(0, Object.keys(apiRequest.data).length);
            assert.equals('https://api.github.com' + apiCommand, apiRequest.url);
            assert.isFunction(apiRequest.send);
            assert.equals('GET', apiRequest.httpVerb);
            assert.equals('jsonp', apiRequest.dataType);
            assert($.get.called);
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

            assert.equals(testData, apiRequest.data);
            assert.equals('https://api.github.com' + apiCommand, apiRequest.url);
            assert.isFunction(apiRequest.send);
            assert.equals(httpVerb, apiRequest.httpVerb);
            assert.equals(dataType, apiRequest.dataType);
            assert($.post.called);
        },
        "test slash added to non-slashed commands": function () {
            var apiCommand = 'user/opnsrce/repos',
                apiRequest = this.gitjs.generateApiRequest(apiCommand);

            assert.equals(apiRequest.url, 'https://api.github.com/' + apiCommand);

        }
    });

}(GitJs, $));