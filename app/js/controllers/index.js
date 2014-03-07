angular.module('MEAN').controller('IndexController',  function ($scope, $log){
	$scope.input1 = 'predefined';


    /*
     * Example 1
     */
    $scope.textTags = [ 'tag1', 'tag2', 'tag3' ];

    /*
     * Example 2
     */
    $scope.objectTags = [
        { id:1, title: 'tag 1' },
        { id:2, title: 'tag 2' },
        { id:3, title: 'tag 3' },
        { id:4, title: 'tag 4' }
    ];

    $scope.createTag = function( input ) {
        if( /.* .*/.test( input ) ) {
            return false;
        }

        $log.log( 'valid tag', input );
        return { id: null, title: input };
    };


    /*
     * Example 3
     */
    $scope.allowedTags = [
        { id: 1, title: 'foobar'},
        { id: 2, title: 'testing'},
        { id: 3, title: 'xanadu'},
        { id: 4, title: 'tag1'},
        { id: 5, title: 'tag2'},
        { id: 6, title: 'tag3'},
        { id: 7, title: 'tag4'},
        { id: 8, title: 'tag5'},
        { id: 9, title: 'tag6'}
    ];
    $scope.tags3 = [$scope.allowedTags[6]];

    $scope.addSelected = function(  input ) {
        $log.log('addSelected', input );

        // If string then typed and pressed enter
        if( typeof input === 'string' ) {
            // Get first element after filter
            return $scope.inputChange(input)[0];
        }

        // If object then it is selected from list
        if( typeof input === 'object' ) {
            return input;
        }

        return false;
    };

    $scope.inputChange = function( input ) {
        // If empty string do not show auto complete
        if( input === '' ) {
            return [];
        }

        // Filter allowed for auto complete
        var regExp = new RegExp( input, 'i' );
        return _.filter( $scope.allowedTags, function( tag ) {
            return regExp.test( tag.title );
        });
    };
});