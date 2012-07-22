var config = module.exports;

config['GitJs Tests'] = {
    rootPath: '../',
    environment: 'browser',
    sources: [
        'src/Gitjs.js'
    ],
    deps: [
        'test/deps/*.js'
    ],
    testHelpers: [
        'test/helpers/*.js'
    ],
    tests: [
        'test/test_constructor.js',
        'test/test_generateApiRequest.js',
        'test/test_generateAuthorizationLink.js',
        'test/test_getReposByOrg.js',
        'test/test_getGistComments.js'
    ]
};