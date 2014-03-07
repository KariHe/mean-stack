/**
 * @author Kari Heikkinen <kari.heikkinen@iki.fi>
 * @licence MIT
 */

angular.module( 'MEAN.common', [ 'MEAN.templates', 'ngSanitize' ] )
    .directive('tagsInput', function( $timeout ) {
        return {
            restrict: "AE",
            //replace: true,
            require: 'ngModel',
            scope: {
                tags: '=ngModel',
                onAddTag: '=',
                onInputChange: '=',
                autoComplete: '=',
                autoCompleteSize: '@'
            },
            templateUrl: 'common/tags-input/template.html',
            link: function( scope, element, attrs ) {
                // Tag tittle getter for object attribute
                function getTagTitleField( tag ) {
                    return tag[attrs.tagTitleField] || tag;
                }

                // Tag title getter for unknown tag format.
                // Check is toString define or return full tag.
                function getTagTitleOther( tag ) {
                    if( typeof tag === 'object' ) {
                        if( tag.hasOwnProperty('toString') ) {
                            return tag.toString();
                        }
                    }
                    return tag;
                }
                // Get tag title from specified field or return tag
                scope.getTitle = ( attrs.tagTitleField ? getTagTitleField : getTagTitleOther );


                // Add tag by validating it by external function
                function addTagExternal( tag ) {
                    var validated = scope.onAddTag( tag );
                    if( ! validated )
                        return;

                    scope.tags.push( validated );
                    scope.inputText = '';
                    scope.selection = -1;
                }

                // Internal tag insert function, add as string or if tag title
                // field is defined then create object with that field.
                function addTagInternal( tag ) {
                    if( typeof tag === 'string' && attrs.tagTitleField ) {
                        var tmp = {};
                        tmp[attrs.tagTitleField] = tag;
                        tag = tmp;
                    }

                    scope.tags.push( tag );
                    scope.inputText = '';
                    scope.selection = -1;
                }

                // Add new tag to model
                scope.addTag = ( scope.onAddTag ? addTagExternal : addTagInternal );

                // Remove tag from model. If index argument is given,
                // that index will be removed. If index argument is not
                // given then last tag is pop from array.
                scope.removeTag = function( index ) {
                    if( typeof index !== 'number' ) {
                        scope.tags.pop();
                    }
                    else {
                        scope.tags.splice( index, 1 );
                    }
                };

                // Text input handling
                scope.inputText = '';
                scope.$watch( 'inputText', inputChange, true );
                var inputHandlers = [];
                function inputChange(  newVal ) {
                    _.each( inputHandlers, function( handler ) {
                        handler( newVal );
                    });
                    scope.selection = -1;
                }

                // If defined input change listener, then add it to handlers
                if( scope.onInputChange ) {
                    inputHandlers.push( scope.onInputChange );
                }

                // If defined auto complete handler, then add it to hanlers
                if( scope.autoComplete ){
                    scope.autoCompleteList = [];
                    inputHandlers.push( function( input ) {
                        scope.autoCompleteList = scope.autoComplete( input );
                    });
                }

                // Set auto complete size limit
                if( !scope.autoCompleteSize ) {
                    scope.autoCompleteSize = 5;
                }

                // Handlers for  auto complete list navigation
                scope.selection = -1;
                scope.selectNext = function() {
                    if( scope.autoCompleteList.length ) {
                        scope.selection++;
                        if( scope.selection >= scope.autoCompleteList.length )
                            scope.selection = 0;
                    }
                };

                scope.selectPrev = function() {
                    if( scope.autoCompleteList.length ) {
                        scope.selection--;
                        if( scope.selection < 0 )
                            scope.selection =  scope.autoCompleteList.length-1;
                    }
                };


                // Bind input field key functions
                var inputElem = angular.element( element.find( 'input' ) );

                inputElem.bind('keydown', function( event ) {
                    var key = event.which;
                    switch( key ) {
                        case 8: // backspace
                            // If not disabled backspace tag delete and input length
                            // is zero, then remove previous tag.
                            if( !attrs.hasOwnProperty('noBackspaceTagDelete') &&
                                scope.inputText.length === 0 ) {
                                scope.$apply( scope.removeTag );
                            }
                            break;

                        case 9: // tab
                            // Prevent default if tab is disabled
                            if( attrs.hasOwnProperty('disableTab') ) {
                                event.preventDefault();
                            }
                            // Prevent default if we have text and some thing auto complete
                            else if( scope.inputText.length && scope.autoCompleteList.length > 0 ) {
                                event.preventDefault();
                            }
                            break;

                        case 38: // up
                            if( attrs.autoComplete ) {
                                scope.$apply( scope.selectPrev );
                            }
                            break;

                        case 40: // down
                            if( attrs.autoComplete ) {
                                scope.$apply( scope.selectNext );
                            }
                            break;
                    }
                });

                inputElem.bind('keyup', function( event ) {
                    var key = event.which;
                    switch( key ) {
                        case 13: // enter
                            // If auto complete in use and something is selected from
                            // list, then enter will pass that element to addTag handler.
                            if( scope.autoComplete ) {
                                if( scope.selection > -1 &&
                                    scope.selection < scope.autoCompleteList.length ) {
                                    scope.$apply( function() {
                                        scope.addTag( scope.autoCompleteList[scope.selection] );
                                    });
                                    return;
                                }
                            }

                            // ... otherwise input text is passed to addTag handler.
                            scope.$apply( function() {
                                scope.addTag( scope.inputText );
                            });
                            break;

                        case 9: // tab
                            // If input text and auto complete list have items, then
                            // tab inserts first element
                            if( scope.inputText.length && scope.autoCompleteList.length > 0 ) {
                                scope.$apply( function() {
                                    scope.addTag( scope.autoCompleteList[0] );
                                });
                            }
                            break;
                    }

                });

                // Handle input field dynamic width
                scope.inputStyle = { width: 150 };

                scope.containerSize = { width: 0 };
                scope.$watch('containerSize', updateInputSize );

                scope.tagsSize = { width: 0 };
                scope.$watch('tagsSize', updateInputSize );

                // Update input field width to match space left in container
                function updateWidth() {
                    scope.inputStyle.width = scope.containerSize.width - scope.tagsSize.width - 30;
                    if( scope.inputStyle.width < 150 )
                        scope.inputStyle.width = scope.containerSize.width - 30;
                }

                // Hack to delay element size modifications on load
                var firstLoad = true;
                function updateInputSize() {
                    if( firstLoad ) {
                        $timeout( updateWidth , 30 );
                        firstLoad = false;
                    }
                    else {
                        updateWidth();
                    }
                }

            }
        };
    }).directive('tagiElementSize', function ( $window , $log ) {
        return {
            restrict: "A",
            link: function (scope, element, attrs ) {
                // Check that variable is defined
                if( !attrs.tagiElementSize ) {
                    $log.error( 'tagi-element-size attribute don`t have variable defined' );
                    return;
                }

                // Get element size
                scope.getElementDimensions = function () {
                    return { 'h': element.height(), 'w': element.width() };
                };

                // Watch element size changes
                scope.$watch(scope.getElementDimensions, function( newValue ) {
                    scope[attrs.tagiElementSize] = {
                        'height': newValue.h,
                        'width': newValue.w
                    };
                }, true);

                // Bind scope watch to resize
                var w = angular.element( $window );
                w.bind('resize', function () {
                    scope.$apply();
                });
            }
        };
    }).directive('tagiElementWidthLeft', function ( $window, $log ) {
        return {
            restrict: "A",
            link: function (scope, element, attrs ) {
                // Check that variable is defined to attribute
                if( !attrs.tagiElementWidthLeft ) {
                    $log.error( 'tagi-element-width-left attribute don`t have variable defined' );
                    return;
                }

                // Get element child dimension, width is get from
                // last child element right edge, so that we can calculate
                // how much space is left in parent element.
                scope.getElementDimensions = function () {
                    var dim = {
                        'h': element.height(),
                        'w': 0
                    };
                    // Get last child element
                    var lastChild = element.children(':last');
                    // If no children, return zero width
                    if( !lastChild )
                        return dim;

                    // Get last element right position, relative to parent
                    var childElem = angular.element( lastChild );
                    // Get child position, if not defined we don't have child elements
                    var position = childElem.position();
                    if( !position ) return dim;

                    // Calculate right position
                    dim.w = ( childElem.position().left + childElem.width() ) - element.position().left;
                    // ... and height
                    dim.h = ( childElem.position().top + childElem.height() ) - element.position().top;

                    return dim;
                };

                // Watch element size changes
                scope.$watch(scope.getElementDimensions, function( newValue ) {
                    scope[attrs.tagiElementWidthLeft] = {
                        'height': newValue.h,
                        'width': newValue.w
                    };
                }, true);

                // Bind scope watch to resize
                var w = angular.element( $window );
                w.bind('resize', function () {
                    scope.$apply();
                });
            }
        };
    }).filter('boldtext', function( $log ) {
        return function( text, selection ) {
            var regExp = new RegExp( selection, 'i' );
            var result = regExp.exec( text );

            // If not found return text as it is
            if( ! result )
                return text;

            // Split text to parts and add bold tags
            var parts = [];
            parts.push( text.slice( 0, result.index ) );
            parts.push( '<b>' );
            parts.push( result );
            parts.push( '</b>' );
            parts.push( text.slice( result.index + selection.length ) );
            return parts.join('');
        };
    });
