module.exports = function(grunt) {

    grunt.initConfig({

    });

    grunt.registerTask('run', function(){
        console.log('I am running');
    })

    grunt.registerTask('sleep', function(){
        console.log('I am sleeping');
    })
  
  };