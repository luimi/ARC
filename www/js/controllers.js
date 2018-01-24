angular.module('app.controllers', [])
  
.controller('loginCtrl', ['$scope', '$stateParams','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state) {
	continuar=function(){
		$state.go('tuLista');
	}
	if(Parse.User.current()){
		continuar();
	}
	
	$scope.entrar=function(){
		Parse.FacebookUtils.logIn(null, {
		  success: function(user) {
		    continuar();
		  },
		  error: function(user, error) {
		  	alert("Es necesario entrar con Facebook");
		  }
		});
	}
}])
   
.controller('tuListaCtrl', ['$scope', '$stateParams', '$state','$ionicPopup', '$timeout',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state ,$ionicPopup, $timeout) {
	$scope.$on('$ionicView.beforeEnter',function(){
		listar();
	});
	var listar=function(){
		new Parse.Query("Lista").equalTo("usuario",Parse.User.current()).find({
			success:function(results){
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
				$scope.listas[index].destroy({
					success:function(obj){
						listar();
					}
				});
			}
		});
	}

}])
   
.controller('nuevaListaCtrl', ['$scope', '$stateParams','Objeto','$state',
	'$ionicHistory',
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,Objeto,$state,$ionicHistory) {
	$scope.nuevo={};

	$scope.guardar=function(){
		if($scope.nuevo.nombre && $scope.nuevo.descripcion){
			$scope.nuevo.usuario=Parse.User.current();
			Objeto("Lista").save($scope.nuevo,{success:function(obj){
				$ionicHistory.goBack();
			}});
		}else{
			alert("Faltan campos por ingresar");
		}
	}

}])
   
.controller('itemsCtrl', ['$scope', '$stateParams', '$state','cargarLista',
	'$ionicHistory',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,cargarLista,$ionicHistory) {
	$scope.$on('$ionicView.beforeEnter',function(){
		listarArticulos();
	});
	var listarArticulos=function(){
		new Parse.Query("Articulo").equalTo("lista",$scope.lista).find({
			success:function(articulos){
				$scope.articulos=articulos;
				$scope.$apply();
			}
		});
	}
	if($state.params.lista){
		cargarLista($state.params.lista,$scope,function(){
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
	'$ionicPopup','$ionicHistory','$cordovaCamera',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,cargarLista,$state,Objeto,$ionicPopup,$ionicHistory,
	$cordovaCamera) {
	$scope.datos={};
	console.log($cordovaCamera);
	var cargarArticulo=function(){
		new Parse.Query("Articulo").get($state.params.id,{
			success:function(articulo){
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
			$scope.datos.lista=$scope.lista;
			Objeto("Articulo").save($scope.datos,{
				success:function(obj){
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
				$scope.articulo.destroy({
					success:function(){
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
	      targetWidth: 640,
	      targetHeight: 640,
	      popoverOptions: CameraPopoverOptions,
	      saveToPhotoAlbum: false,
		  correctOrientation:true
	    };
	    $cordovaCamera.getPicture(options).then(function(imageData) {
	      image.src = "data:image/jpeg;base64," + imageData;

	    }, function(err) {
	    	console.log(err);
	    });
	}

}])

 