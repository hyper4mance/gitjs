/*globals buster:true, $:true, GitJs:true*/

(function (G) {
    'use strict';
    var assert = buster.assert;

    buster.testCase("generateAuthorizationLinksTest", {
        setUp: function () {
            this.gitjs = new GitJs();
        },
        tearDown: function () {
            delete this.gitJs;
        },

        "test generateAuthorizationLink method with minimal options": function () {
            var expectedResult = 'https://github.com/login/oauth/authorize?client_id=123';
            assert.equals(this.gitjs.generateAuthorizationLink('123'), expectedResult);
        },
        "test generateAuthorizationLink method with all options": function () {
            var expectedResult = 'https://github.com/login/oauth/authorize?client_id=123&scope=public&redirect_uri=http://www.cnn.com';
            assert.equals(this.gitjs.generateAuthorizationLink('123', {scope: 'public', redirectUri: 'http://www.cnn.com'}), expectedResult);
        }
    });
}(GitJs));
