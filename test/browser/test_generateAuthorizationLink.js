/*globals buster:true, $:true, GitJs:true*/

(function (G) {
    'use strict';

    module('generateAuthorizationLinks Tests', {
        setup: function () {
            this.gitJs = new G();
        },
        teardown: function () {
            delete this.gitJs;
        }
    });

    test('test generateAuthorizationLink method with minimal options', function () {
            var expectedResult = 'https://github.com/login/oauth/authorize?client_id=123';

            strictEqual(this.gitJs.generateAuthorizationLink('123'), expectedResult);
    });

    test('test generateAuthorizationLink method with all options', function () {
            var expectedResult = 'https://github.com/login/oauth/authorize?client_id=123&scope=public&redirect_uri=http://www.cnn.com';

            strictEqual(this.gitJs.generateAuthorizationLink('123', {scope: 'public', redirectUri: 'http://www.cnn.com'}), expectedResult);
    });
}(GitJs));
