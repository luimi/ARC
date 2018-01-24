angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])
.service('cargarLista', [function(){
	return function(idLista,scope,callback){
		if(scope.lista){
			callback();
		}else{
			new Parse.Query("Lista").get(idLista,{
				success:function(lista){
					scope.lista=lista;
					callback();
				}
			});
		}
	}
}])
.factory('Objeto', [function(){
	return function(clase){
	    var Generico = Parse.Object.extend(clase);
	    return new Generico();
	  }
}]);