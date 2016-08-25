var app = angular.module('blog-grigular', ['Data', 'ngRoute', 'ngSanitize', 'ui.bootstrap']);

app.controller('NotesListCtrl', function($scope,  $uibModal, $sce, Model) {
	var notesOnPage = 5;
	$scope.notesCommon = {total: Model.getNotesCount(), pages: createArray(Math.ceil(Model.getNotesCount()/notesOnPage)), currentPage: 1, notesOnPage: notesOnPage, lastNote: Model.getLastNoteDate()}
	
	$scope.$watch('notesCommon.currentPage', function() {
		$scope.loadNotes($scope.notesCommon.currentPage);
    });
	
	$scope.loadNotes = function(page) {
		page--;
		$scope.notes = Model.getNotes(page*$scope.notesCommon.notesOnPage, $scope.notesCommon.notesOnPage);
	}
	
	$scope.selectPage = function(page) {
		if (page >= 1 && page <= $scope.notesCommon.pages.length)
		$scope.notesCommon.currentPage = page;
	}
	
	$scope.openImage = function(url, description) {
		var imageCaption = '';
		if (description) {
			imageCaption += '<div class="well caption-width"><span class="float-right glyphicon glyphicon-remove clickable" ng-click="close()"></span><p class="main-font">' + description + '</p></div>'
		}
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			template: imageCaption + '<a href="' + url + '" target="_blank"><img src="' + url + '" class="limited-width"></a>',
			controller: 'ModalCtrl',
			size: 'lg'
		});
		modalInstance.result.then(function () {
			
		}, function () {
			
		});
	}
	
	$scope.loadNote = function(id, skip) {
		for (note in $scope.notes) {
			if ($scope.notes[note].id === id) {
				$scope.notes[note].previewLength = $scope.notes[note].paragraphs.length;
				console.log($scope.notes[note]);
			}
		}
	};
	
	$scope.getTrustedResource = function(html) {
		return $sce.trustAsHtml(html);
	}
	
});


app.controller('SingleNoteCtrl', function($scope, $routeParams, Model) {
	var noteId = $routeParams.noteId;
	noteId = parseInt(noteId.substring(1, noteId.length));
	$scope.note = Model.getNote(noteId);
	$scope.neighbors = Model.getNeighbors(noteId);
});

app.controller('NavCtrl', function($scope) {
	var date = new Date();
	var daysInUSA = Math.floor((date - 1449696600000)/60000/60/24);
	$scope.commonData = {nav_date: daysInUSA + ' ' + getDays(daysInUSA), currentDaytime: getDaytime(date.getHours())};
});

app.controller('ModalCtrl', function($scope, $uibModalInstance) {
	
	$scope.close = function () {
		$uibModalInstance.close();
	}
	
});

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'templates/notes.html',
				controller: 'NotesListCtrl'
			}).
			when('/notes/:noteId', {
				templateUrl: 'templates/singleNote.html',
				controller: 'SingleNoteCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}
]);

function getDays(days) {
	days_str = days.toString();
	days_str_last = days_str.substring(days_str.length-1, days_str.length);
	days_str_lasttwo = days_str.substring(days_str.length-2, days_str.length);
	if (parseInt(days_str_lasttwo) > 9 && parseInt(days_str_lasttwo) < 20) {
		return 'дней'
	} else {
		if (days_str_last == "1"){
			return 'день' 
		} else if (parseInt(days_str_last) > 1 && parseInt(days_str_last) < 5) {
			return 'дня'
		} else {
			return 'дней'
		}
	}
}

function getDaytime(hour) {
	hour++;
	if (hour>6&&hour<22) 
		return 'day'
	else 
		return 'night'
}

function createArray(length) {
	var result = [];
	for (var i = 1; i < length + 1; i++) {
		result.push(i);
	}
	return result
}
