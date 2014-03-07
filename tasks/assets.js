/**
 * Application assets build configuration
 */

module.exports = {
    concat: [
        /* Combine all needed js libraries, so that we need to only include one */
        {
            src: [
                'assets/jquery/jquery.min.js',
                'assets/bootstrap/dist/js/bootstrap.min.js',
                'assets/angular/angular.min.js',
                'assets/angular-resource/angular-resource.min.js',
                'assets/angular-route/angular-route.min.js',
                'assets/angular-cookies/angular-cookies.min.js',
                'assets/angular-sanitize/angular-sanitize.min.js',
                'assets/underscore/underscore-min.js'
            ],
            dest: '<%= dist_dir %>/js/assets.js'
        },
        /* Combine libraries css files to one file */
        {
            src: [
                'assets/angular/angular-csp.css',
                'assets/font-awesome/css/font-awesome.min.css'
            ],
            dest: '<%= dist_dir %>/css/assets.css'
        }
    ],

    /**
     * Copy assets to in place to be used in site.
     * Example, json3 for older browsers, font files, debug map files
     */
    copy: {
        files: [
            /* Copy json3 library as asset file, it is only included for older browsers */
            { src: 'assets/json3/lib/json3.min.js', dest: '<%= dist_dir %>/js/json3.min.js' }
            /* For debugging purposes copy map file */
            ,{ src: 'assets/angular/angular.min.js.map', dest: '<%= dist_dir %>/js/angular.min.js.map' }
            /* Copy bootstrap icons */
            ,{ expand: true, cwd: 'assets/bootstrap/dist/', src: ['fonts/**'], dest: '<%= dist_dir %>/' }
            /*  Copy font awesome icons */
            ,{ expand: true, cwd: 'assets/font-awesome/', src: ['fonts/**'], dest: '<%= dist_dir %>/' }
        ]
    },

    watch: {
        files: [ 'assets/**' ],
        tasks: [ 'concat', 'copy' ]
    }
};