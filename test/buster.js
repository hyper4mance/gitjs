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
    tests: [
        'test/test_constructor.js',
        'test/test_generateApiRequest.js',
        'test/test_generateAuthorizationLink.js'
    ]
};