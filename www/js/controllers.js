angular.module('app.controllers', [])
  
.controller('loginCtrl', ['$scope', '$stateParams','$state','$ionicPopup','$ionicLoading',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state,$ionicPopup,$ionicLoading) {
	$scope.usuario={};
	continuar=function(){
		$state.go('tuLista');
	}
	$scope.$on('$ionicView.beforeEnter',function(){
		if(Parse.User.current()){
			continuar();
		}
	});
	$scope.registrar=function(){
		$ionicLoading.show();
		var user = new Parse.User();
		user.set("username", $scope.usuario.nombre);
		user.set("password", $scope.usuario.clave);
		user.signUp(null, {
		  success: function(user) {
		  	$ionicLoading.hide();
		    continuar();
		  },
		  error: function(user, error) {
		  	$ionicLoading.hide();
		    $ionicPopup.alert({
		  		title: 'Login',
         		template: 'Usuario ya existe'
		  	});
		  }
		});
	}
	$scope.entrar=function(){
		$ionicLoading.show();
		Parse.User.logIn($scope.usuario.nombre, $scope.usuario.clave, {
		  success: function(user) {
		  	$ionicLoading.hide();
		    continuar();
		  },
		  error: function(user, error) {
		  	$ionicLoading.hide();
		    $ionicPopup.alert({
		  		title: 'Login',
         		template: 'Usuario y/o contraseña invalidos'
		  	});
		  }
		});
	}
}])
   
.controller('tuListaCtrl', ['$scope', '$stateParams', '$state','$ionicPopup', '$timeout','Objeto','$window','$ionicLoading',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state ,$ionicPopup, $timeout,Objeto,$window,$ionicLoading) {
	var current=Parse.User.current();
	var id=$state.params.id;
	$scope.esUsuario=current!=undefined;

	$scope.$on('$ionicView.beforeEnter',function(){
		listar();

	});
	
	var listar=function(){
		$ionicLoading.show();
		new Parse.Query("Lista")
		.equalTo("usuario",current?current:(id?Objeto.id("_User",id):""))
		.find({
			success:function(results){
				$ionicLoading.hide();
				$scope.listas=results;
				$scope.$apply();

			}
		});
	}
	$scope.nuevo=function(){
		$state.go('nuevaLista');
	}
	$scope.borrar=function(index){
		$ionicPopup.confirm({
			title: 'Borrar lista',
			template: 'Quieres borrar esta lista?'
		}).then(function(res){
			if(res){
				$ionicLoading.show();
				$scope.listas[index].destroy({
					success:function(obj){
						$ionicLoading.hide();
						listar();
					}
				});
			}
		});
	}
	$scope.compartir=function(){
		$window.open("http://lui2mi.rf.gd/ARC/#/lista/"+Parse.User.current().id, "_blank");
	}

}])
   
.controller('nuevaListaCtrl', ['$scope', '$stateParams','Objeto','$state',
	'$ionicHistory','ACL','$ionicLoading',
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,Objeto,$state,$ionicHistory,ACL,$ionicLoading) {
	$scope.nuevo={};

	$scope.guardar=function(){
		if($scope.nuevo.nombre && $scope.nuevo.descripcion){
			$ionicLoading.show();
			$scope.nuevo.usuario=Parse.User.current();
			Objeto.generico("Lista").setACL(ACL()).save($scope.nuevo,{success:function(obj){
				$ionicLoading.hide();
				$ionicHistory.goBack();
			}});
		}else{
			alert("Faltan campos por ingresar");
		}
	}

}])
   
