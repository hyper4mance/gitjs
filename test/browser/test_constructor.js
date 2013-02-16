(function (G) {
    'use strict';

    buster.testCase("configDefaultsTest", {
        setUp: function () {
            this.gitjs = new G();
        },
        tearDown: function () {
            delete this.gitJs;
        },
        "test default config options": function () {
            var configDefaults = {
                inheriting: false,
                clientId: undefined,
                accessToken: undefined,
                baseUrl: 'https://api.github.com'
            };
            assert.equals(this.gitjs.config, configDefaults);
        },
        "test that this.gitjs is instance of GitJS": function () {
            assert(this.gitjs instanceof GitJs);
        },
        "test that this.gitjs constructor is GitJs": function () {
            assert.equals(this.gitjs.constructor, GitJs);
        },
        "test default config override": function () {
            var expectedConfig = {
                inheriting: true,
                clientId: '123',
                accessToken: '456',
                baseUrl: 'https://www.cnn.com'
            };

            this.gitjs = new GitJs(expectedConfig);

            assert.equals(this.gitjs.config, expectedConfig);
        }
    });
}(GitJs));