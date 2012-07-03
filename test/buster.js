server: http://127.0.0.1:4224

load:
  - src/*.js
  - test/deps/*.js
  - test/*.js
  
plugin:
 - name: "coverage"
   jar: "test/deps/plugins/coverage.jar"
   module: "com.google.jstestdriver.coverage.CoverageModule"