function changeBackgroundImage(){
	var images = ['image1.png', 'image2.png'];
	console.log($('.filling1').css('background-image'));
	console.log($('.filling1').css('border'));
 		//document.getElementById('animalBg').style.backgroundImage = 'url(/images/animals/image1.png)';
 		var test = document.getElementById('animalBg');
 		console.log(test);
 	if($('.animal').css('border') != ''){
 //	if($('.filling1').css('background-image') == 'none'){
		//$('.animal').css({'background-image': 'url(/images/animals/' + images[Math.floor(Math.random() * images.length)] + ')'});
//		document.getElementById('animalBg').style.backgroundImage = 'url(/images/animals/image1.png)';
	}
}

var app = angular.module('myApp', [
 //all this is new
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'ngTouch',
  'swipe'
 ]);

app.directive('stickyNote', function(socket) {
	var linker = function(scope, element, attrs) {
			element.draggable({
				stop: function(event, ui) {
					socket.emit('moveNote', {
						id: scope.note.id,
						x: ui.position.left,
						y: ui.position.top
					});

					//  var images = ['image1.png', 'image2.png'];
					//  console.log($('.filling1').css('background-image'));
					//  if($('.filling1').css('background-image') != 'url("http://localhost:3000/images/animals/image1.png")'){
					// 	 $('.filling1').css({'background-image': 'url(/images/animals/' + images[Math.floor(Math.random() * images.length)] + ')'});
					// }
					//$('.animal').css({'border': 'black solid 1px'});
				//	$('.filling1').css({'background-color': 'transparent'});
				}
			});

			socket.on('onNoteMoved', function(data) {
				// Update if the same note
				// var images = ['image1.png', 'image2.png'];
				// $('body').css({'background-image': 'url(/images/animals/' + images[Math.floor(Math.random() * images.length)] + ')'});
				
				if(data.id == scope.note.id) {
					//if(data.x <1000){
						element.animate({
							left: data.x,
							top: data.y,
							// backgroundColor: "black",
							// background: 'url("/images/antelopeBubble2.png") top left repeat !important'
							// backgroundImage: "url(/images/animals/image1.png)"
						});
					//}
					// element.style({
					// 	border:"10px solid black"
					// });
				}
			});

			// Some DOM initiation to make it nice
			element.css('left', '10px');
			element.css('top', '50px');
			element.hide().fadeIn();
		};

	var controller = function($scope) {
			// Incoming
			socket.on('onNoteUpdated', function(data) {
				// Update if the same note
				if(data.id == $scope.note.id) {
					$scope.note.title = data.title;
					$scope.note.body = data.body;
				}				
			});

			// Outgoing
			$scope.updateNote = function(note) {
				socket.emit('updateNote', note);
			};

			$scope.deleteNote = function(id) {
				$scope.ondelete({
					id: id
				});
			};
		};

	return {
		restrict: 'A',
		link: linker,
		controller: controller,
		scope: {
			note: '=',
			ondelete: '&'
		}
	};
});

// app.directive('swipableAnimal', function(socket) {

// 	var linker = function(scope, element, attrs) {
// 			element.draggable({
// 				stop: function(event, ui) {
// 					socket.emit('moveNote', {
// 						id: scope.note.id,
// 						x: ui.position.left,
// 						y: ui.position.top
// 					});
// 					 // console.log(ui.position.left);
// 					 // console.log("ui.position.left");
// 				}
// 			});

// 			socket.on('onNoteMoved', function(data) {
// 				// Update if the same note
// 				if(data.id == scope.note.id) {
// 					element.animate({
// 						left: data.x,
// 						top: data.y
// 					});
// 				}
// 			});

// 			// Some DOM initiation to make it nice
// 			element.css('left', '10px');
// 			element.css('top', '50px');
// 			element.hide().fadeIn();
// 		};

// 	var controller = function($scope) {
// 			// Incoming
// 			socket.on('onNoteUpdated', function(data) {
// 				// Update if the same note
// 				if(data.id == $scope.note.id) {
// 					$scope.note.title = data.title;
// 					$scope.note.body = data.body;
// 				}				
// 			});

// 			// Outgoing
// 			$scope.updateNote = function(note) {
// 				socket.emit('updateNote', note);
// 			};

// 			$scope.deleteNote = function(id) {
// 				$scope.ondelete({
// 					id: id
// 				});
// 			};
// 		};

// 	return {
// 		restrict: 'A',
// 		link: linker,
// 		controller: controller,
// 		scope: {
// 			note: '=',
// 			ondelete: '&'
// 		}
// 	};
// });

app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

app.controller('MainCtrl', function($scope, socket) {

	$scope.notes = [];

	// Incoming
	socket.on('onNoteCreated', function(data) {
		$scope.notes.push(data);
		//changeBackgroundImage();
	});

	socket.on('onNoteDeleted', function(data) {
		$scope.handleDeletedNoted(data.id);
	});

	// Outgoing
	//NEW
	// $scope.swipeLeft = function(){
	// 	//socket.emit('swipeLeft', "OK");
	// }

	$scope.createNote = function() {
		var note = {
			id: new Date().getTime(),
			title: 'New Note',
			body: 'Pending'
		};

		$scope.notes.push(note);
		socket.emit('createNote', note);
		//IMPORTANT	
		//changeBackgroundImage();

	};

	$scope.deleteNote = function(id) {
		$scope.handleDeletedNoted(id);

		socket.emit('deleteNote', {id: id});
	};

	$scope.handleDeletedNoted = function(id) {
		var oldNotes = $scope.notes,
		newNotes = [];

		angular.forEach(oldNotes, function(note) {
			if(note.id !== id) newNotes.push(note);
		});

		$scope.notes = newNotes;
	}
	//this is new
	$scope.swipe = function($event) {
    	//console.log($event);
  	}	
	// $scope.swipe = function($event) {
 //    	//console.log($event);
 //    	socket.emit('swipeLeft', "OK");
	// 	console.log("TESTTESTTESTTESTTEST");
 //  	}		
});

//this is new
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);