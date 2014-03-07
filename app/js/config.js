angular.module( 'MEAN' )
    //Setting up route
    .config( function( $routeProvider ) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    })
    //Setting HTML5 Location Mode
    .config( function($locationProvider) {
        $locationProvider.hashPrefix("!");
    });
