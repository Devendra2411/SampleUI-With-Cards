define(['angular', '../dashboard'], function(angular, directives) {
    'use strict';
    directives.directive('action-menu', ['$parse','$scope', function ($parse,$scope) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
        	   
        	   
        	   scope.$watch( 'loadPreferenceDetails', function(val) {
                   var changes = {
                       left : val.x + 'px',
                       top  : val.y + 'px',
                       backgroundColor : val.color
                   }

                   element.css( changes );
               }, true );
        	   
              angular.element( document ).on( "click", ".actionBtn", function(e) {
            	  angular.element('.actionMenu').hide();
            	  angular.element('.actionMenu').css({top:0,left:0});
      			var pos = $(this).offset();
      			pos.top = pos.top;
      			pos.left = pos.left-120;
      			angular.element('.actionMenu').css({position:"absolute"});
      			angular.element('.actionMenu').show();
      			angular.element('.actionMenu').offset( pos );
      		});
      		angular.element(document).mouseup(function (e)
      				{
      				    var container = angular.element(".actionMenu");

      				    if (!container.is(e.target) // if the target of the click isn't the container...
      				        && container.has(e.target).length === 0) // ... nor a descendant of the container
      				    {
      				        container.hide();
      				    }
      				})
           },
        template:'<button style="background: none;border: none" value="" class="actionBtn flex flex--center flex--middle style-scope aha-table"><i class="fa fa-bars" style="color: #0a9ec1" aria-hidden="true"></i></button>'
        };
     }]);

    return directives;
});


