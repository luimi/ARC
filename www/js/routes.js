angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tuLista', {
    url: '/lista',
    templateUrl: 'templates/tuLista.html',
    controller: 'tuListaCtrl'
  })

  .state('nuevaLista', {
    url: '/nuevaLista',
    templateUrl: 'templates/nuevaLista.html',
    controller: 'nuevaListaCtrl'
  })

  .state('items', {
    url: '/articulos/{lista}',
    templateUrl: 'templates/items.html',
    controller: 'itemsCtrl'
  })

  .state('item', {
    url: '/articulo/{lista}/{id}',
    templateUrl: 'templates/item.html',
    controller: 'itemCtrl'
  })

$urlRouterProvider.otherwise('/login')


});