(function (G) {
    'use strict';

    module('Constructor Tests', {
        setup: function () {
            this.gitJs = new G();
        },
        teardown: function () {
            delete this.gitJs;
        }
    });

    test('test that this.gitjs is instance of GitJS', function () {
            ok(this.gitJs instanceof G);
    });

    test('test that this.gitjs constructor is GitJs', function () {
        ok(this.gitJs.constructor, G);
    });

    test('test that an empty config gets the default config options set', function() {
        var gitJs = new G(),
            expectedConfig;

        expectedConfig = {
            accessToken: undefined,
            clientId: undefined,
            inheriting: false,
            baseUrl: 'https://api.github.com'
        };

        deepEqual(gitJs.config, expectedConfig);
    });
}(GitJs));