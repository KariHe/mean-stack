/**
 * Server build configuration
 */

module.exports = {
    /**
     * Run jshint to server code, for syntax check
     */
    jshint: {
        src: [ 'server/**/*.js', '!server/**/*.test.js' ]
    },

    /**
     * Define unit test files
     */
    mochaTest: {
        options: {
            require: [ 'should' ]
        },
        src: [ 'server/**/*.test.js' ]
    },

    /**
     * Watch changes to java script files.
     */
    watch: [
        /* If application code change, then run jshint + unit tests */
        {
            files: [ 'server/**/*.js', '!server/**/*.test.js' ],
            tasks: [ 'jshint', 'mochaTest' ]
        },
        /* If test files change */
        {
            files: [ 'server/**/*.test.js' ],
            tasks: [ 'mochaTest' ]
        }
    ],

    /**
     * Watch and (re)start server
     */
    nodemon: {
        script: 'server.js',
        env: {
            NODE_ENV: 'development'
        },
        options: {
            watch: [ 'server' ],
            ext: 'js',
            delay: 1
        }

    }
};