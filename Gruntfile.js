/**
 * Grunt configuration.
 * Define base grunt configuration and loads tasks from
 * task directory and prefixes tasks with task file name, so
 * that they don't cause rebuild of each others when changes
 * are detected by watch.
 *
 * If adding new grunt modules and tasks, then remember to add them
 * to buildOrder array in correct place. That array defines order of
 * tasks when calling 'build'-task or default.
 *
 * @author Kari Heikkinen <kari.heikkinen@iki.fi>
 * @copyright Kari Heikkinen
 * @licence MIT
 */

var _ = require('underscore');

module.exports = function ( grunt ) {
    /**
     * Define task build order here.
     */
    var buildOrder = [
        'clean',
        'jshint',
        'mochaTest',
        'mocha',
        'ngmin',
        'html2js',
        'less',
        'concat',
        'recess',
        'copy',
        'uglify'
    ];

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    require('load-grunt-tasks')(grunt);


    /**
     * Define base task configuration.
     */
    grunt.config.init( {
        pkg: grunt.file.readJSON( 'package.json' ),

        build_dir: '.build',
        dist_dir: 'static',

        clean: {
            build: [ '<%= build_dir %>', '<%= dist_dir %>' ]
        },
        concurrent: {
            dev: {
                tasks: [ 'delta', 'nodemon' ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });


    /**
     * Load task configurations.
     */
    var configurations = {};
    _.each( grunt.file.expand( 'tasks/*.js' ), function( file ) {
        // Remove extension and path
        var key = file.replace(/\.js$/,'').replace( /^.*\//, '' );
        configurations[key] = require( './' + file );
    });


    /**
     * Append other configurations
     */
    // Helper function to append task
    function appendTask( task, subtask, conf ) {
        var taskConfig = grunt.config.get( task ) || {};
        taskConfig[subtask] = conf;
        grunt.config.set( task, taskConfig );
    }

    // Loop all configurations
    _.each( configurations, function( conf, build ) {

        _.each( conf, function( taskConfig, task ) {
            if( task === 'watch' ) {
                task = 'delta'
            }

            if( taskConfig instanceof Array ) {
                _.each( taskConfig, function( config, idx ) {
                    appendTask( task, build + idx, config );
                });
            }
            else {
                appendTask( task, build, taskConfig );
            }
        });
    });



    /**
     * Define build task and order. Only use task that are actually defined in configuration,
     * so that build will not fail for tasks that aren't used.
     */
    var fullConf = grunt.config.get();
    grunt.task.registerTask( 'build', _.intersection( _.keys( fullConf ), buildOrder ) );

    if( fullConf.hasOwnProperty( 'delta' ) ) {
        /**
         * Fix watch tasks to run only own sub tasks. So that example build 'app' is configured to watch
         * change to *.js files and run tasks 'jshint' and 'concat', then those watch tasks are changed
         * to 'jshint:app' and 'concat:app', so that they will not run other builds when they change.
         */
        _.each( fullConf.delta, function( conf, taskname ) {
            // Remove trailing index number
            var build = taskname.replace( /\d*$/, '' );
            var tasks = [];
            _.each( conf.tasks, function( task ) {
                var builds = _.keys( fullConf[ task ] );
                _.each( builds, function( subtask ) {
                    if( subtask.indexOf( build ) === 0 ) {
                        tasks.push( task+':'+subtask );
                    }
                });
            });
            conf.tasks = tasks;
        });
        // Set updated config
        grunt.config.set('delta', fullConf.delta );

        /**
         * Rename watch task and defined new version, so that we get everything built before
         * we start to watch changes.
         */
        grunt.task.renameTask( 'watch', 'delta' );
        grunt.task.registerTask( 'watch', [ 'clean', 'build', 'concurrent' ] );
        grunt.task.registerTask( 'dev', [ 'watch' ] );
    }

    grunt.task.registerTask( 'default', ['build'] );
}
