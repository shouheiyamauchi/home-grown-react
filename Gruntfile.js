module.exports = function (grunt) {
   grunt.initConfig({
      browserify: {
         dist: {
            options: {
               transform: [
                  ["babelify"]
               ]
            },
            files: {
              "./dist/bundle.js": ["./src/index.js"]
            }
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.registerTask("default", ["browserify"]);
};
