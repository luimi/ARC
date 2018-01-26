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
.factory('ACL', [function(){
	return function(){
		var acl=new Parse.ACL();
		acl.setPublicReadAccess(true);
		acl.setWriteAccess(Parse.User.current(), true);
		return acl;
	}
}])
.factory('Objeto', [function(){
	return {
		generico:function(clase){
			var Generico = Parse.Object.extend(clase);
			return new Generico();
		},
		id:function(clase,id){
			var Generico = Parse.Object.extend(clase);
			var generico =new Generico();
			generico.id=id;
			return generico
		}
	}
}]);