var config = module.exports;

config['Browser Tests'] = {
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
        'test/test_*.js'
    ]
};