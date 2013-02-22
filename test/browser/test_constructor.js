module('Constructor Tests', {
    setup: function () {
        this.gitJs = new GitJs();
    },
    teardown: function () {
        delete this.gitJs;
    }
});

test('test that this.gitjs is instance of GitJS', function () {
    ok(this.gitJs instanceof GitJs);
});

test('test that this.gitjs constructor is GitJs', function () {
    ok(this.gitJs.constructor, GitJs);
});

test('test that an empty config gets the default config options set', function() {
    var gitJs = new GitJs(),
    expectedConfig;

    expectedConfig = {
        accessToken: undefined,
        clientId: undefined,
        inheriting: false,
        baseUrl: 'https://api.github.com'
    };

    deepEqual(gitJs.config, expectedConfig);
});

test('test that the default config values get overridden when a config object is passed in', function() {
    var gitJs,
    expectedConfig;

    expectedConfig = {
        accessToken: '12345',
        clientId: 'test',
        inheriting: true,
        baseUrl: 'https://api.github.com/v2'
    };

    gitJs = new GitJs(expectedConfig);

    deepEqual(gitJs.config, expectedConfig);
});