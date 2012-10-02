var config = module.exports;

config['Browser Tests'] = {
    rootPath: '../',
    environment: 'browser',
    sources: [
        'src/Gitjs.js'
    ],
    deps: [
        'test/browser/deps/*.js'
    ],
    testHelpers: [
        'test/browser/helpers/*.js'
    ],
    tests: [
        'test/browser/test_*.js'
    ]
};