.controller('itemsCtrl', ['$scope', '$stateParams', '$state','cargarLista',
	'$ionicHistory','$ionicLoading',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,cargarLista,$ionicHistory,$ionicLoading) {
	$scope.esUsuario=false;
	$scope.$on('$ionicView.beforeEnter',function(){
		listarArticulos();
	});
	var listarArticulos=function(){
		$ionicLoading.show();
		new Parse.Query("Articulo").equalTo("lista",$scope.lista).find({
			success:function(articulos){
				$ionicLoading.hide();
				$scope.articulos=articulos;
				$scope.$apply();
			}
		});
	}
	if($state.params.lista){
		$ionicLoading.show();
		cargarLista($state.params.lista,$scope,function(){
			$scope.esUsuario=Parse.User.current() && 
				$scope.lista.get('usuario').id==Parse.User.current().id;
			$ionicLoading.hide();
			listarArticulos();
		});
	}else{
		$ionicHistory.goBack();
	}
	$scope.nuevo=function(){
		$state.go('item',{lista:$scope.lista.id});
	}


}])
   
.controller('itemCtrl', ['$scope', '$stateParams', 'cargarLista','$state','Objeto',
	'$ionicPopup','$ionicHistory','$cordovaCamera','ACL','$ionicLoading',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,cargarLista,$state,Objeto,$ionicPopup,$ionicHistory,
	$cordovaCamera,ACL,$ionicLoading) {
	$scope.esUsuario=false;
	$scope.datos={};
	var cargarArticulo=function(){
		$ionicLoading.show();
		new Parse.Query("Articulo").get($state.params.id,{
			success:function(articulo){
				$ionicLoading.hide();
				$scope.articulo=articulo;
				$scope.datos={
					marca:articulo.get('marca'),
					precio:articulo.get('precio'),
					descripcion:articulo.get('descripcion'),
					lugar:articulo.get('lugar')
				};
				$scope.$apply();
			}
		});
	}
	if($state.params.lista){
		cargarLista($state.params.lista,$scope,function(){
			$scope.esUsuario=Parse.User.current() && 
				$scope.lista.get('usuario').id==Parse.User.current().id;
			if($state.params.id)
				cargarArticulo();
		});
	}else{
		$ionicHistory.goBack();
	}
	$scope.guardar=function(){
		if($scope.articulo){
			$scope.articulo.set("marca",$scope.datos.marca);
			$scope.articulo.set("precio",$scope.datos.precio);
			$scope.articulo.set("descripcion",$scope.datos.descripcion);
			$scope.articulo.set("lugar",$scope.datos.lugar);
			$scope.articulo.save();
		}else{
			$ionicLoading.show();
			$scope.datos.lista=$scope.lista;
			Objeto.generico("Articulo").setACL(ACL()).save($scope.datos,{
				success:function(obj){
					$ionicLoading.hide();
					obj.fetch();
					$scope.articulo=obj;
					$scope.$apply();
				}
			});
		}
	}
	$scope.borrar=function(){
		$ionicPopup.confirm({
			title: 'Borrar articulo',
			template: 'Quieres borrar este articulo?'
		}).then(function(res){
			if(res){
				$ionicLoading.show();
				$scope.articulo.destroy({
					success:function(){
						$ionicLoading.hide();
						$ionicHistory.goBack();
					}
				});
			}
		});
	}
	$scope.capturar=function(){
		var options = {
	      quality: 50,
	      destinationType: Camera.DestinationType.DATA_URL,
	      sourceType: Camera.PictureSourceType.CAMERA,
	      allowEdit: true,
	      encodingType: Camera.EncodingType.JPEG,
	      /*targetWidth: 1024,
	      targetHeight: 1024,*/
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: false,
		  correctOrientation:true
	    };
	    $cordovaCamera.getPicture(options).then(function(imageData) {
	      var file = new Parse.File($scope.articulo.id+".jpg", 
	      	{ base64: "data:image/jpeg;base64," + imageData });
	      $ionicLoading.show();
	      $scope.articulo.set("foto",file);
	      $scope.articulo.save(null,{
	      	success:function(){
	      		$scope.articulo.fetch({
	      			success:function(){
	      				$ionicLoading.hide();
	      				$scope.$apply();
	      			}
	      		})
	      	}
	      });
	    }, function(err) {
	    	$ionicPopup.alert({
		  		title: 'Camara',
         		template: err
		  	});
	    });
	}

}])

 