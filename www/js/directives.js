angular.module('app.directives', [])
.filter('listafilter', function() {
  return function(items, search) {
    if (!search) {
      return items;
    }
    var filtrados=[];
    for (var i = 0; i < items.length; i++) {
    	if(items[i].get('nombre').toLowerCase().search(search.toLowerCase())>=0){
    		filtrados.push(items[i]);
    	}
    }
    return filtrados;
  };
})
.directive('blankDirective', [function(){

}]);