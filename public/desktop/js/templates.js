angular.module('adluxe').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('public/dev/views/fireworks.html',
    "<div class=\"page-header text-left\"><ol class=\"breadcrumb\"><li><a href=\"#\">Home</a></li><li class=\"active\">Fireworks demo</li></ol><h1>Fireworks <small>demo</small></h1></div><div class=\"row text-center\"><div class=\"col-lg-12\"><img ng-show=\"desktopConnected && !deviceConnected\" class=\"shadowed bottom-margin\" adluxe-qr data=\"deviceUrl\" alt=\"QR Code for mobile client\"><div class=\"layer-container shadowed bottom-margin\" ng-if=\"desktopConnected && deviceConnected\"><div class=\"layer game\" adluxe-aircraft></div></div></div></div>"
  );


  $templateCache.put('public/dev/views/index.html',
    "<div class=\"page-header inset\"><h1>Adluxe demos</h1></div><p class=\"text-center\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam laoreet sed diam at interdum. Praesent sed ante at urna tempor dictum. Sed luctus, velit nec auctor facilisis, ipsum libero convallis nunc, eget ornare est nulla luctus justo. Vestibulum egestas, ipsum eget dictum consectetur, erat neque luctus mi, in cursus urna eros id arcu. Donec mattis tristique eros, non pharetra nibh. Duis lobortis condimentum lobortis. Nam fringilla convallis erat sed interdum.</p>"
  );

}]);
