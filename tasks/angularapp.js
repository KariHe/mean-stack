/**
 * Angular application build configuration
 */

module.exports = {
    meta: {
        banner: '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * MEAN boilerplate angular application\n' +
            ' *\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
            ' */\n'
    },

    jshint: {
        src: [ 'app/**/*.js', '!app/**/*.test.js' ]
    },

    ngmin: {
        expand: true,
        src: [ 'app/**/*.js', '!app/**/*.test.js' ],
        dest: '<%= build_dir %>/angular_app'
    },

    html2js: {
        options: {
            base: 'app'
        },
        src: [ 'app/templates/**/*.html', 'app/common/**/*.html' ],
        dest: '<%= build_dir %>/angular_app/templates.js',
        module: 'MEAN.templates'
    },

    concat: {
        options:{
            banner: '<%= meta.angularapp.banner %>'
        },
        src: [ '<%= build_dir %>/angular_app/**/*.js' ],
        dest: '<%= dist_dir %>/js/<%= pkg.name %>.js'
    },
    /*
    recess: {
        flatten: true,
        src: [ 'app/less/*.less' ],
        dest: '<%= dist_dir %>/css/<%= pkg.name %>.css',
        ext: '.css',
        options: {
            compile: true,
            compress: false,
            noUnderscores: false,
            noIDs: false,
            zeroUnits: false
        }
    },
    */
    less: {
        options: {
            paths: ["assets/bootstrap/less/"],
            compress: false,
            cleancss: false
        },
        files: {
            '<%= dist_dir %>/css/<%= pkg.name %>.css': "app/less/main.less"
        }
    },

    uglify: {
        expand: true,
        options:{
            banner: '<%= meta.angularapp.banner %>'
        },
        src: '<%= dist_dir %>/js/<%= pkg.name %>.js',
        ext: '.min.js'
    },

    copy: {
        expand: true,
        cwd: 'app/static/',
        src: '**',
        dest: '<%= dist_dir %>/'
    },

    watch: [
        {
            files: [ 'app/**/*.js' ],
            tasks: [ 'jshint', 'ngmin' ]
        },
        {
            files: [ 'app/templates/**/*.html', 'app/common/**/*.html' ],
            tasks: [ 'html2js' ]
        },
        {
            files: [ '<%= build_dir %>/angular_app/**' ],
            tasks: [ 'concat' ]
        },
        {
            files: [ '<%= dist_dir %>/js/<%= pkg.name %>.js' ],
            tasks: [ 'uglify' ]
        },
        {
            files: [ 'app/**/*.less' ],
            tasks: [ 'less' ]
        }
    ]

};
